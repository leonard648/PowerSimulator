(function () {
  window.Game = window.Game || {};

  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function textParagraphs(value) {
    if (Array.isArray(value)) {
      return value.map(function (line) { return String(line || "").trim(); }).filter(Boolean);
    }
    return String(value || "").split(/\n+/).map(function (line) {
      return line.trim();
    }).filter(Boolean);
  }

  function renderParagraphs(value, className) {
    var cls = className ? ' class="' + className + '"' : "";
    return textParagraphs(value).map(function (line) {
      return '<p' + cls + '>' + escapeHtml(line) + '</p>';
    }).join("");
  }

  function storyParagraphs(story) {
    story = story || {};
    if (story.paragraphs && story.paragraphs.length) return story.paragraphs;
    return [story.hook, story.stakes, story.privateNote, story.officeNote].filter(Boolean);
  }

  var activeView = "main";
  var deckFilter = "全部";
  var selectedDeckId = null;
  var selectedRelationId = "emperor";
  var summaryModalFor = null;

  var deckFilters = [
    { id: "全部", label: "全部" },
    { id: "政务", label: "政务" },
    { id: "法度", label: "法度" },
    { id: "清流", label: "清流" },
    { id: "能吏", label: "能吏" },
    { id: "圆滑", label: "圆滑" },
    { id: "权谋", label: "权谋" },
    { id: "仁政", label: "仁政" }
  ];

  var relationPositions = {
    emperor: [50, 12],
    mentor: [19, 24],
    peers: [77, 28],
    gentry: [82, 60],
    clerks: [62, 78],
    superior: [36, 79],
    rival: [17, 60],
    scholars: [28, 45]
  };

  function pct(value, max) {
    if (max <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  }

  function bar(value, max, reverse) {
    var percentage = pct(value, max);
    var bad = reverse ? percentage >= 66 : percentage <= 33;
    var warn = reverse ? percentage >= 42 : percentage <= 56;
    return '<div class="bar"><div class="bar-fill ' + (bad ? "bad" : warn ? "warn" : "") + '" style="width:' + percentage + '%"></div></div>';
  }

  var helpCatalog = {
    attribute: {
      才学: { group: "属性", desc: "文章、经义、诏书和清议路线的个人底色。", impact: ["对应才学领域处置，如讲学、润色诏书、借清议立论。", "当前版本不直接按属性高低改判定，真正改变事务的是处置效果。"], changedBy: ["开局人物设定；后续属性成长尚未开放。"], max: 10 },
      政务: { group: "属性", desc: "案牍、流程、钱粮和地方治理的个人底色。", impact: ["对应政务领域处置，常处理流程迟滞、钱粮缺口、案卷迟滞。", "当前版本不直接按属性高低改判定，幕友等手段才会额外修正事件阻力。"], changedBy: ["开局人物设定；后续属性成长尚未开放。"], max: 10 },
      权谋: { group: "属性", desc: "密折、把柄、反制和朝争路线的个人底色。", impact: ["对应权谋处置，常处理政敌反扑、朋党反扑、上意不明。", "当前版本不直接按属性高低改判定，权谋标签累计会解锁路线加成。"], changedBy: ["开局人物设定；后续属性成长尚未开放。"], max: 10 },
      口才: { group: "属性", desc: "转圜、陈情、廷辩和人情往来的个人底色。", impact: ["对应口才处置，常用于缓和派系、流言和追责。", "当前版本不直接按属性高低改判定，事务选项决定实际效果。"], changedBy: ["开局人物设定；后续属性成长尚未开放。"], max: 10 },
      操守: { group: "属性", desc: "清名、拒贿、据实上报和仁政选择的个人底色。", impact: ["对应操守处置，常换取清名或压低贪墨诱因。", "当前版本不直接按属性高低改判定，相关处置会改变名声和关系。"], changedBy: ["开局人物设定；后续属性成长尚未开放。"], max: 10 },
      体魄: { group: "属性", desc: "熬夜办案、休养和压力管理的个人底色。", impact: ["对应体魄处置，常与压力、期限、心病相关。", "当前版本不直接按属性高低改判定，压力系统才会影响下季精力。"], changedBy: ["开局人物设定；后续属性成长尚未开放。"], max: 10 }
    },
    resource: {
      energy: { group: "资源", title: "精力", desc: "本季处置事务的主要行动点。", impact: ["支付大多数处置费用；不足时许多选项不能使用。", "每季按官职刷新，压力过高会压低下季精力。"], changedBy: ["新季刷新、事务处置和结算奖励。"], max: 8 },
      money: { group: "资源", title: "银两", desc: "用于钱粮、打点、工程和查旧档。", impact: ["支付财政、工程、人情类处置费用。", "部分铺垫和暗线处置需要银两。"], changedBy: ["年末自然 +1、事务处置和结算奖励。"], max: 12 },
      favor: { group: "资源", title: "人情", desc: "可动用的人脉余量。", impact: ["支付人情、同年、师门、证人等处置费用。", "圆滑路线成熟后可降低部分人情费用。"], changedBy: ["年末自然 +1、关系处置和结算奖励。"], max: 12 },
      pressure: { group: "资源", title: "压力", desc: "仕途和身体的负担。", impact: ["压力 >=8 时，结案后可能留下心病。", "压力 >=10/15 会分别让下季精力额外 -1。", "压力很高且清名较高时，可能走向退而著书的结局。"], changedBy: ["失败后患、冒险处置、连夜筹画、休养和部分沉淀奖励。"], max: 20, reverse: true }
    },
    fame: {
      clean: { group: "名声", title: "清名", desc: "外界认为你是否清正自持。", impact: ["清名高且污点少，容易走向清节留名结局。", "清名会被拒贿、清议、仁政提高，也会被污点和交易损伤。"], changedBy: ["清流/仁政/操守处置、事务结算、污点和失败后患。"], max: 20 },
      competence: { group: "名声", title: "能名", desc: "外界认为你是否能办成事。", impact: ["能名高且贪名不高，容易走向能臣干吏结局。", "成功结案通常会增加能名，治安、流程、钱粮失败会损伤能名。"], changedBy: ["政务/法度/财政处置、成功结案、事件后患。"], max: 20 },
      literary: { group: "名声", title: "文名", desc: "馆阁文章、经义和诗文名望。", impact: ["影响生平评价和翰林阶段的叙事重心。", "文名不足、文辞未备等后患会压低它。"], changedBy: ["讲学、诗文、诏书类处置，相关事件后患。"], max: 20 },
      power: { group: "名声", title: "权名", desc: "外界认为你是否有权势与门路。", impact: ["权名 >=8 后，每年会让朋党烈度更容易上升。", "权名很高且污点多，可能走向权倾后被清算的结局。"], changedBy: ["权谋、密折、弹劾、门生和反制类处置。"], max: 20 },
      cruel: { group: "名声", title: "酷名", desc: "外界认为你是否苛急严酷。", impact: ["酷名 >=8 会导向酷吏干才结局。", "短期常能压案，长期会伤民心和史评。"], changedBy: ["严刑、推出胥吏、威势压服等选择。"], max: 20, reverse: true },
      corruption: { group: "名声", title: "贪名", desc: "外界认为你是否染上财货和灰色交易。", impact: ["贪名高会污染清名路线。", "贪名 >=9 且皇帝信任仍高，可能走向贪名难洗但苟全的结局。"], changedBy: ["遮掩亏空、收受交易、污点和失败后患。"], max: 20, reverse: true }
    },
    world: {
      emperorTrust: { group: "朝局", title: "皇帝信任", desc: "君前对你的可用与可信程度。", impact: ["过低会让朱批疑云、旧案死局等风险更近。", "较高可触发密旨试探等机会，也能支撑部分灰色结局。"], changedBy: ["近君、密折、据实上报、清议过火和事件结算。"], max: 20 },
      scholarOpinion: { group: "朝局", title: "士林评价", desc: "书院、公论和清议圈对你的评价。", impact: ["高士林评价会给清议拥戴和党祸身后名的可能。", "过低会触发公论反噬，清名更容易受损。"], changedBy: ["讲学、联署、清流处置、密折暗线、流言后患。"], max: 20 },
      publicMood: { group: "朝局", title: "民心", desc: "地方百姓对官府处置的感受。", impact: ["民心高且仁政路线足，可能走向救荒有功结局。", "民心低会让灾情、治安、催科类后患更刺眼。"], changedBy: ["赈济、水利、缓征、严刑、商税和灾情后患。"], max: 20 },
      fiscalHealth: { group: "朝局", title: "财政健康", desc: "钱粮和库藏是否稳。", impact: ["财政健康低意味着钱粮后患更重，治理叙事更容易被亏空牵住。", "财政健康高能支撑能吏路线和地方治理。"], changedBy: ["清丈、商税、裁撤冗费、赈济、工程和亏空后患。"], max: 20 },
      factionHeat: { group: "朝局", title: "朋党烈度", desc: "朝中派系互相借题发挥的热度。", impact: ["烈度高意味着派系阻挠、朋党反扑和政敌动作更危险。", "权名 >=8 时，年末会推高朋党烈度。"], changedBy: ["失败后患、权谋操作、延议冷处理、离间朋党。"], max: 20, reverse: true },
      courtPressure: { group: "朝局", title: "朝局压力", desc: "中枢流程、追责和案牍堆积造成的总压力。", impact: ["成功结案会降低它，失败会抬高它。", "它代表朝廷层面的紧绷感，会在总结里进入朝局变化。"], changedBy: ["结案成败、流程迟滞、案卷迟滞、成例压案和严行考成。"], max: 20, reverse: true }
    },
    relation: {
      trust: { group: "关系", title: "信任", desc: "对方相信你能办事、守约或可用。", impact: ["信任或亲近很高时会标记为助力。", "皇帝信任高可带来密旨机会；上司信任高更利于考成叙事。"], changedBy: ["相关人物处置、NPC 事件、成功或失败结算。"], max: 20 },
      suspicion: { group: "关系", title: "猜忌", desc: "主要用于皇帝关系，表示君前疑心。", impact: ["猜忌高会触发朱批疑云。", "皇帝猜忌极高且政敌怨恨深时，旧案可能变成死局。"], changedBy: ["清议过火、御前失分、密折暗线、成功辩清。"], max: 20, reverse: true },
      closeness: { group: "关系", title: "亲近", desc: "师门、同年、士林、地方等与你的距离。", impact: ["亲近高可成为助力，带来人情和事件机会。", "士林亲近高会推动清议拥戴。"], changedBy: ["拜访、转圜、交易、相助和 NPC 事件。"], max: 20 },
      debt: { group: "关系", title: "亏欠", desc: "你欠下的人情账。", impact: ["亏欠高会标记为牵连。", "师门或同年亏欠高，会触发师门逼请一类事件。"], changedBy: ["请托、交易、受援、偿还恩义和结算。"], max: 20, reverse: true },
      resentment: { group: "关系", title: "怨恨", desc: "对方记下的旧账和敌意。", impact: ["怨恨高会标记为危险，并触发关系事件。", "政敌怨恨极高会把旧案推向清算风险。"], changedBy: ["强硬处置、得罪地方/胥吏/政敌、失败后患和缓和类处置。"], max: 20, reverse: true },
      fear: { group: "关系", title: "畏惧", desc: "对方因你的手段或把柄而不敢轻动。", impact: ["畏惧可暂时形成威慑，算作一种强关系。", "畏惧不是信任，常伴随酷名、权谋或后续怨恨。"], changedBy: ["查封、严刑、把柄、反制和成功压服。"], max: 20 }
    }
  };

  function helpAttributes(kind, key, owner) {
    if (!kind) return "";
    var attrs = ' data-help-kind="' + escapeHtml(kind) + '" data-help-key="' + escapeHtml(key || "") + '"';
    if (owner) attrs += ' data-help-owner="' + escapeHtml(owner) + '"';
    return attrs;
  }

  function statBlock(label, value, max, reverse, helpKind, helpKey, helpOwner) {
    var help = helpKind ? helpAttributes(helpKind, helpKey || label, helpOwner) : "";
    return '<div class="stat' + (helpKind ? " stat--help" : "") + '"' + help + (helpKind ? ' role="button" tabindex="0"' : "") + '><b>' + escapeHtml(label) + " " + value + '</b>' + bar(value, max || 20, reverse) + '</div>';
  }

  function helpGroupName(kind) {
    return ({ attribute: "属性", resource: "资源", fame: "名声", world: "朝局", relation: "关系" })[kind] || "说明";
  }

  function personById(id) {
    return (GameData.people || []).find(function (person) { return person.id === id; }) || null;
  }

  function helpInfo(kind, key, owner) {
    var info = helpCatalog[kind] && helpCatalog[kind][key];
    if (!info) return null;
    if (kind !== "relation" || !owner) return info;
    var person = personById(owner);
    return Object.assign({}, info, {
      title: (person ? person.name : "关系") + " · " + info.title
    });
  }

  function helpValue(kind, key, owner) {
    var s = Game.state || {};
    if (kind === "attribute") return s.attributes && s.attributes[key];
    if (kind === "resource") return s.resources && s.resources[key];
    if (kind === "fame") return s.fame && s.fame[key];
    if (kind === "world") return s.world && s.world[key];
    if (kind === "relation") return s.relations && s.relations[owner] && s.relations[owner][key];
    return null;
  }

  function helpStatus(value, max, reverse) {
    if (typeof value !== "number") return "";
    var ratio = max ? value / max : 0;
    if (reverse) {
      if (ratio >= 0.72) return "当前偏高，已经接近明显风险。";
      if (ratio >= 0.42) return "当前需要留意，继续上升会制造后患。";
      return "当前较低，暂时可控。";
    }
    if (ratio >= 0.72) return "当前很强，可以成为路线优势。";
    if (ratio >= 0.42) return "当前中等，可以继续经营。";
    return "当前偏低，相关局面会比较吃力。";
  }

  function renderHelpList(title, lines) {
    if (!lines || !lines.length) return "";
    return '<div class="help-block"><h3>' + escapeHtml(title) + '</h3><ul>' + lines.map(function (line) {
      return '<li>' + escapeHtml(line) + '</li>';
    }).join("") + '</ul></div>';
  }

  function showStatHelp(kind, key, owner) {
    var info = helpInfo(kind, key, owner);
    if (!info) return;
    var value = helpValue(kind, key, owner);
    var max = info.max || (kind === "attribute" ? 10 : 20);
    var valueHtml = typeof value === "number" ? '<div class="help-value"><span>当前值</span><b>' + escapeHtml(value) + '/' + escapeHtml(max) + '</b><em>' + escapeHtml(helpStatus(value, max, !!info.reverse)) + '</em></div>' : "";
    showModal(
      '<div class="help-panel">' +
        '<div class="help-kicker">' + escapeHtml(info.group || helpGroupName(kind)) + '</div>' +
        '<h2>' + escapeHtml(info.title || key) + '</h2>' +
        '<p>' + escapeHtml(info.desc || "") + '</p>' +
        valueHtml +
        renderHelpList("影响内容", info.impact || []) +
        renderHelpList("会被哪些内容影响", info.changedBy || []) +
        '<div class="modal-actions"><button id="help-close">知道了</button></div>' +
      '</div>'
    );
    var close = document.getElementById("help-close");
    if (close) close.addEventListener("click", hideModal);
  }

  function bindHelpButtons() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-help-kind]"), function (node) {
      if (node.dataset.helpBound === "1") return;
      node.dataset.helpBound = "1";
      node.addEventListener("click", function (event) {
        event.stopPropagation();
        showStatHelp(node.getAttribute("data-help-kind"), node.getAttribute("data-help-key"), node.getAttribute("data-help-owner"));
      });
      node.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        showStatHelp(node.getAttribute("data-help-kind"), node.getAttribute("data-help-key"), node.getAttribute("data-help-owner"));
      });
    });
  }

  function signed(value) {
    return value > 0 ? "+" + value : String(value);
  }

  function renderDeltaItem(item) {
    if (item.text) {
      return '<div class="delta-item delta-item--text"><b>' + escapeHtml(item.label) + '</b><span>' + escapeHtml(item.text) + '</span></div>';
    }
    return '<div class="delta-item delta-item--' + escapeHtml(item.direction || "flat") + '">' +
      '<b>' + escapeHtml(item.label) + '</b>' +
      '<span>' + escapeHtml(item.before) + ' → ' + escapeHtml(item.after) + '</span>' +
      '<em>' + escapeHtml(signed(item.delta || 0)) + '</em>' +
    '</div>';
  }

  function renderDeltaGroups(groups) {
    if (!groups || !groups.length) return '<p class="muted">本季没有明显数值变化。</p>';
    return groups.map(function (group) {
      return '<div class="summary-subblock"><h3>' + escapeHtml(group.title) + '</h3><div class="delta-list">' +
        group.items.map(renderDeltaItem).join("") +
      '</div></div>';
    }).join("");
  }

  function renderTrackSummary(trackSummary) {
    var critical = (trackSummary && trackSummary.critical || []).map(function (track) {
      return '<span class="track-pill ' + (track.safe ? "track-pill--safe" : "track-pill--danger") + '">' +
        escapeHtml(track.name) + ' ' + escapeHtml(track.value) + '/' + escapeHtml(track.max) +
      '</span>';
    }).join("");
    var blocked = trackSummary && trackSummary.blocked && trackSummary.blocked.length ? '<p><b>关键未解：</b>' + escapeHtml(trackSummary.blocked.join("、")) + '</p>' : "";
    var unresolved = trackSummary && trackSummary.unresolved && trackSummary.unresolved.length ? '<p><b>后患：</b>' + escapeHtml(trackSummary.unresolved.join("、")) + '</p>' : "";
    return '<div class="summary-track">' +
      '<div class="track-pills">' + (critical || '<span class="muted">无关键阻力记录</span>') + '</div>' +
      blocked + unresolved +
    '</div>';
  }

  function renderNpcBeats(beats) {
    if (!beats || !beats.length) return '<p class="muted">本季没有新的具名人物人情账。</p>';
    return beats.map(function (beat) {
      var changes = beat.changes.map(function (item) {
        return '<span class="npc-ledger-chip npc-ledger-chip--' + escapeHtml(item.direction) + '">' +
          escapeHtml(item.label) + ' ' + escapeHtml(item.before) + '→' + escapeHtml(item.after) + ' <em>' + escapeHtml(signed(item.delta)) + '</em>' +
        '</span>';
      }).join("");
      return '<div class="npc-ledger-row">' +
        '<div class="npc-ledger-head"><b>' + escapeHtml(beat.name) + '</b><span>' + escapeHtml(beat.role) + ' · ' + escapeHtml(beat.group) + '</span></div>' +
        '<div class="npc-ledger-chips">' + changes + '</div>' +
        '<p>' + escapeHtml(beat.text) + '</p>' +
      '</div>';
    }).join("");
  }

  function renderChangeList(changes, emptyText) {
    if (!changes || !changes.length) return '<p class="muted">' + escapeHtml(emptyText) + '</p>';
    return '<div class="delta-list">' + changes.map(function (item) {
      return renderDeltaItem({
        label: item.label + (item.type ? " · " + item.type : ""),
        before: item.before,
        after: item.after,
        delta: item.delta,
        direction: item.direction
      });
    }).join("") + '</div>';
  }

  function cleanSummaryResultText(text) {
    return String(text || "")
      .replace(/\s*仕途结算：[^。]*。?/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function compactNameList(items, limit) {
    var seen = {};
    var names = (items || []).filter(function (item) {
      if (!item || seen[item]) return false;
      seen[item] = true;
      return true;
    });
    var visible = names.slice(0, limit || 4);
    return visible.join("、") + (names.length > visible.length ? "等" : "");
  }

  function summarizeTrackProse(trackSummary) {
    var critical = trackSummary && trackSummary.critical || [];
    var blocked = trackSummary && trackSummary.blocked || [];
    var unresolved = trackSummary && trackSummary.unresolved || [];
    var unsafe = critical.filter(function (track) { return !track.safe; }).map(function (track) { return track.name; });
    var trouble = compactNameList(blocked.length ? blocked : unsafe);
    var aftertaste = compactNameList(unresolved);

    if (trouble && aftertaste) return "案面仍有" + trouble + "没有完全收住，" + aftertaste + "也会在后续回响。";
    if (trouble) return "案面仍有" + trouble + "没有完全收住，后续行事需留一手。";
    if (aftertaste) return "关键阻力大致被压住，但" + aftertaste + "仍会在后续回响。";
    if (critical.length) return "几处关键阻力大致压住，案面暂可收口。";
    return "案卷归档时，台面上没有留下显眼的关键阻力。";
  }

  function relationChangePhrase(label, delta) {
    var parts = String(label || "").split("·");
    var target = parts[0] || "旁人";
    var metric = parts[1] || "";
    if (metric === "亏欠") return delta > 0 ? "与" + target + "的人情债加深" : "欠" + target + "的人情账稍有抹平";
    if (metric === "怨恨") return delta > 0 ? target + "旧怨加深" : target + "怨气稍缓";
    if (metric === "亲近") return delta > 0 ? "与" + target + "更近了一步" : "与" + target + "略显疏离";
    if (metric === "信任") return delta > 0 ? target + "信任更稳" : target + "信任转薄";
    if (metric === "猜忌") return delta > 0 ? target + "猜忌加深" : target + "猜忌稍退";
    if (metric === "畏惧") return delta > 0 ? target + "畏惧更重" : target + "畏惧稍减";
    return label + (delta > 0 ? "有所抬升" : "有所回落");
  }

  function changePhrase(groupTitle, item) {
    var label = item.label || "";
    var delta = item.delta || 0;
    if (item.text && label === "官职") return "官职转入" + (item.afterText || item.text.replace(/.*→\s*/, ""));
    if (label === "官评") return delta > 0 ? "官评更稳" : "官评受挫";

    if (groupTitle === "资源") {
      if (label === "精力") return delta > 0 ? "精力得到回补" : "精力被耗去";
      if (label === "银两") return delta > 0 ? "银两有所进项" : "银两有所支出";
      if (label === "人情") return delta > 0 ? "人情有所回补" : "人情被动用";
      if (label === "压力") return delta > 0 ? "压力加重" : "压力稍缓";
    }

    if (groupTitle === "名声") {
      if (label === "清名") return delta > 0 ? "清名更显" : "清名受损";
      if (label === "能名") return delta > 0 ? "能名更足" : "能名受挫";
      if (label === "文名") return delta > 0 ? "文名更盛" : "文名暗淡";
      if (label === "权名") return delta > 0 ? "权名更重" : "权名收敛";
      if (label === "酷名") return delta > 0 ? "酷名更重" : "酷名稍退";
      if (label === "贪名") return delta > 0 ? "贪名更露" : "贪名稍洗";
    }

    if (groupTitle === "朝局") {
      if (label === "皇帝信任") return delta > 0 ? "上意稍近" : "上意转冷";
      if (label === "士林评价") return delta > 0 ? "士林口碑转好" : "士林口碑转坏";
      if (label === "民心") return delta > 0 ? "民心稍安" : "民心转低";
      if (label === "财政健康") return delta > 0 ? "财政气色转稳" : "财政更吃紧";
      if (label === "朋党烈度") return delta > 0 ? "朋党火势更旺" : "朋党火势稍退";
      if (label === "朝局压力") return delta > 0 ? "朝局压力抬头" : "朝局压力回落";
    }

    if (groupTitle === "阵营关系") return relationChangePhrase(label, delta);
    return label + (delta > 0 ? "有所抬升" : "有所回落");
  }

  function summarizeDeltaGroupsProse(groups) {
    return (groups || []).map(function (group) {
      var phrases = (group.items || []).map(function (item) {
        return changePhrase(group.title, item);
      }).filter(Boolean);
      var limit = group.title === "阵营关系" ? 5 : 4;
      var visible = phrases.slice(0, limit);
      if (phrases.length > visible.length) visible.push("另有若干暗线也随之挪动");
      return visible.length ? group.title + "上，" + visible.join("，") + "。" : "";
    }).filter(Boolean);
  }

  function summarizeNpcBeatsProse(beats) {
    if (!beats || !beats.length) return "";
    var lines = beats.slice(0, 3).map(function (beat) { return beat.text; }).filter(Boolean);
    if (beats.length > lines.length) lines.push("其余具名人物的亲疏恩怨也各自入账。");
    return lines.join("");
  }

  function summarizeCardChangesProse(cardChanges, stainChanges) {
    var lines = [];
    var addedCards = (cardChanges || []).filter(function (item) { return (item.delta || 0) > 0; }).map(function (item) { return "《" + item.label + "》"; });
    var removedCards = (cardChanges || []).filter(function (item) { return (item.delta || 0) < 0; }).map(function (item) { return "《" + item.label + "》"; });
    var addedStains = (stainChanges || []).filter(function (item) { return (item.delta || 0) > 0; }).map(function (item) { return "《" + item.label + "》"; });
    var removedStains = (stainChanges || []).filter(function (item) { return (item.delta || 0) < 0; }).map(function (item) { return "《" + item.label + "》"; });
    if (addedCards.length) lines.push("手段库里沉淀出" + compactNameList(addedCards));
    if (removedCards.length) lines.push(compactNameList(removedCards) + "被裁汰出手段库");
    if (addedStains.length) lines.push("旧痕方面，" + compactNameList(addedStains) + "入档");
    if (removedStains.length) lines.push("旧痕方面，" + compactNameList(removedStains) + "被清去");
    return lines.length ? lines.join("；") + "。" : "";
  }

  function buildSeasonSummaryProse(summary) {
    var lines = [summarizeTrackProse(summary.trackSummary || {})];
    lines = lines.concat(summarizeDeltaGroupsProse(summary.deltaGroups || []));
    var npcText = summarizeNpcBeatsProse(summary.npcBeats || []);
    if (npcText) lines.push(npcText);
    var cardText = summarizeCardChangesProse(summary.cardChanges || [], summary.stainChanges || []);
    if (cardText) lines.push(cardText);
    lines = lines.filter(Boolean);
    return lines.length ? lines.join("") : "本季案卷收束后，台面上没有立刻显出的数值波动或人情新账。";
  }

  function renderRewardOptions(summary) {
    var options = summary.rewardOptions || [];
    if (!options.length) return "";
    if (summary.rewardChosen) {
      var notes = summary.rewardChosen.notes && summary.rewardChosen.notes.length ? '<span>' + escapeHtml(summary.rewardChosen.notes.join("；")) + '</span>' : "";
      return '<section class="summary-section summary-section--wide reward-panel"><div class="panel-title">仕途沉淀</div><div class="reward-picked"><b>' + escapeHtml(summary.rewardChosen.name) + '</b><p>' + escapeHtml(summary.rewardChosen.desc || "") + '</p>' + notes + '</div></section>';
    }
    return '<section class="summary-section summary-section--wide reward-panel"><div class="panel-title">仕途沉淀（三选一）</div><div class="reward-options">' +
      options.map(function (option, index) {
        return '<button class="reward-card" data-reward-index="' + index + '"><b>' + escapeHtml(option.name) + '</b><span>' + escapeHtml(option.desc || "") + '</span></button>';
      }).join("") +
      '</div></section>';
  }

  function renderOfficePackageDraft() {
    var draft = Game.state.pendingOfficeDraft;
    if (!draft || !draft.packages || !draft.packages.length) return "";
    var office = Game.getOfficeById ? Game.getOfficeById(draft.officeId) : null;
    return '<section class="summary-section summary-section--wide reward-panel"><div class="panel-title">升任' + escapeHtml(office ? office.name : "新职") + '：选择任路</div><div class="reward-options">' +
      draft.packages.map(function (pack, index) {
        var cards = (pack.cards || []).map(function (id) {
          var card = Game.cardById(id);
          return card ? card.name : id;
        }).join("、");
        return '<button class="reward-card" data-office-pack-index="' + index + '"><b>' + escapeHtml(pack.name) + '</b><span>' + escapeHtml(pack.desc || "") + '</span><em>沉淀手段：' + escapeHtml(cards) + '</em></button>';
      }).join("") +
      '</div></section>';
  }

  function renderSeasonSummary(summary) {
    var summaryKey = [
      Game.state.year,
      Game.state.seasonIndex,
      summary.eventName || "",
      summary.title || ""
    ].join("|");
    summaryModalFor = summaryKey;
    var story = summary.story ? '<div class="story-box story-box--outcome"><b>余波</b>' + renderParagraphs(summary.story) + '</div>' : "";
    var resultText = cleanSummaryResultText(summary.resultText || "");
    var summaryProse = buildSeasonSummaryProse(summary);
    var rewardHtml = renderRewardOptions(summary);
    var officeDraftHtml = renderOfficePackageDraft();
    var needsReward = summary.rewardOptions && summary.rewardOptions.length && !summary.rewardChosen;
    var needsOfficePack = !!Game.state.pendingOfficeDraft;
    var canContinue = !needsReward && !needsOfficePack;
    showModal(
      '<div class="summary-panel summary--' + escapeHtml(summary.level || "partial") + '">' +
        '<div class="event-title-row"><h2>' + escapeHtml(summary.eventName) + '<span class="event-badge">本季总结</span></h2><div class="event-meta">结案：' + escapeHtml(summary.title || "") + '</div></div>' +
        '<p class="event-desc">' + escapeHtml(resultText || "本季案卷已经归档。") + '</p>' +
        story +
        '<p class="summary-prose">' + escapeHtml(summaryProse) + '</p>' +
        rewardHtml +
        officeDraftHtml +
        '<div class="modal-actions summary-actions"><button id="summary-continue" ' + (canContinue ? "" : "disabled") + '>' + (needsReward ? "先选择沉淀" : needsOfficePack ? "先选择官职包" : "进入下季") + '</button></div>' +
      '</div>'
    );
    Array.prototype.forEach.call(document.querySelectorAll("[data-reward-index]"), function (button) {
      button.addEventListener("click", function () {
        Game.selectReward(Number(button.getAttribute("data-reward-index")));
        summaryModalFor = null;
        Game.UI.render();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-office-pack-index]"), function (button) {
      button.addEventListener("click", function () {
        Game.selectOfficePackage(Number(button.getAttribute("data-office-pack-index")));
        summaryModalFor = null;
        Game.UI.render();
      });
    });
    document.getElementById("summary-continue").addEventListener("click", function () {
      continueFromSummary();
    });
  }

  function continueFromSummary() {
    if (!Game.state || !Game.state.pendingSummary) {
      hideModal();
      return false;
    }
    if (!Game.continueAfterSummary()) return false;
    summaryModalFor = null;
    el("modal").classList.add("hidden");
    Game.UI.render();
    if (Game.state.ended) Game.UI.showEnding();
    return true;
  }

  function maybeShowSeasonSummary() {
    var summary = Game.state.pendingSummary;
    if (!summary) return;
    var summaryKey = [
      Game.state.year,
      Game.state.seasonIndex,
      summary.eventName || "",
      summary.title || ""
    ].join("|");
    if (summaryModalFor !== summaryKey) renderSeasonSummary(summary);
  }

  function cardVisual(card) {
    var type = card.type || "";
    var domain = card.domain || "";
    var tags = card.tags || [];
    if (type === "心病") return { cls: "card--ailment", mark: "病" };
    if (type === "污点" || tags.indexOf("污点") >= 0) return { cls: "card--stain", mark: "污" };
    if (type === "权谋" || tags.indexOf("权谋") >= 0) return { cls: "card--scheme", mark: "谋" };
    if (type === "法度" || type === "弹劾" || tags.indexOf("法度") >= 0) return { cls: "card--law", mark: "法" };
    if (type === "财政" || domain === "财政" || tags.indexOf("财政") >= 0) return { cls: "card--finance", mark: "财" };
    if (type === "政务" || type === "公文" || tags.indexOf("政务") >= 0) return { cls: "card--admin", mark: "政" };
    if (type === "人情" || type === "家族" || type === "人物" || tags.indexOf("人情") >= 0) return { cls: "card--relation", mark: "情" };
    if (type === "奏疏" || type === "清议" || tags.indexOf("清流") >= 0) return { cls: "card--memorial", mark: "奏" };
    if (type === "休养") return { cls: "card--rest", mark: "息" };
    return { cls: "card--paper", mark: type.slice(0, 1) || "策" };
  }

  function renderCostChips(cost) {
    var map = {
      energy: { label: "精", title: "精力", cls: "cost--energy" },
      money: { label: "银", title: "银两", cls: "cost--money" },
      favor: { label: "情", title: "人情", cls: "cost--favor" },
      pressure: { label: "压", title: "压力", cls: "cost--pressure" }
    };
    var keys = Object.keys(cost || {}).filter(function (key) { return !!cost[key]; });
    if (!keys.length) return '<span class="cost-chip cost--free" title="无费用">免</span>';
    return keys.map(function (key) {
      var item = map[key] || { label: key.slice(0, 1), title: key, cls: "cost--other" };
      return '<span class="cost-chip ' + item.cls + '" title="' + escapeHtml(item.title) + '">' +
        '<b>' + escapeHtml(item.label) + '</b><em>' + escapeHtml(cost[key]) + '</em>' +
        '</span>';
    }).join("");
  }

  function renderChoiceResources() {
    var resources = Game.state.resources || {};
    var items = [
      { key: "energy", label: "精力", short: "精", value: resources.energy || 0, max: 8, reverse: false },
      { key: "money", label: "银两", short: "银", value: resources.money || 0, max: 12, reverse: false },
      { key: "favor", label: "人情", short: "情", value: resources.favor || 0, max: 12, reverse: false },
      { key: "pressure", label: "压力", short: "压", value: resources.pressure || 0, max: 20, reverse: true }
    ];
    return '<div class="choice-resource-strip" aria-label="当前资源">' + items.map(function (item) {
      var help = helpAttributes("resource", item.key);
      return '<div class="choice-resource choice-resource--' + item.key + '" role="button" tabindex="0"' + help + '>' +
        '<span class="choice-resource-mark">' + escapeHtml(item.short) + '</span>' +
        '<div class="choice-resource-main"><b>' + escapeHtml(item.label) + " " + escapeHtml(item.value) + '</b>' + bar(item.value, item.max, item.reverse) + '</div>' +
      '</div>';
    }).join("") + '</div>';
  }

  function renderTime() {
    var s = Game.state;
    var office = Game.getOffice();
    var career = Game.getCareerProgress ? Game.getCareerProgress() : { merit: 0, threshold: office.promotionMerit, nextOffice: null, rankName: office.rankName || office.name };
    var meritText = career.threshold ? career.merit + "/" + career.threshold + " → " + career.nextOffice.name : career.merit + " 满阶";
    var items = [
      ["年份", "第" + s.year + "年"],
      ["季节", GameData.seasons[s.seasonIndex]],
      ["年龄", s.age + "岁"],
      ["官职", office.name],
      ["官阶", career.rankName],
      ["官评", meritText],
      ["任期目标", office.goal]
    ];
    el("time-strip").innerHTML = items.map(function (item) {
      return '<div class="time-cell"><div class="time-label">' + item[0] + '</div><div class="time-value">' + escapeHtml(item[1]) + '</div></div>';
    }).join("");
  }

  function renderCharacter() {
    var s = Game.state;
    var office = Game.getOffice();
    var attrHtml = Object.keys(s.attributes).map(function (key) {
      return statBlock(key, s.attributes[key], 10, false, "attribute", key);
    }).join("");
    var fameHtml = [
      statBlock("清名", s.fame.clean, 20, false, "fame", "clean"),
      statBlock("能名", s.fame.competence, 20, false, "fame", "competence"),
      statBlock("文名", s.fame.literary, 20, false, "fame", "literary"),
      statBlock("权名", s.fame.power, 20, false, "fame", "power"),
      statBlock("酷名", s.fame.cruel, 20, true, "fame", "cruel"),
      statBlock("贪名", s.fame.corruption, 20, true, "fame", "corruption")
    ].join("");
    var tags = s.traits.concat(office.tags).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join("");
    var style = Game.getDominantStyle ? Game.getDominantStyle() : { tag: "未定", value: 0 };
    var styleHtml = '<div class="style-ribbon"><b>主导流派</b><span>' + escapeHtml(style.tag) + " " + style.value + '</span></div>';
    var perkHtml = Game.getStylePerks ? '<div class="style-perks">' + Game.getStylePerks().map(function (perk) {
      return '<div class="style-perk ' + (perk.active ? "style-perk--active" : "") + '"><b>' + escapeHtml(perk.tag) + " " + escapeHtml(perk.value) + "/" + escapeHtml(perk.threshold) + '</b><span>' + escapeHtml(perk.text) + '</span></div>';
    }).join("") + '</div>' : "";

    el("character-panel").innerHTML =
      '<div class="character-identity"><div class="character-portrait-slice" aria-hidden="true"></div><div><b>李燕之</b><span>籍贯：京兆府</span><span>性格：' + escapeHtml(s.traits.join("、")) + '</span><span>官职：' + escapeHtml(office.rankName || office.name) + '</span></div></div>' +
      '<div class="tags">' + tags + '</div>' +
      styleHtml +
      perkHtml +
      '<div class="section"><div class="panel-title">属性</div><div class="stat-grid">' + attrHtml + '</div></div>' +
      '<div class="section"><div class="panel-title">名声</div><div class="resource-grid">' + fameHtml + '</div></div>' +
      '<div class="section"><div class="panel-title">污点</div><div class="tags">' + (s.stains.length ? s.stains.map(function (id) {
        var card = Game.cardById(id);
        return '<span class="tag">' + escapeHtml(card ? card.name : id) + '</span>';
      }).join("") : '<span class="muted">暂无</span>') + '</div></div>';
  }

  function renderEvent() {
    var event = Game.state.currentEvent;
    if (Game.state.ended) {
      el("event-panel").innerHTML = '<h2 class="ending-title">' + escapeHtml(Game.state.ending.title) + '</h2><div class="ending-body">' + renderParagraphs(Game.state.ending.text, "ending-text") + '</div><div class="modal-actions"><button id="ending-export">导出生平摘要</button></div>';
      var exportButton = document.getElementById("ending-export");
      if (exportButton) exportButton.addEventListener("click", Game.UI.showExport);
      return;
    }
    if (Game.state.pendingSummary) {
      el("event-panel").innerHTML = '<div class="summary-waiting"><div class="panel-title">本季结算</div><p class="muted">结算已生成，请在弹框中查看详情并进入下一季。</p></div>';
      maybeShowSeasonSummary();
      return;
    }
    if (Game.state.pendingReward) {
      Game.chooseReward();
      el("event-panel").innerHTML = '<div class="summary-waiting"><div class="panel-title">本季结算</div><p class="muted">结算已生成，请在弹框中查看详情并进入下一季。</p></div>';
      maybeShowSeasonSummary();
      return;
    }
    if (!event) {
      el("event-panel").innerHTML = '<p class="muted">暂无事务。</p>';
      return;
    }
    var trackHtml = Object.keys(event.tracks).map(function (name) {
      var track = event.tracks[name];
      var critical = (event.criticalTracks || []).indexOf(name) >= 0;
      return '<div class="track ' + (critical ? "track--critical" : "") + '"><div class="track-head"><span>' + escapeHtml(name) + (critical ? '<em>关键</em>' : '') + '</span><span>' + track.value + "/" + track.max + '</span></div>' + bar(track.value, track.max, true) + '</div>';
    }).join("");
    var participantHtml = event.participants.map(function (name) {
      return '<span class="tag">' + escapeHtml(name) + '</span>';
    }).join("");
    var played = event.played.length ? '<div class="section"><div class="panel-title">已用手段</div><div class="tags">' + event.played.map(function (name) {
      return '<span class="tag">' + escapeHtml(name) + '</span>';
    }).join("") + '</div></div>' : "";
    var preview = Game.previewCurrentEventOutcome ? Game.previewCurrentEventOutcome() : null;
    var unresolved = preview && preview.unresolved.length ? '<p class="muted">可能后患：' + escapeHtml(preview.unresolved.join("、")) + '</p>' : '';
    var blocked = preview && preview.blocked.length ? '<p class="muted">关键未解：' + escapeHtml(preview.blocked.join("、")) + '</p>' : '';
    var previewHtml = preview ? '<div class="preview-box preview--' + preview.level + '"><b>当前预估：' + escapeHtml(preview.title) + '</b><p>' + escapeHtml(preview.desc) + '</p>' + blocked + unresolved + '</div>' : "";
    var threatNow = event.threat || 0;
    var threatMax = event.threatMax || 3;
    var threatHtml = '<div class="threat-meter"><div class="track-head"><span>暗流威胁</span><span>' + threatNow + "/" + threatMax + '</span></div>' + bar(threatNow, threatMax, true) + '</div>';
    var story = event.story || {};
    var npcInfo = event.special === "npc" && Game.getNpcById ? Game.getNpcById(event.npcId) : null;
    var specialBadge = event.special === "relation" ? '<span class="event-badge">关系事件</span>' : event.special === "npc" ? '<span class="event-badge event-badge--npc">人物事件</span>' : "";
    var relationMeta = event.special === "relation" ? '<br>触发：' + escapeHtml(event.relationSource || "关系阈值") : "";
    if (npcInfo) relationMeta = '<br>触发：' + escapeHtml(npcInfo.def.name + " · " + npcInfo.def.role);
    var storyLines = storyParagraphs(story);
    if (!storyLines.length) storyLines = ["案卷压到灯下，尚未开封，局势已经有了重量。"];
    var storyHtml = '<div class="story-box story-box--dossier">' +
      '<b>案前风声</b>' +
      renderParagraphs(storyLines) +
      '</div>';
    var eventDescHtml = event.desc ? '<p class="event-desc"><b>案由：</b>' + escapeHtml(event.desc) + '</p>' : "";
    el("event-panel").innerHTML =
      '<div class="event-title-row"><h2>' + escapeHtml(event.name) + specialBadge + '</h2><div class="event-meta">关键阻力需压到 4 或以下<br>威胁满格触发反制' + relationMeta + '</div></div>' +
      storyHtml +
      eventDescHtml +
      '<div class="tags">' + participantHtml + '</div>' +
      threatHtml +
      '<div class="section tracks">' + trackHtml + '</div>' +
      previewHtml +
      played;
  }

  function renderHand() {
    var s = Game.state;
    var locked = s.ended || !!s.pendingReward || !!s.pendingSummary;
    var stage = Game.getCurrentChoiceStage ? Game.getCurrentChoiceStage() : null;
    var complete = Game.currentEventChoicesComplete ? Game.currentEventChoicesComplete() : false;
    var progress = s.currentEvent && s.currentEvent.choiceStages && s.currentEvent.choiceStages.length ? (Math.min((s.currentEvent.choiceStageIndex || 0) + 1, s.currentEvent.choiceStages.length) + "/" + s.currentEvent.choiceStages.length) : "";
    var stageInfo = stage && !complete && !locked ? '<div class="choice-stage-head choice-stage-head--compact"><span>阶段 ' + escapeHtml(progress) + '</span><b>' + escapeHtml(stage.title || "处置") + '</b><p>' + escapeHtml(stage.desc || "") + '</p></div>' : "";
    if (el("hand-stage")) el("hand-stage").innerHTML = stageInfo;
    el("hand-hint").innerHTML = '<div class="hand-hint-main"><p>' + escapeHtml(s.pendingSummary ? "本季事务已结案，请阅读总结后进入下季。" : complete ? "本季处置已完成，可以结束本季结案。" : stage ? "选择一项处置推进当前事务。费用不足的选项会变暗。" : "暂无可处置事务。") +
      ' <span class="cost-legend"><span>精=精力</span><span>银=银两</span><span>情=人情</span><span>压=压力</span></span></p>' +
      '</div>' +
      renderChoiceResources();
    el("end-button").disabled = locked || !s.currentEvent || !complete;
    if (!s.currentEvent || locked) {
      el("hand-panel").innerHTML = '<div class="choices-empty"><p class="muted">' + (locked ? "本季事务已进入结算。" : "暂无事务。") + '</p></div>';
      return;
    }
    var choiceLog = (s.currentEvent.choiceLog || []).length ? '<div class="choice-log"><div class="panel-title">已定处置</div>' + s.currentEvent.choiceLog.map(function (entry) {
      return '<div class="choice-log-item"><b>' + escapeHtml(entry.stageTitle || "") + " · " + escapeHtml(entry.title || "") + '</b><p>' + escapeHtml(entry.outcomeText || entry.body || "") + '</p></div>';
    }).join("") + '</div>' : "";
    if (complete) {
      el("hand-panel").innerHTML = choiceLog + '<div class="choices-empty"><b>处置已定</b><p class="muted">两阶段抉择已经完成，点击“结束本季”查看结案总结。</p></div>';
      return;
    }
    var choices = Game.getCurrentChoices ? Game.getCurrentChoices() : [];
    var html = choices.map(function (choice) {
      var playable = !locked && Game.canChooseChoice(choice);
      var preview = Game.getChoicePreview ? Game.getChoicePreview(choice).slice(0, 5) : [];
      var cost = Game.getChoiceCost ? Game.getChoiceCost(choice) : (choice.cost || {});
      var threat = Game.getChoiceThreat ? Game.getChoiceThreat(choice) : (choice.reactionRisk || 0);
      var tags = (choice.tags || []).slice(0, 4).map(function (tag) {
        return '<span class="tag">' + escapeHtml(tag) + '</span>';
      }).join("");
      var previewHtml = preview.length ? '<div class="card-effects">' + preview.map(function (item) {
        return '<span>' + escapeHtml(item) + '</span>';
      }).join("") + '</div>' : "";
      var bonusHtml = choice.libraryBonus ? '<div class="card-hints"><span>' + escapeHtml(choice.libraryBonus) + '</span></div>' : "";
      return '<article class="card choice-card ' + (playable ? "card--playable" : "unplayable") + '">' +
        '<div class="card-header">' +
          '<div class="card-title-block">' +
            '<div class="card-type">事务处置 · 威胁 +' + escapeHtml(threat) + '</div>' +
            '<h3>' + escapeHtml(choice.title) + '</h3>' +
          '</div>' +
          '<div class="card-costs" aria-label="费用">' + renderCostChips(cost) + '</div>' +
        '</div>' +
        '<p class="card-desc">' + escapeHtml(choice.body || "") + '</p>' +
        previewHtml +
        bonusHtml +
        '<div class="card-footer">' +
          '<div class="tags">' + tags + '</div>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button data-choice="' + escapeHtml(choice.id) + '" ' + (playable ? "" : "disabled") + '>选择</button>' +
        '</div>' +
        '</article>';
    }).join("");
    el("hand-panel").innerHTML = choiceLog + '<div class="cards choice-grid">' + (html || '<p class="muted">当前阶段没有可选处置。</p>') + '</div>';
    if ((s.currentEvent.choiceStageIndex || 0) > 0) {
      var handScroller = el("hand-panel");
      var choiceGrid = handScroller.querySelector(".choice-grid");
      if (choiceGrid) {
        handScroller.scrollTop = Math.max(0, choiceGrid.offsetTop - 8);
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        Game.chooseChoice(button.getAttribute("data-choice"));
        Game.UI.render();
      });
    });
  }

  function renderWorld() {
    var s = Game.state;
    var worldHtml = [
      statBlock("皇帝信任", s.world.emperorTrust, 20, false, "world", "emperorTrust"),
      statBlock("士林评价", s.world.scholarOpinion, 20, false, "world", "scholarOpinion"),
      statBlock("民心", s.world.publicMood, 20, false, "world", "publicMood"),
      statBlock("财政健康", s.world.fiscalHealth, 20, false, "world", "fiscalHealth"),
      statBlock("朋党烈度", s.world.factionHeat, 20, true, "world", "factionHeat"),
      statBlock("朝局压力", s.world.courtPressure, 20, true, "world", "courtPressure")
    ].join("");
    function relationPriority(person) {
      var rel = s.relations[person.id] || {};
      var badges = Game.getRelationBadges ? Game.getRelationBadges(person.id) : [];
      return Math.max(rel.suspicion || 0, rel.resentment || 0, rel.debt || 0, rel.fear || 0) +
        Math.max(0, 8 - (rel.trust || 0)) +
        badges.length * 3;
    }
    var relations = GameData.people.slice().sort(function (a, b) {
      return relationPriority(b) - relationPriority(a);
    }).slice(0, 2).map(function (person) {
      var rel = s.relations[person.id] || {};
      var bits = person.keys.map(function (key) {
        var name = { trust: "信任", suspicion: "猜忌", closeness: "亲近", debt: "亏欠", resentment: "怨恨", fear: "畏惧" }[key] || key;
        return '<span class="relation-chip relation-chip--help"' + helpAttributes("relation", key, person.id) + '>' + escapeHtml(name) + " " + escapeHtml(rel[key] || 0) + '</span>';
      }).join("");
      var badgeHtml = (Game.getRelationBadges ? Game.getRelationBadges(person.id) : []).map(function (label) {
        var cls = label === "清算" ? "relation-badge--purge" : label === "危险" ? "relation-badge--danger" : label === "牵连" ? "relation-badge--debt" : "relation-badge--good";
        return '<span class="relation-badge ' + cls + '">' + escapeHtml(label) + '</span>';
      }).join("");
      return '<div class="relation"><div class="relation-head"><b>' + escapeHtml(person.name) + '</b><span class="muted">' + escapeHtml(person.label) + '</span></div>' + (badgeHtml ? '<div class="relation-badges">' + badgeHtml + '</div>' : '') + '<div class="relation-metric-row">' + bits + '</div></div>';
    }).join("");
    var visibleNpcs = Game.getVisibleNpcs ? Game.getVisibleNpcs() : [];
    var npcHtml = visibleNpcs.slice().sort(function (a, b) {
      function score(item) {
        var state = item.state || {};
        return (item.inOffice ? 4 : 0) + (state.resentment || 0) + (state.debt || 0) + (state.trust || 0) + (state.bond || 0);
      }
      return score(b) - score(a);
    }).slice(0, 1).map(function (item) {
      var def = item.def;
      var state = item.state;
      var badges = [];
      if (item.inOffice) badges.push("在任");
      if (state.bond >= 6 || state.trust >= 6) badges.push("助力");
      if (state.debt >= 5) badges.push("牵连");
      if (state.resentment >= 6) badges.push("危险");
      if (state.status && state.status !== "active") badges.push(state.status);
      var badgeHtml = badges.map(function (badge) {
        var cls = badge === "危险" ? "npc-badge--danger" : badge === "牵连" ? "npc-badge--debt" : badge === "助力" ? "npc-badge--good" : "";
        return '<span class="npc-badge ' + cls + '">' + escapeHtml(badge) + '</span>';
      }).join("");
      var traits = (def.traits || []).slice(0, 3).map(function (trait) {
        return '<span class="tag">' + escapeHtml(trait) + '</span>';
      }).join("");
      return '<div class="npc-card" role="button" tabindex="0" data-npc-id="' + escapeHtml(def.id) + '">' +
        '<div class="npc-head"><b>' + escapeHtml(def.name) + '</b><span>' + escapeHtml(def.role) + '</span></div>' +
        '<div class="npc-agenda">' + escapeHtml(def.agenda) + '</div>' +
        '<div class="npc-badges">' + badgeHtml + '</div>' +
        '<div class="npc-meters"><span>羁 ' + (state.bond || 0) + '</span><span>信 ' + (state.trust || 0) + '</span><span>欠 ' + (state.debt || 0) + '</span><span>怨 ' + (state.resentment || 0) + '</span></div>' +
        '<div class="npc-traits">' + traits + '</div>' +
      '</div>';
    }).join("");
    var npcSection = npcHtml ? '<div class="section"><div class="panel-title">入局人物</div><div class="npc-list npc-list--compact">' + npcHtml + '</div></div>' : "";
    el("world-panel").innerHTML =
      '<div class="world-list world-list--compact">' + worldHtml + '</div>' +
      '<div class="section"><div class="panel-title">紧要关系</div><div class="relation-list relation-list--compact">' + relations + '</div></div>' +
      npcSection +
      '<div class="panel-actions"><button data-main-nav="relations" class="ghost-button">朝局详情</button></div>';
    bindMainNavButtons();
    bindNpcStoryButtons();
  }

  function bindMainNavButtons() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-main-nav]"), function (button) {
      if (button.dataset.mainNavBound === "1") return;
      button.dataset.mainNavBound = "1";
      button.addEventListener("click", function () {
        var view = button.getAttribute("data-main-nav");
        Game.UI.setView(view);
        window.location.hash = view === "main" ? "" : view;
      });
    });
  }

  function npcStoryModal(id) {
    var npc = Game.getNpcById ? Game.getNpcById(id) : null;
    var def = npc ? npc.def : (GameData.npcs || []).find(function (item) { return item.id === id; });
    var state = npc ? npc.state : {};
    if (!def) return;
    var traits = (def.traits || []).map(function (trait) {
      return '<span class="tag">' + escapeHtml(trait) + '</span>';
    }).join("");
    var history = (state.history || []).slice(-6).reverse().map(function (entry) {
      return '<div class="story-entry story-entry--npc"><b>' + escapeHtml(entry.time || "近事") + '</b><p>' + escapeHtml(entry.text || "") + '</p></div>';
    }).join("");
    var biography = String(def.bio || def.agenda || "此人尚无小传。").split(/\n+/).map(function (line) {
      return '<p>' + escapeHtml(line) + '</p>';
    }).join("");
    showModal(
      '<div class="npc-story-modal">' +
        '<div class="npc-story-head">' +
          '<div class="ink-portrait">' + escapeHtml(def.name.slice(0, 1)) + '</div>' +
          '<div><h2>' + escapeHtml(def.name) + '</h2><p class="muted">' + escapeHtml(def.role) + ' · ' + escapeHtml(def.group) + '</p></div>' +
        '</div>' +
        '<div class="npc-biography">' + biography + '</div>' +
        '<div class="npc-meters npc-story-meters"><span>羁 ' + (state.bond || 0) + '</span><span>信 ' + (state.trust || 0) + '</span><span>欠 ' + (state.debt || 0) + '</span><span>怨 ' + (state.resentment || 0) + '</span></div>' +
        '<div class="tags">' + traits + '</div>' +
        '<div class="section"><div class="panel-title">近事入传</div><div class="story-feed npc-story-feed">' + (history || '<p class="muted">尚无近事入传。</p>') + '</div></div>' +
      '</div>'
    );
  }

  function bindNpcStoryButtons() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-npc-id]"), function (card) {
      if (card.dataset.npcStoryBound === "1") return;
      card.dataset.npcStoryBound = "1";
      card.addEventListener("click", function () {
        npcStoryModal(card.getAttribute("data-npc-id"));
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          npcStoryModal(card.getAttribute("data-npc-id"));
        }
      });
    });
  }

  function renderLog() {
    var beats = (Game.state.storyBeats || []).slice(0, 2).map(function (beat) {
      return '<div class="story-entry story-entry--' + escapeHtml(beat.kind) + '"><b>' + escapeHtml(beat.title) + '</b><span>' + escapeHtml(beat.time) + '</span><p>' + escapeHtml(beat.text) + '</p></div>';
    }).join("");
    var html = Game.state.log.slice(0, 3).map(function (entry) {
      return '<div class="log-entry"><b>' + escapeHtml(entry.time) + '</b><br>' + escapeHtml(entry.text) + '</div>';
    }).join("");
    el("log-panel").innerHTML =
      '<div class="panel-title">传闻与余波</div>' +
      '<div class="log-compact-list">' + (beats || "") + (html || '<p class="muted">尚无记事。</p>') + '</div>' +
      '<div class="panel-actions"><button data-main-nav="life" class="ghost-button">生平卷</button></div>';
    bindMainNavButtons();
  }

  function setActiveView(view) {
    var allowed = ["main", "relations", "deck", "life"];
    activeView = allowed.indexOf(view) >= 0 ? view : "main";
  }

  function syncActiveView() {
    Array.prototype.forEach.call(document.querySelectorAll(".app-view"), function (view) {
      view.classList.toggle("hidden", view.id !== activeView + "-view");
    });
    Array.prototype.forEach.call(["main", "relations", "deck", "life"], function (view) {
      document.body.classList.toggle("view-" + view, view === activeView);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".view-tab"), function (button) {
      var active = button.getAttribute("data-view") === activeView;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function deckItems() {
    return (Game.getActionLibraryItems ? Game.getActionLibraryItems() : []).map(function (item) {
      return {
        card: item.card,
        count: item.level || 1,
        level: item.level || 1,
        sources: item.sources || []
      };
    }).sort(function (a, b) {
      var negativeA = Game.isNegativeCard && Game.isNegativeCard(a.card);
      var negativeB = Game.isNegativeCard && Game.isNegativeCard(b.card);
      if (negativeA !== negativeB) return negativeA ? 1 : -1;
      return a.card.name.localeCompare(b.card.name, "zh-Hans-CN");
    });
  }

  function cardMatchesFilter(card, filter) {
    if (!filter || filter === "全部") return true;
    var tags = card.tags || [];
    return card.type === filter || card.domain === filter || tags.indexOf(filter) >= 0;
  }

  function renderDeckFilters(items) {
    var html = deckFilters.map(function (filter) {
      var count = items.reduce(function (sum, item) {
        return sum + (cardMatchesFilter(item.card, filter.id) ? 1 : 0);
      }, 0);
      return '<button class="deck-filter ' + (deckFilter === filter.id ? "is-active" : "") + '" data-deck-filter="' + escapeHtml(filter.id) + '">' +
        '<span>' + escapeHtml(filter.label) + '</span><b>' + count + '</b>' +
      '</button>';
    }).join("");
    el("deck-filter-panel").innerHTML = html +
      '<div class="deck-search-shell"><label for="deck-filter-note">筛选</label><div id="deck-filter-note" class="deck-note">按路线查看已沉淀手段。</div></div>';
  }

  function deckStats(items) {
    var groups = [
      ["政务法度", function (card) { return ["政务", "法度", "公文", "财政"].indexOf(card.type) >= 0 || ["政务", "法度", "财政"].indexOf(card.domain) >= 0; }],
      ["清议近君", function (card) { return ["奏疏", "清议"].indexOf(card.type) >= 0 || (card.tags || []).indexOf("清流") >= 0 || (card.tags || []).indexOf("近君") >= 0; }],
      ["人情转圜", function (card) { return ["人情", "人物", "家族"].indexOf(card.type) >= 0 || (card.tags || []).indexOf("人情") >= 0; }],
      ["权谋险路", function (card) { return card.type === "权谋" || (card.tags || []).indexOf("权谋") >= 0 || (card.tags || []).indexOf("污点") >= 0; }]
    ];
    return groups.map(function (group) {
      var total = items.reduce(function (sum, item) {
        return sum + (group[1](item.card) ? 1 : 0);
      }, 0);
      return '<div class="deck-stat"><span>' + escapeHtml(group[0]) + '</span><b>' + total + '</b></div>';
    }).join("");
  }

  function renderLibraryCard(item) {
    var card = item.card;
    var visual = cardVisual(card);
    var active = selectedDeckId === card.id;
    var tags = (card.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join("");
    return '<button class="library-card ' + visual.cls + (active ? " is-active" : "") + '" data-deck-card="' + escapeHtml(card.id) + '">' +
      '<div class="library-card-top"><b>' + escapeHtml(card.name) + '</b><em>Lv.' + item.level + '</em></div>' +
      '<div class="library-card-art"><span>' + escapeHtml(visual.mark) + '</span></div>' +
      '<div class="library-card-meta">' + escapeHtml(card.type) + ' · ' + escapeHtml(card.domain) + '</div>' +
      '<div class="library-card-tags">' + tags + '</div>' +
    '</button>';
  }

  function renderDeckDetail(selected) {
    if (!selected) {
      el("deck-detail-panel").innerHTML = '<p class="muted">手段库为空。</p>';
      return;
    }
    var card = selected.card;
    var visual = cardVisual(card);
    var modes = Game.getCardModes ? Game.getCardModes(card) : (card.modes || []);
    var modeHtml = modes.length ? modes.map(function (mode) {
      return '<div class="detail-mode"><b>' + escapeHtml(mode.name) + '</b><span>' + escapeHtml(mode.desc || "") + '</span></div>';
    }).join("") : '<p class="muted">此手段会按事务语境转化为具体处置。</p>';
    var tags = (card.tags || []).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join("");
    var sourceText = selected.sources && selected.sources.length ? selected.sources.join("、") : "仕途沉淀";
    el("deck-detail-panel").innerHTML =
      '<div class="detail-card ' + visual.cls + '">' +
        '<div class="detail-card-cost">' + renderCostChips(card.cost) + '</div>' +
        '<div class="detail-card-art"><span>' + escapeHtml(visual.mark) + '</span></div>' +
        '<h2>' + escapeHtml(card.name) + '</h2>' +
        '<p class="detail-card-type">' + escapeHtml(card.type) + ' · ' + escapeHtml(card.domain) + '</p>' +
        '<p class="detail-card-desc">' + escapeHtml(card.desc) + '</p>' +
        '<div class="tags">' + tags + '</div>' +
      '</div>' +
      '<div class="section"><div class="panel-title">路线协同</div><div class="detail-modes">' + modeHtml + '</div></div>' +
      '<div class="section deck-zone-note"><b>沉淀来源</b><span>' + escapeHtml(sourceText) + '</span></div>' +
      '<div class="section deck-zone-note"><b>手段等级</b><span>Lv.' + escapeHtml(selected.level || 1) + '</span></div>' +
      '<div class="deck-action-stack">' +
        '<button disabled>等待事务调用</button>' +
      '</div>';
  }

  function renderDeckView() {
    if (!el("deck-grid-panel")) return;
    var items = deckItems();
    renderDeckFilters(items);
    el("deck-stat-panel").innerHTML = deckStats(items);
    var filtered = items.filter(function (item) {
      return cardMatchesFilter(item.card, deckFilter);
    });
    if (!filtered.some(function (item) { return item.card.id === selectedDeckId; })) {
      selectedDeckId = filtered.length ? filtered[0].card.id : null;
    }
    var selected = filtered.find(function (item) { return item.card.id === selectedDeckId; }) || filtered[0] || null;
    el("deck-grid-panel").innerHTML = filtered.length ? '<div class="library-grid">' + filtered.map(renderLibraryCard).join("") + '</div>' : '<p class="muted">当前筛选下没有手段。</p>';
    renderDeckDetail(selected);
    Array.prototype.forEach.call(document.querySelectorAll("[data-deck-filter]"), function (button) {
      button.addEventListener("click", function () {
        deckFilter = button.getAttribute("data-deck-filter");
        renderDeckView();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-deck-card]"), function (button) {
      button.addEventListener("click", function () {
        selectedDeckId = button.getAttribute("data-deck-card");
        renderDeckView();
      });
    });
  }

  function relationLabel(key) {
    return { trust: "信任", suspicion: "猜忌", closeness: "亲近", debt: "亏欠", resentment: "怨恨", fear: "畏惧" }[key] || key;
  }

  function relationTone(rel) {
    if ((rel.resentment || 0) >= 6 || (rel.suspicion || 0) >= 7) return "danger";
    if ((rel.debt || 0) >= 5) return "debt";
    if ((rel.trust || 0) >= 6 || (rel.closeness || 0) >= 6 || (rel.fear || 0) >= 6) return "strong";
    return "neutral";
  }

  function relationMeters(person, compact) {
    var rel = (Game.state.relations && Game.state.relations[person.id]) || {};
    var keys = compact ? person.keys : ["trust", "suspicion", "closeness", "debt", "resentment", "fear"].filter(function (key) {
      return person.keys.indexOf(key) >= 0 || rel[key] > 0;
    });
    return keys.map(function (key) {
      var value = rel[key] || 0;
      var focusAttrs = compact ? "" : ' role="button" tabindex="0"';
      return '<div class="mini-meter mini-meter--help"' + helpAttributes("relation", key, person.id) + focusAttrs + '><span>' + escapeHtml(relationLabel(key)) + '</span><div><i style="width:' + pct(value, 20) + '%"></i></div><b>' + value + '</b></div>';
    }).join("");
  }

  function renderRelationFilters() {
    var groups = [
      ["朝廷", "皇帝、上司、政敌"],
      ["士林", "座师、同年、清议"],
      ["地方", "士绅、胥吏、百姓"],
      ["风险", "猜忌、亏欠、怨恨"]
    ];
    el("relation-filter-panel").innerHTML =
      '<div class="relation-filter-list">' + groups.map(function (group) {
        return '<div class="relation-filter"><b>' + escapeHtml(group[0]) + '</b><span>' + escapeHtml(group[1]) + '</span></div>';
      }).join("") + '</div>' +
      '<label class="check-row"><input type="checkbox" checked disabled> 仅显示可操作关系</label>';
  }

  function renderRelationMap() {
    var people = GameData.people || [];
    if (!people.some(function (person) { return person.id === selectedRelationId; })) selectedRelationId = "emperor";
    var centerX = 50;
    var centerY = 52;
    var lines = people.map(function (person) {
      var pos = relationPositions[person.id] || [50, 50];
      var tone = relationTone(Game.state.relations[person.id] || {});
      return '<line class="relation-line relation-line--' + tone + '" x1="' + centerX + '" y1="' + centerY + '" x2="' + pos[0] + '" y2="' + pos[1] + '"></line>';
    }).join("");
    var nodes = people.map(function (person) {
      var pos = relationPositions[person.id] || [50, 50];
      var rel = Game.state.relations[person.id] || {};
      var tone = relationTone(rel);
      var badges = (Game.getRelationBadges ? Game.getRelationBadges(person.id) : []).slice(0, 2).map(function (badge) {
        return '<span>' + escapeHtml(badge) + '</span>';
      }).join("");
      return '<button class="relation-node relation-node--' + tone + (selectedRelationId === person.id ? " is-active" : "") + '" style="left:' + pos[0] + '%; top:' + pos[1] + '%" data-relation-id="' + escapeHtml(person.id) + '">' +
        '<b>' + escapeHtml(person.name) + '</b><em>' + escapeHtml(person.label) + '</em>' +
        '<div class="relation-node-meters">' + relationMeters(person, true) + '</div>' +
        '<div class="relation-node-badges">' + badges + '</div>' +
      '</button>';
    }).join("");
    var style = Game.getDominantStyle ? Game.getDominantStyle() : { tag: "未定", value: 0 };
    el("relation-map-panel").innerHTML =
      '<div class="relation-map">' +
        '<svg class="relation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + lines + '</svg>' +
        '<div class="relation-player-node"><b>你</b><span>' + escapeHtml(Game.getOffice().rankName || Game.getOffice().name) + '</span><em>' + escapeHtml(style.tag) + ' ' + escapeHtml(style.value) + '</em></div>' +
        nodes +
      '</div>';
  }

  function renderRelationDetail() {
    var person = (GameData.people || []).find(function (item) { return item.id === selectedRelationId; }) || GameData.people[0];
    var rel = Game.state.relations[person.id] || {};
    var badges = (Game.getRelationBadges ? Game.getRelationBadges(person.id) : []).map(function (label) {
      var cls = label === "清算" ? "relation-badge--purge" : label === "危险" ? "relation-badge--danger" : label === "牵连" ? "relation-badge--debt" : "relation-badge--good";
      return '<span class="relation-badge ' + cls + '">' + escapeHtml(label) + '</span>';
    }).join("");
    var npcs = (GameData.npcs || []).filter(function (def) {
      return def.group === person.id;
    }).slice(0, 3).map(function (def) {
      var npc = Game.getNpcById ? Game.getNpcById(def.id) : null;
      var state = npc ? npc.state : {};
      return '<div class="detail-npc" role="button" tabindex="0" data-npc-id="' + escapeHtml(def.id) + '"><b>' + escapeHtml(def.name) + '</b><span>' + escapeHtml(def.role) + '</span><p>' + escapeHtml(def.agenda) + '</p><div class="npc-meters"><span>羁 ' + (state.bond || 0) + '</span><span>信 ' + (state.trust || 0) + '</span><span>欠 ' + (state.debt || 0) + '</span><span>怨 ' + (state.resentment || 0) + '</span></div></div>';
    }).join("");
    el("relation-detail-panel").innerHTML =
      '<div class="relation-dossier relation-dossier--' + relationTone(rel) + '">' +
        '<div class="ink-portrait">' + escapeHtml(person.name.slice(0, 1)) + '</div>' +
        '<h2>' + escapeHtml(person.name) + '</h2>' +
        '<p>' + escapeHtml(person.label) + '</p>' +
        '<div class="relation-badges">' + (badges || '<span class="relation-badge">平稳</span>') + '</div>' +
      '</div>' +
      '<div class="section"><div class="panel-title">关系账</div><div class="relation-detail-meters">' + relationMeters(person, false) + '</div></div>' +
      '<div class="section leverage-box"><b>当前判断</b><p>' + escapeHtml((rel.resentment || 0) >= 6 ? "怨恨偏高，后续事件更容易被旧账牵动。" : (rel.debt || 0) >= 5 ? "人情债偏重，短期可用，长期会牵连。" : "关系尚可周旋，仍需留意朝局变化。") + '</p></div>' +
      '<div class="section"><div class="panel-title">具名人物</div><div class="detail-npc-list">' + (npcs || '<p class="muted">暂无具名人物入局。</p>') + '</div></div>';
  }

  function renderRelationLedger() {
    var npcRows = (GameData.npcs || []).map(function (def) {
      var npc = Game.getNpcById ? Game.getNpcById(def.id) : null;
      if (!npc || !npc.state.history || !npc.state.history.length) return "";
      var latest = npc.state.history[npc.state.history.length - 1];
      return '<div class="ledger-row"><b>' + escapeHtml(def.name) + '</b><span>' + escapeHtml(latest.time || "近事") + '</span><p>' + escapeHtml(latest.text || "") + '</p></div>';
    }).filter(Boolean).slice(0, 4).join("");
    var logRows = (Game.state.log || []).slice(0, 5).map(function (entry) {
      return '<div class="ledger-row"><b>' + escapeHtml(entry.time) + '</b><p>' + escapeHtml(entry.text) + '</p></div>';
    }).join("");
    el("relation-ledger-panel").innerHTML = '<div class="ledger-grid">' + (npcRows + logRows || '<p class="muted">尚无关系动态。</p>') + '</div>';
  }

  function renderRelationView() {
    if (!el("relation-map-panel")) return;
    renderRelationFilters();
    renderRelationMap();
    renderRelationDetail();
    renderRelationLedger();
    Array.prototype.forEach.call(document.querySelectorAll("[data-relation-id]"), function (button) {
      button.addEventListener("click", function () {
        selectedRelationId = button.getAttribute("data-relation-id");
        renderRelationView();
      });
    });
    bindHelpButtons();
    bindNpcStoryButtons();
  }

  function currentEndingPreview() {
    if (Game.state.ending) return Game.state.ending;
    var ending = (GameData.endings || []).find(function (item) {
      try {
        return item.when(Game.state);
      } catch (err) {
        return false;
      }
    });
    return ending || { title: "仕途未终", text: "案卷仍在案头，身后评语尚未落笔。" };
  }

  function lifeTimeline() {
    var rows = [];
    (Game.state.career && Game.state.career.history || []).forEach(function (entry) {
      rows.push({ time: entry.time, title: entry.rankName || Game.getOffice().name, text: entry.text, kind: entry.type || "career" });
    });
    (Game.state.storyBeats || []).slice(0, 8).forEach(function (beat) {
      rows.push({ time: beat.time, title: beat.title, text: beat.text, kind: beat.kind });
    });
    if (!rows.length) {
      rows = [
        { time: "第1年春", title: "翰林", text: "新科入仕，馆阁清职，先在文名与近君之间立足。", kind: "career" },
        { time: "第5年", title: "知县", text: "若官评足够，将外放地方，处理钱粮、讼案与士绅。", kind: "future" },
        { time: "第9年", title: "御史", text: "若历练足够，将入台垣，在弹劾、证据与清议间求生。", kind: "future" }
      ];
    }
    return rows.slice(-10);
  }

  function renderJudgmentRows() {
    var s = Game.state;
    var implication = Math.min(20, (s.stains || []).length * 3 + Object.keys(s.relations || {}).reduce(function (sum, id) {
      return sum + (((s.relations[id] || {}).debt || 0) >= 5 ? 2 : 0);
    }, 0));
    var rows = [
      ["清名", s.fame.clean, false],
      ["能名", s.fame.competence, false],
      ["权势", s.fame.power, false],
      ["酷虐", s.fame.cruel, true],
      ["贪腐", s.fame.corruption, true],
      ["家族牵连", implication, true]
    ];
    return rows.map(function (row) {
      return '<div class="judgment-row"><span>' + escapeHtml(row[0]) + '</span>' + bar(row[1], 20, row[2]) + '<b>' + row[1] + '</b></div>';
    }).join("");
  }

  function renderLifeView() {
    if (!el("life-panel")) return;
    var s = Game.state;
    var ending = currentEndingPreview();
    var office = Game.getOffice();
    var lifeNarrative = Game.buildLifeNarrative ? Game.buildLifeNarrative() : textParagraphs(ending.text || "案卷仍在案头，身后评语尚未落笔。");
    var timeline = lifeTimeline().map(function (item) {
      return '<div class="timeline-item timeline-item--' + escapeHtml(item.kind || "career") + '"><b>' + escapeHtml(item.title) + '</b><span>' + escapeHtml(item.time) + '</span><p>' + escapeHtml(item.text) + '</p></div>';
    }).join("");
    var stains = (s.stains || []).map(function (id) {
      var card = Game.cardById(id);
      return '<span class="tag">' + escapeHtml(card ? card.name : id) + '</span>';
    }).join("");
    el("life-panel").innerHTML =
      '<div class="life-scroll">' +
        '<aside class="life-profile">' +
          '<div class="ink-portrait ink-portrait--large">仕</div>' +
          '<div class="vertical-rank">' + escapeHtml(office.name) + '</div>' +
          '<dl><dt>年龄</dt><dd>' + s.age + '岁</dd><dt>官职</dt><dd>' + escapeHtml(office.rankName || office.name) + '</dd><dt>官评</dt><dd>' + escapeHtml((s.career && s.career.merit) || 0) + '</dd><dt>仕途</dt><dd>第' + s.year + '年 · ' + escapeHtml(GameData.seasons[s.seasonIndex]) + '</dd></dl>' +
        '</aside>' +
        '<section class="life-biography">' +
          '<div class="scroll-label">生平视图</div>' +
          '<h2>' + escapeHtml(s.ended ? ending.title : "一生纪略") + '</h2>' +
          '<p class="life-subtitle">' + escapeHtml(s.ended ? "身后评定" : "仕途未终，史笔未定") + '</p>' +
          '<div class="ink-landscape"></div>' +
          '<div class="life-text">' + renderParagraphs(lifeNarrative) + '</div>' +
          '<div class="section"><div class="panel-title">污点与牵连</div><div class="tags">' + (stains || '<span class="muted">暂无污点入档。</span>') + '</div></div>' +
        '</section>' +
        '<aside class="life-judgment">' +
          '<div class="panel-title">身后评定</div>' +
          renderJudgmentRows() +
          '<div class="life-verdict"><b>史评</b>' + renderParagraphs(s.ended ? ending.text : "功过仍在变化，清名、能名、权势与污点会共同决定身后评语。") + '</div>' +
        '</aside>' +
        '<section class="life-timeline"><div class="panel-title">仕途时间线</div><div class="timeline-strip">' + timeline + '</div></section>' +
        '<div class="life-actions"><button data-life-action="export">导出生平</button><button data-life-action="new" class="ghost-button">再开一局</button><button data-life-action="deck" class="ghost-button">查看手段库</button></div>' +
      '</div>';
    Array.prototype.forEach.call(document.querySelectorAll("[data-life-action]"), function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-life-action");
        if (action === "export") Game.UI.showExport();
        if (action === "new" && confirm("确定重开？当前本地存档会被清除。")) {
          Game.startNewRun();
          Game.UI.setView("main");
        }
        if (action === "deck") Game.UI.setView("deck");
      });
    });
  }

  function showModal(html) {
    el("modal-content").innerHTML = html;
    el("modal").classList.remove("hidden");
  }

  function hideModal() {
    if (Game.state && Game.state.pendingSummary) {
      continueFromSummary();
      return;
    }
    el("modal").classList.add("hidden");
  }

  Game.UI = {
    setView: function (view) {
      setActiveView(view);
      this.render();
    },
    render: function () {
      syncActiveView();
      renderTime();
      renderCharacter();
      renderEvent();
      renderHand();
      renderWorld();
      renderLog();
      renderRelationView();
      renderDeckView();
      renderLifeView();
      bindHelpButtons();
    },
    showDeck: function () {
      this.setView("deck");
    },
    showModeChoice: function (instanceId) {
      var card = Game.state.hand.find(function (item) { return item.instanceId === instanceId; });
      if (!card) return;
      var modes = Game.getCardModes(card);
      var modeHtml = modes.map(function (mode) {
        var canPay = Game.canPlayCard(card, mode.id);
        var cost = Game.getCardModeCost(card, mode.id);
        var threat = Game.getCardThreat ? Game.getCardThreat(card, mode.id) : 0;
        var hints = (mode.bonusIf || []).map(function (bonus) {
          var active = Game.state.currentEvent && Game.state.currentEvent.flags && Game.state.currentEvent.flags[bonus.flag];
          return '<span class="mode-hint ' + (active ? "mode-hint--active" : "") + '">' + escapeHtml(active ? "可触发：" + (bonus.text || bonus.flag) : "连招：" + (bonus.text || bonus.flag)) + '</span>';
        }).join("");
        var preview = Game.getCardModePreview ? Game.getCardModePreview(card, mode.id) : [];
        var previewHtml = preview.length ? '<div class="mode-preview">' + preview.map(function (item) {
          return '<span>' + escapeHtml(item) + '</span>';
        }).join("") + '</div>' : "";
        return '<div class="mode-row">' +
          '<div><b>' + escapeHtml(mode.name) + '</b><p>' + escapeHtml(mode.desc || "") + '</p><div class="mode-costs">' + renderCostChips(cost) + '<span class="mode-threat">威胁 +' + threat + '</span></div>' + previewHtml + hints + '</div>' +
          '<button data-mode-card="' + escapeHtml(instanceId) + '" data-mode-id="' + escapeHtml(mode.id) + '" ' + (canPay ? "" : "disabled") + '>使用</button>' +
        '</div>';
      }).join("");
      showModal('<h2>选择用法：《' + escapeHtml(card.name) + '》</h2><p class="muted">同一项手段的不同用法会改变目标、代价和反制风险。</p><div class="mode-list">' + modeHtml + '</div>');
      Array.prototype.forEach.call(document.querySelectorAll("[data-mode-card]"), function (button) {
        button.addEventListener("click", function () {
          Game.playCard(button.getAttribute("data-mode-card"), button.getAttribute("data-mode-id"));
          hideModal();
          Game.UI.render();
        });
      });
    },
    showEnding: function () {
      var ending = Game.state.ending;
      showModal('<h2 class="ending-title">' + escapeHtml(ending.title) + '</h2><div class="ending-body">' + renderParagraphs(ending.text, "ending-text") + '</div><div class="modal-actions"><button id="export-button">导出生平摘要</button><button id="new-run-button" class="ghost-button">再开一局</button></div>');
      document.getElementById("export-button").addEventListener("click", Game.UI.showExport);
      document.getElementById("new-run-button").addEventListener("click", function () {
        hideModal();
        Game.startNewRun();
      });
    },
    showExport: function () {
      showModal('<h2>生平摘要</h2><p class="muted">可以直接复制这段文字。</p><textarea class="export" readonly>' + escapeHtml(Game.exportBiography()) + '</textarea>');
    },
    hideModal: hideModal
  };
})();
