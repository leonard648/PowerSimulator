(function () {
  window.Game = window.Game || {};

  var CRITICAL_SAFE = 4;
  var STYLE_TAGS = ["清流", "能吏", "权谋", "仁政", "圆滑", "酷吏", "贪腐", "恬退"];

  function mapFameName(key) {
    return {
      clean: "清名",
      competence: "能名",
      literary: "文名",
      power: "权名",
      cruel: "酷名",
      corruption: "贪名"
    }[key] || key;
  }

  function mapWorldName(key) {
    return {
      emperorTrust: "皇帝信任",
      scholarOpinion: "士林评价",
      publicMood: "民心",
      fiscalHealth: "财政健康",
      factionHeat: "朋党烈度",
      courtPressure: "朝局压力"
    }[key] || key;
  }

  function mapResourceName(key) {
    return {
      energy: "精力",
      money: "银两",
      favor: "人情",
      pressure: "压力"
    }[key] || key;
  }

  function currentTimeLabel() {
    var s = Game.state;
    var office = Game.getOffice ? Game.getOffice().name : "";
    var season = GameData.seasons[s.seasonIndex] || "";
    return "第" + s.year + "年" + season + "·" + office;
  }

  function pushStoryBeat(kind, title, text) {
    var s = Game.state;
    s.storyBeats = s.storyBeats || [];
    s.storyBeats.unshift({
      time: currentTimeLabel(),
      kind: kind,
      title: title,
      text: text
    });
    s.storyBeats = s.storyBeats.slice(0, 36);
  }

  function officeIndex(officeId) {
    return GameData.offices.findIndex(function (office) { return office.id === officeId; });
  }

  function recordCareer(type, text) {
    var s = Game.state;
    s.career.history = s.career.history || [];
    s.career.history.push({
      time: currentTimeLabel(),
      type: type,
      officeId: s.career.officeId,
      rankName: s.career.rankName,
      merit: s.career.merit,
      text: text
    });
    s.career.history = s.career.history.slice(-40);
  }

  function changeMerit(delta, notes) {
    var s = Game.state;
    if (!s.career) return;
    var before = s.career.merit || 0;
    s.career.merit = Math.max(0, before + delta);
    if (notes && s.career.merit !== before) {
      notes.push("官评 " + (delta > 0 ? "+" : "") + delta);
    }
  }

  function promoteIfReady() {
    var s = Game.state;
    var promoted = false;
    s.career.unlockedOffices = s.career.unlockedOffices || ["hanlin"];
    while (true) {
      var office = Game.getOffice();
      if (!office.nextOfficeId || !office.promotionMerit || s.career.merit < office.promotionMerit) break;
      var next = Game.getOfficeById(office.nextOfficeId);
      if (next.minYear && s.year < next.minYear) break;
      var text = "官评至 " + s.career.merit + "，由" + office.name + "升任" + next.name + "。";
      s.career.officeId = next.id;
      s.career.rankName = next.rankName || next.name;
      if (s.career.unlockedOffices.indexOf(next.id) < 0) {
        s.career.unlockedOffices.push(next.id);
        if (!Game.queueOfficeCardDraft || !Game.queueOfficeCardDraft(next.id)) {
          Game.addOfficeCards(next.id);
        }
      }
      recordCareer("promotion", text);
      Game.addLog(text + " 新的职责与牌池已经展开。");
      pushStoryBeat("promotion", "升任" + next.name, "吏部文书送到时，朱印压得很实。你知道这不是奖赏的终点，只是把你推到更亮、更险的位置。");
      promoted = true;
    }
    return promoted;
  }

  function demoteCareer(reason, notes) {
    var s = Game.state;
    var index = officeIndex(s.career.officeId);
    if (index <= 0) {
      if (notes) notes.push("官阶已无可降");
      return false;
    }
    var from = GameData.offices[index];
    var to = GameData.offices[index - 1];
    s.career.officeId = to.id;
    s.career.rankName = to.rankName || to.name;
    var text = "因" + reason + "，由" + from.name + "降调为" + to.name + "。";
    recordCareer("demotion", text);
    if (notes) notes.push("降调：" + to.name);
    Game.addLog(text);
    pushStoryBeat("demotion", "降调" + to.name, "这道调令写得很平，平到像是没人愿意承认其中有刀。");
    return true;
  }

  function refreshRelationWarnings() {
    var s = Game.state;
    var rel = s.relations || {};
    var emperor = rel.emperor || {};
    s.relationWarnings = {};
    GameData.people.forEach(function (person) {
      var current = rel[person.id] || {};
      var badges = [];
      if ((current.trust || 0) >= 8 || (current.closeness || 0) >= 8) badges.push("助力");
      if ((current.debt || 0) >= 5) badges.push("牵连");
      if ((current.resentment || 0) >= 7 || (current.suspicion || 0) >= 9) badges.push("危险");
      if (person.id === "emperor" && ((current.suspicion || 0) >= 15 || s.world.emperorTrust <= 3)) badges.push("清算");
      if (person.id === "rival" && (current.resentment || 0) >= 16 && (s.world.emperorTrust <= 3 || (emperor.suspicion || 0) >= 15)) badges.push("清算");
      if (person.id === "scholars" && s.world.scholarOpinion >= 12) badges.push("助力");
      s.relationWarnings[person.id] = badges.filter(function (label, index) {
        return badges.indexOf(label) === index;
      });
    });
  }

  function tickRelationCooldowns() {
    var s = Game.state;
    var cooldowns = s.relationEventCooldowns || {};
    Object.keys(cooldowns).forEach(function (id) {
      cooldowns[id] = Math.max(0, cooldowns[id] - 1);
    });
  }

  function eventById(id) {
    return GameData.events.find(function (event) { return event.id === id; });
  }

  function relationEventAvailable(id) {
    var cooldowns = Game.state.relationEventCooldowns || {};
    return !cooldowns[id];
  }

  function chooseRelationEvent() {
    var s = Game.state;
    var rel = s.relations;
    var emperor = rel.emperor || {};
    var officeId = Game.getOffice().id;
    var fatalRisk = rel.rival.resentment >= 16 && (s.world.emperorTrust <= 3 || emperor.suspicion >= 15);
    var checks = [
      { id: "rel_framed_case", priority: fatalRisk ? 20 : 11, ok: rel.rival.resentment >= 10, fatal: fatalRisk },
      { id: "rel_vermilion_suspicion", priority: 10, ok: s.world.emperorTrust <= 4 || emperor.suspicion >= 9, fatal: s.world.emperorTrust <= 3 || emperor.suspicion >= 15 },
      { id: "rel_public_backlash", priority: 8, ok: rel.scholars.resentment >= 6 || s.world.scholarOpinion <= 4 },
      { id: "rel_gentry_circle", priority: 7, ok: officeId === "county" && rel.gentry.resentment >= 7 },
      { id: "rel_clerk_trap", priority: 7, ok: officeId === "county" && rel.clerks.resentment >= 7 },
      { id: "rel_school_pressure", priority: 6, ok: rel.mentor.debt >= 5 || rel.peers.debt >= 4 },
      { id: "rel_secret_mandate", priority: 5, ok: s.world.emperorTrust >= 10 || emperor.trust >= 10 },
      { id: "rel_scholar_support", priority: 4, ok: rel.scholars.closeness >= 8 || s.world.scholarOpinion >= 12 }
    ].filter(function (item) {
      return item.ok && relationEventAvailable(item.id) && eventById(item.id);
    }).sort(function (a, b) { return b.priority - a.priority; });
    return checks.length ? eventById(checks[0].id) : null;
  }

  function chooseFatalRelationEvent() {
    var s = Game.state;
    var rel = s.relations;
    var emperor = rel.emperor || {};
    if (rel.rival.resentment >= 16 && (s.world.emperorTrust <= 3 || emperor.suspicion >= 15) && relationEventAvailable("rel_framed_case")) {
      return eventById("rel_framed_case");
    }
    if ((s.world.emperorTrust <= 3 || emperor.suspicion >= 15) && relationEventAvailable("rel_vermilion_suspicion")) {
      return eventById("rel_vermilion_suspicion");
    }
    return null;
  }

  function armRelationCooldown(event) {
    if (!event || event.special !== "relation") return;
    Game.state.relationEventCooldowns[event.id] = 8;
  }

  function npcDefById(id) {
    return (GameData.npcs || []).find(function (npc) { return npc.id === id; });
  }

  function npcState(id) {
    if (!Game.state.npcs) Game.state.npcs = {};
    if (!Game.state.npcs[id]) {
      var def = npcDefById(id) || { initial: {} };
      Game.state.npcs[id] = {
        bond: def.initial && def.initial.bond || 0,
        resentment: def.initial && def.initial.resentment || 0,
        debt: def.initial && def.initial.debt || 0,
        trust: def.initial && def.initial.trust || 0,
        stage: 0,
        met: false,
        status: "active",
        cooldown: 0,
        history: []
      };
    }
    return Game.state.npcs[id];
  }

  function npcIsInCurrentOffice(def) {
    return def && def.officeScope && def.officeScope.indexOf(Game.getOffice().id) >= 0;
  }

  function relationLabelByGroup(group) {
    var person = GameData.people.find(function (item) { return item.id === group; });
    return person ? person.name : group;
  }

  function relevantNpcsForGroup(group) {
    return (GameData.npcs || []).filter(function (def) {
      var state = npcState(def.id);
      return def.group === group && (npcIsInCurrentOffice(def) || state.met || state.bond >= 5 || state.resentment >= 5 || state.debt >= 4);
    });
  }

  function recordNpc(id, text) {
    var state = npcState(id);
    state.history = state.history || [];
    state.history.push({ time: currentTimeLabel(), text: text });
    state.history = state.history.slice(-12);
    state.met = true;
  }

  function applyNpcDeltas(npcDeltas, notes) {
    Object.keys(npcDeltas || {}).forEach(function (id) {
      var def = npcDefById(id);
      var state = npcState(id);
      var deltas = npcDeltas[id] || {};
      var changed = false;
      ["bond", "resentment", "debt", "trust", "stage"].forEach(function (key) {
        if (!deltas[key]) return;
        state[key] = (state[key] || 0) + deltas[key];
        changed = true;
      });
      if (deltas.status) {
        state.status = deltas.status;
        changed = true;
      }
      if (!changed) return;
      state.met = true;
      if (def && notes) {
        var parts = [];
        ["bond", "trust", "debt", "resentment"].forEach(function (key) {
          if (deltas[key]) parts.push(({ bond: "羁绊", trust: "信任", debt: "亏欠", resentment: "怨恨" })[key] + (deltas[key] > 0 ? " +" : " ") + deltas[key]);
        });
        if (parts.length) notes.push(def.name + "：" + parts.join("、"));
      }
    });
  }

  function mapRelationsToNpcs(relations) {
    Object.keys(relations || {}).forEach(function (group) {
      var deltas = relations[group] || {};
      relevantNpcsForGroup(group).forEach(function (def) {
        var change = {};
        if (deltas.closeness) change.bond = (change.bond || 0) + deltas.closeness;
        if (deltas.trust) change.trust = (change.trust || 0) + deltas.trust;
        if (deltas.debt) change.debt = (change.debt || 0) + deltas.debt;
        if (deltas.resentment) change.resentment = (change.resentment || 0) + deltas.resentment;
        if (deltas.suspicion && group === "emperor") change.resentment = (change.resentment || 0) + Math.max(0, deltas.suspicion);
        if ((deltas.trust || 0) < 0) change.resentment = (change.resentment || 0) + Math.abs(deltas.trust);
        if ((deltas.closeness || 0) < 0) change.resentment = (change.resentment || 0) + Math.abs(deltas.closeness);
        if (!Object.keys(change).length) return;
        applyNpcDeltas((function () {
          var bag = {};
          bag[def.id] = change;
          return bag;
        })());
      });
    });
  }

  function tickNpcCooldowns() {
    var s = Game.state;
    s.npcEventCooldown = Math.max(0, (s.npcEventCooldown || 0) - 1);
    Object.keys(s.npcs || {}).forEach(function (id) {
      s.npcs[id].cooldown = Math.max(0, (s.npcs[id].cooldown || 0) - 1);
    });
  }

  function npcEventAvailable(event) {
    if (!event || event.special !== "npc") return false;
    var def = npcDefById(event.npcId);
    var state = npcState(event.npcId);
    return def && event.office === Game.getOffice().id && npcIsInCurrentOffice(def) && state.status === "active" && !state.cooldown && !(Game.state.npcEventCooldown || 0);
  }

  function npcTriggerScore(event) {
    var def = npcDefById(event.npcId);
    var state = npcState(event.npcId);
    if (!def || !def.trigger) return 0;
    var value = state[def.trigger.stat] || 0;
    if (value < def.trigger.min) return 0;
    var weight = def.trigger.stat === "resentment" ? 4 : def.trigger.stat === "debt" ? 3 : 2;
    return weight * 10 + value - def.trigger.min;
  }

  function chooseNpcEvent() {
    var candidates = GameData.events.filter(function (event) {
      return event.special === "npc" && npcEventAvailable(event) && npcTriggerScore(event) > 0;
    }).sort(function (a, b) {
      return npcTriggerScore(b) - npcTriggerScore(a);
    });
    return candidates.length ? candidates[0] : null;
  }

  function armNpcCooldown(event) {
    if (!event || event.special !== "npc") return;
    var state = npcState(event.npcId);
    state.cooldown = 8;
    state.met = true;
    Game.state.npcEventCooldown = 2;
    recordNpc(event.npcId, "卷入《" + event.name + "》。");
  }

  function npcForTemplate(template) {
    var participants = template.participants || [];
    return (GameData.npcs || []).find(function (def) {
      var state = npcState(def.id);
      return npcIsInCurrentOffice(def) && (state.met || state.bond >= 3 || state.resentment >= 3 || state.debt >= 3) && participants.indexOf(relationLabelByGroup(def.group)) >= 0;
    });
  }

  function hasParticipant(template, name) {
    return (template.participants || []).indexOf(name) >= 0;
  }

  function pickLine(lines) {
    return lines[Math.floor(Math.random() * lines.length)];
  }

  function highRelationRisk() {
    var rel = Game.state.relations;
    if (rel.rival.resentment >= 8) return "政敌近来递话很少，反倒让人不安；凡是经过都察院的抄件，似乎都会多停半日。";
    if (rel.gentry.resentment >= 7) return "地方来信不再明着抗拒，只在措辞里留出刺，像是在等你先失手。";
    if (rel.clerks.resentment >= 7) return "胥吏见你入署便低头收声，账册倒是送得勤，页角却总有重抄的痕迹。";
    if (rel.scholars.resentment >= 6) return "士林笔记里已经有了你的名字，只是旁边还空着评语。";
    return "";
  }

  function styleMoodLine() {
    var style = dominantStyle().tag;
    if (style === "清流") return "你知道旁人正在等一句硬话，可硬话一出口，便很难再收回。";
    if (style === "能吏") return "案头账册、期限与人名排成一列，你最先看的仍是哪里能落笔。";
    if (style === "权谋") return "你没有急着表态，只先问这件事是谁最怕被查清。";
    if (style === "仁政") return "堂外人的哭声压得很低，却比堂上所有官话都重。";
    if (style === "圆滑") return "你把几封来信按轻重叠好，明白这一局未必只能有输赢。";
    if (style === "酷吏") return "你看见下属眼里的惧意，也知道惧意有时比信任更快。";
    if (style === "贪腐") return "有人把价码说得含混，仿佛只是在谈天气。";
    return "你把灯拨亮一些，先不急着把心里的判断写进公文。";
  }

  function participantStoryLine(template) {
    if (hasParticipant(template, "皇帝")) return "宫中只漏出一句含混口风，像准许你进，又像等你自己退。";
    if (hasParticipant(template, "地方士绅")) return "几位乡绅的名帖已经压在案头，纸香很淡，分量却沉。";
    if (hasParticipant(template, "胥吏")) return "书吏送来案卷时手指按住一角，像怕你看见，又像盼你看见。";
    if (hasParticipant(template, "政敌")) return "对头没有出面，只让一封抄件先到，字字都像旁观。";
    if (hasParticipant(template, "士林")) return "书院与茶肆已经传开两个版本，哪个都不全真，哪个都足以伤人。";
    if (hasParticipant(template, "百姓")) return "堂外的脚步声越聚越密，没人敢高声，却都在等县衙给一句话。";
    return "案卷送到时封口尚新，火漆裂处露出一点旧尘。";
  }

  function eventDetail(template) {
    return (GameData.eventDetails || {})[template.id] || {};
  }

  function compactParagraphs(lines, limit) {
    return lines.filter(function (line) {
      return line && String(line).trim();
    }).map(function (line) {
      return String(line).trim();
    }).slice(0, limit || 6);
  }

  function officeTensionLine(office, s) {
    var yearText = "第" + s.year + "年" + (GameData.seasons[s.seasonIndex] || "");
    return office.name + "任上" + yearText + "，" + office.goal + "已不只是考语，而是正在案前逼你表态的现实。";
  }

  function privatePressureLines(s) {
    var lines = [styleMoodLine()];
    if (s.resources.pressure >= 12) lines.push("连月压力已重，案卷尚未展开，身体却先记住了仕途的代价。");
    if (s.stains.length) {
      lines.push("旧日留下的" + s.stains.length + "处污点仍在牌库深处沉着，像有人替它们记着可以重见天日的时辰。");
    }
    var riskLine = highRelationRisk();
    if (riskLine) lines.push(riskLine);
    return lines;
  }

  function makeEventStory(template) {
    var s = Game.state;
    var office = Game.getOffice();
    var critical = (template.criticalTracks || Object.keys(template.tracks).slice(0, 2)).join("、");
    var detail = eventDetail(template);
    var privateNotes = privatePressureLines(s);
    var npc = template.special === "npc" ? npcDefById(template.npcId) : npcForTemplate(template);
    if (npc && template.special === "npc") {
      privateNotes.unshift(npc.name + "把话递到你案头。他要的不是一句官样文章，而是要你在“" + npc.agenda + "”这件事上留下立场。");
    } else if (npc) {
      privateNotes.unshift(npc.name + "的名字夹在这桩事里，未必出面，却足够改变旁人的眼色。");
    }
    var relationHook = template.special === "relation" ? "这不是寻常差事，而是" + template.relationSource + "积到临界后翻出的暗浪。" : "";
    var npcHook = npc && template.special === "npc" ? "这不是寻常公事，而是" + npc.name + "亲手递来的请托、试探或暗门。" : "";
    var hook = npcHook || relationHook || participantStoryLine(template);
    var stakes = "此案真正咬人的地方，是" + critical + "。若只把表面压平，余波会在下一季换个名字回来。";
    var paragraphs = compactParagraphs([
      detail.background || template.desc,
      detail.scene || hook,
      detail.conflict || stakes,
      officeTensionLine(office, s),
      privateNotes.join(" "),
      detail.historicalWeight
    ], 6);
    return {
      hook: hook,
      stakes: stakes,
      privateNote: privateNotes.slice(0, 2).join(" "),
      officeNote: officeTensionLine(office, s),
      paragraphs: paragraphs
    };
  }

  function makeOutcomeStory(event, result, consequences) {
    var played = event.played.length ? "你动用过" + event.played.slice(0, 3).join("、") + "。" : "你几乎没有真正出手。";
    var unresolved = result.unresolved.length ? "未平的" + result.unresolved.slice(0, 2).join("、") + "被人悄悄记进旁账。" : "案后诸人各自退开，暂时无人敢把话说满。";
    var resultLine;
    if (result.success) {
      resultLine = pickLine([
        "史笔若写到此处，大概会说你能在刀背上落墨，" + played + unresolved,
        "结案那天，堂上风声忽然轻了些，" + played + "这不是胜利的锣声，只是下一局前难得的静。"
      ]);
    } else if (result.partial) {
      resultLine = pickLine([
        "此事算是过关，却不是干净收场。" + played + unresolved,
        "你把最坏的结果压住了，但纸面下仍有湿痕。" + played + unresolved
      ]);
    } else {
      resultLine = pickLine([
        "这一败没有立刻把你掀倒，却让后来每一次开卷都多一层阴影。" + played + unresolved,
        "案子散去时，最先留下的不是罪名，而是旁人确认你也会失手。" + played + (consequences.length ? " " + consequences[0] : "")
      ]);
    }
    var consequenceLine = consequences.length ? "后患没有随结案散去：" + consequences.join(" ") : "至少在这一季，案后的杂音尚未汇成新的公文。";
    var relationLine = "";
    if (event.special === "relation") {
      relationLine = "此事本由“" + (event.relationSource || "关系阈值") + "”引发，结局会反过来改写旁人对你的亲近、猜忌或怨恨。";
    } else if (event.special === "npc" && event.npcId) {
      var def = npcDefById(event.npcId);
      if (def) relationLine = def.name + "因此更深地写入你的仕途。此人不是一段插曲，而会在往后的案卷里继续索取、偿还或记恨。";
    } else {
      relationLine = "这类公事看似一季一结，实际会把名声、钱粮、人情和朝局压力一点点推向新的形状。";
    }
    return compactParagraphs([resultLine, consequenceLine, relationLine], 4).join("\n");
  }

  function npcOutcomeLine(event, result) {
    if (!event || event.special !== "npc" || !event.npcId) return "";
    var def = npcDefById(event.npcId);
    if (!def) return "";
    if (result.success) return def.name + "记住了这次相助，往后递来的话会更像私交。";
    if (result.partial) return def.name + "没有把话说绝，却也把这笔账轻轻合上了一半。";
    return def.name + "把失望压在礼数后面，这份人情很快会变成怨恨。";
  }

  function recordNpcOutcome(event, result) {
    if (!event || event.special !== "npc" || !event.npcId) return;
    var title = result.success ? "事成" : result.partial ? "勉强收束" : "失手";
    var state = npcState(event.npcId);
    if (result.success || result.partial) state.stage = (state.stage || 0) + 1;
    recordNpc(event.npcId, "《" + event.name + "》" + title);
  }

  function chooseEvent() {
    var s = Game.state;
    var fatalRelationEvent = chooseFatalRelationEvent();
    if (fatalRelationEvent) return fatalRelationEvent;
    var npcEvent = chooseNpcEvent();
    if (npcEvent) return npcEvent;
    var relationEvent = chooseRelationEvent();
    if (relationEvent) return relationEvent;
    var office = Game.getOffice().id;
    var candidates = GameData.events.filter(function (event) {
      return !event.special && event.office === office && s.eventHistory.indexOf(event.id) < 0;
    });
    if (candidates.length === 0) {
      candidates = GameData.events.filter(function (event) { return !event.special && event.office === office; });
    }
    var weighted = [];
    candidates.forEach(function (event) {
      var weight = event.weight || 1;
      if (event.id.indexOf("purge") >= 0 && s.stains.length >= 4) weight += 2;
      if (event.name.indexOf("弹劾") >= 0 && s.tagUse["清流"] >= 4) weight += 1;
      for (var i = 0; i < weight; i += 1) weighted.push(event);
    });
    return weighted[Math.floor(Math.random() * weighted.length)];
  }

  function hardestTrackName(tracks) {
    var best = "";
    var bestValue = -1;
    Object.keys(tracks || {}).forEach(function (name) {
      if (tracks[name].value > bestValue) {
        best = name;
        bestValue = tracks[name].value;
      }
    });
    return best;
  }

  function applyNpcOpeningInfluence(template, instance) {
    var npc = template.special === "npc" ? npcDefById(template.npcId) : npcForTemplate(template);
    if (!npc) return;
    var state = npcState(npc.id);
    var trackName = hardestTrackName(instance.tracks);
    if (!trackName || !instance.tracks[trackName]) return;
    var notes = [];
    if (state.bond >= 6 || state.trust >= 6) {
      instance.tracks[trackName].value = Game.Util.clamp(instance.tracks[trackName].value - 1, 0, instance.tracks[trackName].max + 5);
      notes.push(npc.name + "先替你垫了一步，" + trackName + "略有松动。");
    }
    if (state.debt >= 5) {
      instance.threat = Math.min(instance.threatMax || 3, (instance.threat || 0) + 1);
      notes.push("你欠" + npc.name + "的人情压在案边，暗流一开始就更急。");
    }
    if (state.resentment >= 6) {
      instance.tracks[trackName].value = Game.Util.clamp(instance.tracks[trackName].value + 2, 0, instance.tracks[trackName].max + 5);
      notes.push(npc.name + "的怨气已经先你一步抵达，" + trackName + "陡然加重。");
    }
    if (notes.length) {
      instance.story = instance.story || {};
      instance.story.privateNote = [instance.story.privateNote, notes.join(" ")].filter(Boolean).join(" ");
    }
  }

  function createEventInstance(template) {
    var tracks = {};
    Object.keys(template.tracks).forEach(function (name) {
      tracks[name] = { value: template.tracks[name], max: template.tracks[name] };
    });
    var instance = {
      id: template.id,
      name: template.name,
      desc: template.desc,
      participants: template.participants,
      special: template.special || "",
      relationSource: template.relationSource || "",
      npcId: template.npcId || "",
      story: makeEventStory(template),
      tracks: tracks,
      criticalTracks: (template.criticalTracks || Object.keys(template.tracks).slice(0, 2)).slice(),
      reactions: Game.Util.deepClone(template.reactions || []),
      failureHooks: template.failureHooks || {},
      successEffect: Game.Util.deepClone(template.successEffect || {}),
      partialEffect: Game.Util.deepClone(template.partialEffect || {}),
      failEffect: Game.Util.deepClone(template.failEffect || {}),
      fatalOnFail: template.fatalOnFail || null,
      success: template.success,
      fail: template.fail,
      played: [],
      flags: {},
      playCount: 0,
      reactionCount: 0,
      threat: 0,
      threatMax: 3,
      lastThreatGain: 0,
      outcome: ""
    };
    applyNpcOpeningInfluence(template, instance);
    return instance;
  }

  function trackTotal(event) {
    return Object.keys(event.tracks).reduce(function (sum, key) {
      return sum + Math.max(0, event.tracks[key].value);
    }, 0);
  }

  function maxTrackTotal(event) {
    return Object.keys(event.tracks).reduce(function (sum, key) {
      return sum + event.tracks[key].max;
    }, 0);
  }

  function criticalSafe(event) {
    return (event.criticalTracks || []).every(function (track) {
      return !event.tracks[track] || event.tracks[track].value <= CRITICAL_SAFE;
    });
  }

  function criticalAlmostSafe(event) {
    return (event.criticalTracks || []).every(function (track) {
      return !event.tracks[track] || event.tracks[track].value <= CRITICAL_SAFE + 4;
    });
  }

  function criticalSafeCount(event) {
    return (event.criticalTracks || []).filter(function (track) {
      return !event.tracks[track] || event.tracks[track].value <= CRITICAL_SAFE;
    }).length;
  }

  function blockedCriticalTracks(event) {
    return (event.criticalTracks || []).filter(function (track) {
      return event.tracks[track] && event.tracks[track].value > CRITICAL_SAFE;
    });
  }

  function unresolvedTracks(event, success) {
    return Object.keys(event.tracks).filter(function (trackName) {
      var track = event.tracks[trackName];
      return success ? track.value >= Math.max(4, Math.ceil(track.max * 0.58)) : track.value > CRITICAL_SAFE + 1;
    });
  }

  function evaluateEvent(event) {
    var total = trackTotal(event);
    var max = maxTrackTotal(event);
    var safeCritical = criticalSafe(event);
    var almostCritical = criticalAlmostSafe(event);
    var criticalCount = (event.criticalTracks || []).length;
    var safeCount = criticalSafeCount(event);
    var success = safeCritical && total <= Math.max(7, Math.floor(max * 0.62));
    var partial = !success && event.playCount > 0 && almostCritical && (safeCount > 0 || !criticalCount) && total <= Math.floor(max * 0.95);
    var blocked = blockedCriticalTracks(event);
    var level = success ? "success" : partial ? "partial" : "fail";
    return {
      total: total,
      max: max,
      success: success,
      partial: partial,
      level: level,
      title: success ? "稳妥收束" : partial ? "勉强收束" : "关键处未解",
      desc: success ? "关键阻力已压住，余波可控。" : partial ? "大局还能收住，但会留下后患。" : "至少一条关键阻力仍然过高，强行结案会被反噬。",
      blocked: blocked,
      unresolved: unresolvedTracks(event, success)
    };
  }

  function applyDeltaBag(target, deltas) {
    Object.keys(deltas || {}).forEach(function (key) {
      target[key] = (target[key] || 0) + deltas[key];
    });
  }

  function applyRelations(relations) {
    var s = Game.state;
    Object.keys(relations || {}).forEach(function (personId) {
      if (!s.relations[personId]) return;
      applyDeltaBag(s.relations[personId], relations[personId]);
    });
    mapRelationsToNpcs(relations);
  }

  function describeDeltas(prefix, deltas, mapper) {
    return Object.keys(deltas || {}).map(function (key) {
      var value = deltas[key];
      if (value === 0) return "";
      return prefix + mapper(key) + (value > 0 ? " +" : " ") + value;
    }).filter(Boolean);
  }

  function dominantStyle() {
    var s = Game.state;
    var best = { tag: "未定", value: 0 };
    STYLE_TAGS.forEach(function (tag) {
      var value = s.tagUse[tag] || 0;
      if (value > best.value) best = { tag: tag, value: value };
    });
    return best.value >= 3 ? best : { tag: "未定", value: best.value };
  }

  function removeFirstNegativeCard() {
    var s = Game.state;
    var stainId = s.stains.length ? s.stains.shift() : null;
    var zones = ["deck", "hand", "discard"];
    var removed = null;

    zones.some(function (zone) {
      var index = s[zone].findIndex(function (card) {
        return stainId ? card.id === stainId : Game.isNegativeCard(card);
      });
      if (index < 0) return false;
      removed = s[zone].splice(index, 1)[0];
      return true;
    });

    if (!removed && stainId) {
      removed = Game.cardById(stainId);
    } else if (removed && !stainId && removed.type === "污点") {
      var stainIndex = s.stains.indexOf(removed.id);
      if (stainIndex >= 0) s.stains.splice(stainIndex, 1);
    }

    return removed ? removed.name : "";
  }

  function styleRewardOption(style) {
    var tag = style.tag;
    if (tag === "清流") {
      return { id: "style_clean", name: "清议入史", desc: "清名 +1，士林评价 +1。", effect: { fame: { clean: 1 }, world: { scholarOpinion: 1 } } };
    }
    if (tag === "能吏") {
      return { id: "style_competence", name: "整饬成例", desc: "能名 +1，财政健康 +1。", effect: { fame: { competence: 1 }, world: { fiscalHealth: 1 } } };
    }
    if (tag === "权谋") {
      return { id: "style_power", name: "暗线归拢", desc: "权名 +1，朋党烈度 -1，压力 +1。", effect: { fame: { power: 1 }, world: { factionHeat: -1 }, resources: { pressure: 1 } } };
    }
    if (tag === "仁政") {
      return { id: "style_benevolent", name: "民间口碑", desc: "民心 +2，清名 +1。", effect: { fame: { clean: 1 }, world: { publicMood: 2 } } };
    }
    if (tag === "圆滑") {
      return { id: "style_smooth", name: "留足台阶", desc: "人情 +1，政敌怨恨 -1。", effect: { resources: { favor: 1 }, relations: { rival: { resentment: -1 } } } };
    }
    if (tag === "酷吏") {
      return { id: "style_cruel", name: "威势压服", desc: "酷名 +1，胥吏畏惧 +1，民心 -1。", effect: { fame: { cruel: 1 }, world: { publicMood: -1 }, relations: { clerks: { fear: 1 } } } };
    }
    if (tag === "贪腐") {
      return { id: "style_corrupt", name: "遮掩账脚", desc: "银两 +2，贪名 +1。", effect: { resources: { money: 2 }, fame: { corruption: 1 } } };
    }
    return { id: "style_foundation", name: "补强根基", desc: "能名 +1，清名 +1。", effect: { fame: { competence: 1, clean: 1 } } };
  }

  function draftPoolForState(result) {
    var s = Game.state;
    var office = Game.getOffice().id;
    var style = dominantStyle().tag;
    var pool = [];

    if (style === "清流") pool = ["public_repute", "chain_memorial", "public_petition", "resign_for_principle"];
    else if (style === "能吏") pool = ["case_precedent", "joint_review", "evidence_chain", "strict_quota"];
    else if (style === "权谋") pool = ["turn_reaction", "watch_in_silence", "secret_memorial", "withhold_dossier"];
    else if (style === "仁政") pool = ["people_register", "public_works", "repair_waterworks", "village_covenant"];
    else if (style === "圆滑") pool = ["quiet_broker", "smooth_transfer", "share_credit", "humble_apology"];
    else pool = ["public_repute", "case_precedent", "turn_reaction", "people_register", "quiet_broker"];

    if (office === "hanlin") pool = pool.concat(["ritual_poem", "educate_heir", "private_warning"]);
    if (office === "county") pool = pool.concat(["seal_grain", "village_covenant", "people_register", "case_precedent"]);
    if (office === "censor") pool = pool.concat(["chain_memorial", "joint_review", "turn_reaction", "watch_in_silence"]);
    if (!result.success) pool = pool.concat(["medical_rest", "quiet_broker", "case_precedent"]);
    if (s.stains.length >= 2) pool = pool.concat(["turn_reaction", "watch_in_silence"]);

    return pool.filter(function (id, index) {
      return Game.cardById(id) && pool.indexOf(id) === index;
    });
  }

  function pickDraftCard(result) {
    var pool = draftPoolForState(result);
    if (!pool.length) return "case_precedent";
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function hasAnyCard(ids) {
    var zones = Game.state.deck.concat(Game.state.hand, Game.state.discard);
    return zones.some(function (card) { return ids.indexOf(card.id) >= 0; });
  }

  function refineRewardOption(result) {
    var upgradePairs = {
      seal_document: "case_precedent",
      archive_search: "joint_review",
      academy_lecture: "public_repute",
      court_debate: "chain_memorial",
      private_warning: "quiet_broker",
      secret_memorial: "watch_in_silence",
      withhold_dossier: "turn_reaction"
    };
    var upgradeIds = Object.keys(upgradePairs);
    if (hasAnyCard(upgradeIds)) {
      return { id: "upgrade_deck", name: "升格旧法", desc: "将一张基础手段升级为路线牌。", effect: { upgradeOne: upgradePairs } };
    }
    if (Game.state.stains.length || Game.state.deck.concat(Game.state.discard, Game.state.hand).some(Game.isNegativeCard)) {
      return { id: "clean_trace", name: "清理旧痕", desc: "移除一张污点或心病牌，压力 +1，清名 +1。", effect: { removeNegative: 1, resources: { pressure: 1 }, fame: { clean: 1 } } };
    }
    return { id: "trim_deck", name: "裁汰冗牍", desc: "删去一张基础牌，牌库更干净。", effect: { removeOne: ["seal_document", "peer_letter", "family_support", "marriage_plea", "copy_classics", "medical_rest"] } };
  }

  function cardName(id) {
    var card = Game.cardById(id);
    return card ? card.name : id;
  }

  function gapRewardOption(result) {
    var gaps = (result.blocked || []).concat(result.unresolved || []).join("、");
    var id = "case_precedent";
    if (gaps.indexOf("证据不足") >= 0) id = "evidence_chain";
    else if (gaps.indexOf("派系阻挠") >= 0 || gaps.indexOf("举荐不足") >= 0) id = "quiet_broker";
    else if (gaps.indexOf("上意不明") >= 0) id = "watch_in_silence";
    else if (gaps.indexOf("清议沸腾") >= 0 || gaps.indexOf("流言滋生") >= 0) id = "public_repute";
    else if (gaps.indexOf("钱粮缺口") >= 0) id = "commercial_tax";
    else if (gaps.indexOf("民怨积累") >= 0 || gaps.indexOf("灾情蔓延") >= 0) id = "people_register";
    else if (gaps.indexOf("政敌反扑") >= 0 || gaps.indexOf("朋党反扑") >= 0) id = "turn_reaction";
    if (!Game.cardById(id)) id = "case_precedent";
    return {
      id: "gap_card",
      name: "补足短板",
      desc: "针对未解阻力获得《" + cardName(id) + "》，下次遇到同类局面更有抓手。",
      effect: { addCard: id }
    };
  }

  function taintedRewardOption() {
    var office = Game.getOffice().id;
    var cardId = office === "county" ? "conceal_deficit_action" : office === "censor" ? "withhold_dossier" : "seek_inner_tip";
    var stainId = office === "county" ? "conceal_deficit" : office === "censor" ? "withheld_file" : "inner_palace_contact";
    return {
      id: "tainted_card",
      name: "险路强牌",
      desc: "获得《" + cardName(cardId) + "》，同时留下《" + cardName(stainId) + "》。短期很强，身后账重。",
      effect: { addCard: cardId, addStain: stainId, resources: { pressure: 1 } }
    };
  }

  function buildRewardOptions(result) {
    var draftId = pickDraftCard(result);
    var draftCard = Game.cardById(draftId);
    var routeOption = {
      id: "route_card",
      name: "沉淀路线",
      desc: "获得《" + (draftCard ? draftCard.name : draftId) + "》，顺着当前为官方法继续成型。",
      effect: { addCard: draftId }
    };
    var gapOption = gapRewardOption(result);
    var taintedOption = taintedRewardOption();
    if (result.success && Game.state.resources.pressure > 0) {
      routeOption.effect = mergeEffect(routeOption.effect, { resources: { pressure: -1 } });
      gapOption.effect = mergeEffect(gapOption.effect, { resources: { pressure: -1 } });
    }
    return [routeOption, gapOption, taintedOption];
  }

  function applyRewardEffect(effect) {
    var s = Game.state;
    var notes = [];
    applyDeltaBag(s.resources, effect.resources || {});
    applyDeltaBag(s.fame, effect.fame || {});
    applyDeltaBag(s.world, effect.world || {});
    applyRelations(effect.relations || {});
    applyNpcDeltas(effect.npcs || {}, notes);
    if (effect.removeNegative) {
      var removed = removeFirstNegativeCard();
      notes.push(removed ? "移除旧痕：《" + removed + "》" : "没有可移除的旧痕");
    }
    if (effect.addCard) {
      var added = Game.addCardToDiscard(effect.addCard);
      if (added) notes.push("新牌入库：《" + added.name + "》");
    }
    if (effect.addStain) {
      Game.addNegativeCard(effect.addStain);
      var stain = Game.cardById(effect.addStain);
      notes.push("污点入库：《" + (stain ? stain.name : effect.addStain) + "》");
    }
    if (effect.removeOne) {
      var removedCard = Game.removeFirstCardByIds(effect.removeOne);
      notes.push(removedCard ? "裁汰：《" + removedCard.name + "》" : "没有可裁汰的牌");
    }
    if (effect.upgradeOne) {
      var upgraded = Game.upgradeFirstCard(effect.upgradeOne);
      notes.push(upgraded ? "升格：《" + upgraded.from.name + "》→《" + upgraded.to.name + "》" : "没有可升格的旧牌");
    }
    notes = notes
      .concat(describeDeltas("", effect.resources || {}, mapResourceName))
      .concat(describeDeltas("", effect.fame || {}, mapFameName))
      .concat(describeDeltas("", effect.world || {}, mapWorldName));
    Game.boundState();
    return notes;
  }

  function getMode(card, modeId) {
    if (!card.modes || !card.modes.length) return null;
    return card.modes.find(function (mode) { return mode.id === modeId; }) || card.modes[0];
  }

  function effectiveCost(card, modeId) {
    var mode = getMode(card, modeId);
    var cost = Object.assign({}, card.cost || {}, mode && mode.cost ? mode.cost : {});
    if ((Game.state.tagUse.圆滑 || 0) >= 5 && (cardHasAnyTag(card, ["圆滑", "人情"]) || card.type === "人情") && cost.favor > 0) {
      cost.favor = Math.max(0, cost.favor - 1);
    }
    return cost;
  }

  function mergeEffect(base, extra) {
    var result = Game.Util.deepClone(base || {});
    Object.keys(extra || {}).forEach(function (key) {
      if (["tracks", "resources", "fame", "world", "tags"].indexOf(key) >= 0) {
        result[key] = result[key] || {};
        applyDeltaBag(result[key], extra[key]);
      } else if (key === "relations") {
        result.relations = result.relations || {};
        Object.keys(extra.relations || {}).forEach(function (personId) {
          result.relations[personId] = result.relations[personId] || {};
          applyDeltaBag(result.relations[personId], extra.relations[personId]);
        });
      } else {
        result[key] = extra[key];
      }
    });
    return result;
  }

  function cardHasAnyTag(card, tags) {
    var cardTags = card.tags || [];
    return tags.some(function (tag) { return cardTags.indexOf(tag) >= 0; });
  }

  function bestTrackByNames(event, names) {
    if (!event) return null;
    var exact = names.map(function (name) {
      return event.tracks[name] ? { name: name, value: event.tracks[name].value } : null;
    }).filter(Boolean).sort(function (a, b) { return b.value - a.value; });
    if (exact.length) return exact[0].name;
    var critical = (event.criticalTracks || []).map(function (name) {
      return event.tracks[name] ? { name: name, value: event.tracks[name].value } : null;
    }).filter(Boolean).sort(function (a, b) { return b.value - a.value; });
    return critical.length ? critical[0].name : null;
  }

  function applyMasteryTrack(event, trackName, amount, label, notes) {
    if (!event || !trackName || !event.tracks[trackName]) return;
    var before = event.tracks[trackName].value;
    event.tracks[trackName].value = Game.Util.clamp(before + amount, 0, event.tracks[trackName].max + 5);
    if (event.tracks[trackName].value !== before) {
      notes.push(label + "：" + trackName + " " + (event.tracks[trackName].value - before));
    }
  }

  function applyStyleMastery(card, notes) {
    var s = Game.state;
    var event = s.currentEvent;
    if (!event) return;
    if ((s.tagUse.清流 || 0) >= 6 && cardHasAnyTag(card, ["清流", "清议"])) {
      applyMasteryTrack(event, bestTrackByNames(event, ["清议沸腾", "流言滋生", "文名不足"]), -1, "清流成势", notes);
      s.relations.emperor.suspicion += 1;
      notes.push("清名刺眼：皇帝猜忌 +1");
    }
    if ((s.tagUse.能吏 || 0) >= 6 && (cardHasAnyTag(card, ["能吏", "政务", "证据", "法度"]) || card.domain === "政务" || card.domain === "法度")) {
      applyMasteryTrack(event, bestTrackByNames(event, []), -1, "成例熟手", notes);
      s.resources.pressure += 1;
      notes.push("案牍压身：压力 +1");
    }
    if ((s.tagUse.权谋 || 0) >= 5 && cardHasAnyTag(card, ["权谋"])) {
      applyMasteryTrack(event, bestTrackByNames(event, ["政敌反扑", "朋党反扑", "派系阻挠", "上意不明"]), -1, "暗线成网", notes);
      s.resources.pressure += 1;
      notes.push("疑惧入心：压力 +1");
    }
    if ((s.tagUse.仁政 || 0) >= 5 && cardHasAnyTag(card, ["仁政"])) {
      s.world.publicMood += 1;
      s.world.fiscalHealth -= 1;
      notes.push("民望转高：民心 +1；财政健康 -1");
    }
    if ((s.tagUse.圆滑 || 0) >= 5 && cardHasAnyTag(card, ["圆滑", "人情"]) && s.relations.rival.resentment > 0) {
      s.relations.rival.resentment -= 1;
      notes.push("留足台阶：政敌怨恨 -1");
    }
  }

  function effectPreview(card, modeId) {
    var event = Game.state.currentEvent;
    var mode = getMode(card, modeId);
    var effect = Game.Util.deepClone(mode ? (mode.effect || card.effect || {}) : (card.effect || {}));
    (mode && mode.bonusIf || card.bonusIf || []).forEach(function (bonus) {
      if (event && event.flags && event.flags[bonus.flag]) {
        effect = mergeEffect(effect, bonus.effect || {});
      }
    });
    var lines = [];
    Object.keys(effect.tracks || {}).forEach(function (track) {
      lines.push(track + " " + (effect.tracks[track] > 0 ? "+" : "") + effect.tracks[track]);
    });
    lines = lines
      .concat(describeDeltas("", effect.resources || {}, mapResourceName))
      .concat(describeDeltas("", effect.fame || {}, mapFameName))
      .concat(describeDeltas("", effect.world || {}, mapWorldName));
    Object.keys(effect.relations || {}).forEach(function (id) {
      lines = lines.concat(describeDeltas(relationName(id) + "·", effect.relations[id], relationMetricName));
    });
    if (effect.addStain) lines.push("污点入库：《" + cardName(effect.addStain) + "》");
    if (effect.addCard) lines.push("新牌：《" + cardName(effect.addCard) + "》");
    return lines.slice(0, 7);
  }

  function applyTrackDeltas(card, effect, notes) {
    var s = Game.state;
    var event = s.currentEvent;
    Object.keys(effect.tracks || {}).forEach(function (track) {
      if (!event || !event.tracks[track]) return;
      var before = event.tracks[track].value;
      var delta = effect.tracks[track];
      if (card.domain === "政务" && s.contacts.indexOf("adviser") >= 0 && delta < 0) delta -= 1;
      event.tracks[track].value = Game.Util.clamp(before + delta, 0, event.tracks[track].max + 5);
      if (event.tracks[track].value !== before) {
        notes.push(track + " " + (event.tracks[track].value - before));
      }
    });
  }

  function applyFailureHook(trackName, hook, notes) {
    var s = Game.state;
    if (!hook) return;
    applyDeltaBag(s.resources, hook.resources || {});
    applyDeltaBag(s.fame, hook.fame || {});
    applyDeltaBag(s.world, hook.world || {});
    applyRelations(hook.relations || {});
    if (hook.addStain) Game.addNegativeCard(hook.addStain);
    notes.push(hook.text || (trackName + "留下后患。"));
  }

  function applyEffect(card, modeId) {
    var s = Game.state;
    var event = s.currentEvent;
    var mode = getMode(card, modeId);
    var effect = Game.Util.deepClone(mode ? (mode.effect || card.effect || {}) : (card.effect || {}));
    var notes = [];

    (mode && mode.bonusIf || card.bonusIf || []).forEach(function (bonus) {
      if (event && event.flags && event.flags[bonus.flag]) {
        effect = mergeEffect(effect, bonus.effect || {});
        notes.push("连招：" + (bonus.text || bonus.flag));
      }
    });

    applyTrackDeltas(card, effect, notes);
    applyDeltaBag(s.resources, effect.resources || {});
    applyDeltaBag(s.fame, effect.fame || {});
    applyDeltaBag(s.world, effect.world || {});
    applyRelations(effect.relations || {});

    Object.keys(effect.tags || {}).forEach(function (tag) {
      s.tagUse[tag] = (s.tagUse[tag] || 0) + effect.tags[tag];
    });
    applyStyleMastery(card, notes);

    if (effect.addStain) {
      Game.addNegativeCard(effect.addStain);
      notes.push("污点入库：" + Game.cardById(effect.addStain).name);
    }

    var flags = Object.assign({}, card.setFlags || {}, mode && mode.setFlags ? mode.setFlags : {});
    Object.keys(flags).forEach(function (flag) {
      if (!event) return;
      event.flags[flag] = (event.flags[flag] || 0) + flags[flag];
      notes.push("前置：" + flag);
    });

    notes = notes
      .concat(describeDeltas("", effect.resources || {}, mapResourceName))
      .concat(describeDeltas("", effect.fame || {}, mapFameName))
      .concat(describeDeltas("", effect.world || {}, mapWorldName));

    if (effect.dead) notes.push("这张负面牌被暂时处理。");
    if (event) event.played.push(card.name + (mode ? "·" + mode.name : ""));
    Game.boundState();
    return notes;
  }

  function canPay(card, modeId) {
    var s = Game.state;
    if (card.id === "medical_rest" && (s.resources.pressure || 0) <= 0) return false;
    if (card.modes && !modeId) {
      return card.modes.some(function (mode) { return canPay(card, mode.id); });
    }
    var cost = effectiveCost(card, modeId);
    if ((cost.energy || 0) > s.resources.energy) return false;
    if ((cost.money || 0) > s.resources.money) return false;
    if ((cost.favor || 0) > s.resources.favor) return false;
    return true;
  }

  function payCost(card, modeId) {
    var s = Game.state;
    var cost = effectiveCost(card, modeId);
    s.resources.energy -= cost.energy || 0;
    s.resources.money -= cost.money || 0;
    s.resources.favor -= cost.favor || 0;
    s.resources.pressure += cost.pressure || 0;
  }

  function applyReactionDelta(event, add) {
    var notes = [];
    Object.keys(add || {}).forEach(function (track) {
      if (!event.tracks[track]) {
        event.tracks[track] = { value: 0, max: Math.max(4, add[track] + 2) };
      }
      var before = event.tracks[track].value;
      event.tracks[track].value = Game.Util.clamp(before + add[track], 0, event.tracks[track].max + 5);
      if (event.tracks[track].value !== before) notes.push(track + " +" + (event.tracks[track].value - before));
    });
    return notes;
  }

  function computeThreatGain(card, modeId) {
    var mode = getMode(card, modeId);
    var tags = card.tags || [];
    var risk = (card.reactionRisk || 0) + (mode && mode.reactionRisk || 0);
    var noisy = tags.some(function (tag) {
      return ["权谋", "污点", "酷吏", "贪腐"].indexOf(tag) >= 0;
    });
    var quiet = tags.some(function (tag) {
      return ["圆滑", "仁政", "休养"].indexOf(tag) >= 0;
    });
    var flags = Object.assign({}, card.setFlags || {}, mode && mode.setFlags ? mode.setFlags : {});
    var gain = 1 + risk + (noisy ? 1 : 0) - (quiet ? 1 : 0);
    if (flags.careful_tone || flags.room_to_turn || flags.cooled_down) gain -= 1;
    return Math.max(0, gain);
  }

  function triggerReaction(card, modeId) {
    var s = Game.state;
    var event = s.currentEvent;
    if (!event) return;
    event.threatMax = event.threatMax || 3;
    var gain = computeThreatGain(card, modeId);
    event.threat = Game.Util.clamp((event.threat || 0) + gain, 0, event.threatMax + 4);
    event.lastThreatGain = gain;
    if (gain > 0) {
      Game.addLog("暗流威胁 +" + gain + "（" + event.threat + "/" + event.threatMax + "）。");
    }
    if (event.threat < event.threatMax) return;
    event.threat = Math.max(0, event.threat - event.threatMax);

    var candidates = (event.reactions || []).filter(function (reaction) {
      return event.tracks[reaction.source] && event.tracks[reaction.source].value > 0;
    }).sort(function (a, b) {
      return event.tracks[b.source].value - event.tracks[a.source].value;
    });
    if (!candidates.length) {
      Game.addLog("暗流已满，却无人能借势反扑。");
      return;
    }
    var reaction = candidates[0];
    var notes = applyReactionDelta(event, reaction.add);
    if (notes.length) {
      event.reactionCount += 1;
      Game.addLog("反制：" + reaction.text + "（" + notes.join("；") + "）");
    }
  }

  function postEventWorldDrift(success) {
    var s = Game.state;
    if (success) {
      s.fame.competence += 1;
      s.world.courtPressure -= 1;
      s.resources.money += s.year <= 4 ? 0 : 1;
    } else {
      s.resources.pressure += 1;
      s.world.courtPressure += 1;
      s.relations.rival.resentment += 1;
      if (s.currentEvent && s.currentEvent.name.indexOf("亏空") >= 0) {
        Game.addNegativeCard("conceal_deficit");
      }
    }
  }

  function applyUnresolvedConsequences(event, success) {
    var notes = [];
    unresolvedTracks(event, success).forEach(function (trackName) {
      applyFailureHook(trackName, event.failureHooks[trackName], notes);
    });
    return notes;
  }

  function effectForResult(event, result) {
    if (result.success) return event.successEffect || {};
    if (result.partial) return event.partialEffect || {};
    return event.failEffect || {};
  }

  function applyOutcomeEffect(effect, notes) {
    var s = Game.state;
    effect = effect || {};
    changeMerit(effect.merit || 0, notes);
    applyDeltaBag(s.resources, effect.resources || {});
    applyDeltaBag(s.fame, effect.fame || {});
    applyDeltaBag(s.world, effect.world || {});
    applyRelations(effect.relations || {});
    applyNpcDeltas(effect.npcs || {}, notes);
    if (effect.flags) {
      s.flags = s.flags || {};
      applyDeltaBag(s.flags, effect.flags);
    }
    if (effect.addStain) {
      Game.addNegativeCard(effect.addStain);
      var card = Game.cardById(effect.addStain);
      notes.push("污点入库：" + (card ? card.name : effect.addStain));
    }
    if (effect.addCard) {
      var added = Game.addCardToDiscard(effect.addCard);
      if (added) notes.push("人情牌入库：《" + added.name + "》");
    }
    if (effect.demote) {
      demoteCareer("君前疑忌与案牍失据", notes);
    }
    notes = notes
      .concat(describeDeltas("", effect.resources || {}, mapResourceName))
      .concat(describeDeltas("", effect.fame || {}, mapFameName))
      .concat(describeDeltas("", effect.world || {}, mapWorldName));
  }

  function resultMeritDelta(result) {
    if (result.success) return 5;
    if (result.partial) return 2;
    return -1;
  }

  function shouldTriggerFatal(event, result) {
    var s = Game.state;
    var emperor = s.relations.emperor || {};
    return event.fatalOnFail === "framed_execution" &&
      s.year >= 10 &&
      s.career.officeId === "censor" &&
      result.level === "fail" &&
      s.relations.rival.resentment >= 16 &&
      (s.world.emperorTrust <= 3 || emperor.suspicion >= 15);
  }

  function finishForcedEnding(endingId, reason) {
    var s = Game.state;
    var ending = GameData.endings.find(function (item) { return item.id === endingId; }) || GameData.endings[GameData.endings.length - 1];
    s.ended = true;
    s.currentEvent = null;
    s.pendingReward = null;
    s.pendingSummary = null;
    s.flags.forcedEnding = endingId;
    recordCareer("forced_end", reason);
    s.ending = {
      title: ending.title,
      text: ending.text
    };
    Game.addLog("仕途骤断：" + ending.title + "。" + reason);
    pushStoryBeat("fail", ending.title, reason);
  }

  function cloneNumberBag(source) {
    var result = {};
    Object.keys(source || {}).forEach(function (key) {
      if (typeof source[key] === "number") result[key] = source[key];
    });
    return result;
  }

  function cloneNestedNumberBag(source) {
    var result = {};
    Object.keys(source || {}).forEach(function (key) {
      result[key] = cloneNumberBag(source[key]);
    });
    return result;
  }

  function cardCounts(state) {
    var counts = {};
    []
      .concat(state.deck || [])
      .concat(state.hand || [])
      .concat(state.discard || [])
      .concat(state.sealed || [])
      .forEach(function (card) {
        counts[card.id] = (counts[card.id] || 0) + 1;
      });
    return counts;
  }

  function stainCounts(state) {
    var counts = {};
    (state.stains || []).forEach(function (id) {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  function snapshotSeasonState() {
    var s = Game.state;
    return {
      resources: cloneNumberBag(s.resources),
      fame: cloneNumberBag(s.fame),
      world: cloneNumberBag(s.world),
      relations: cloneNestedNumberBag(s.relations),
      npcs: cloneNestedNumberBag(s.npcs),
      career: {
        merit: s.career ? s.career.merit || 0 : 0,
        officeId: s.career ? s.career.officeId : Game.getOffice().id,
        rankName: s.career ? s.career.rankName : Game.getOffice().rankName
      },
      cards: cardCounts(s),
      stains: stainCounts(s)
    };
  }

  function pushDiff(items, label, before, after, extra) {
    if (before === after) return;
    items.push(Object.assign({
      label: label,
      before: before,
      after: after,
      delta: after - before,
      direction: after > before ? "up" : "down"
    }, extra || {}));
  }

  function diffBag(before, after, mapper) {
    var keys = {};
    Object.keys(before || {}).forEach(function (key) { keys[key] = true; });
    Object.keys(after || {}).forEach(function (key) { keys[key] = true; });
    return Object.keys(keys).map(function (key) {
      var oldValue = before[key] || 0;
      var newValue = after[key] || 0;
      if (oldValue === newValue) return null;
      return {
        label: mapper ? mapper(key) : key,
        before: oldValue,
        after: newValue,
        delta: newValue - oldValue,
        direction: newValue > oldValue ? "up" : "down"
      };
    }).filter(Boolean);
  }

  function relationMetricName(key) {
    return {
      trust: "信任",
      suspicion: "猜忌",
      closeness: "亲近",
      debt: "亏欠",
      resentment: "怨恨",
      fear: "畏惧"
    }[key] || key;
  }

  function relationName(id) {
    var person = GameData.people.find(function (item) { return item.id === id; });
    return person ? person.name : id;
  }

  function diffRelations(before, after) {
    var rows = [];
    var ids = {};
    Object.keys(before || {}).forEach(function (id) { ids[id] = true; });
    Object.keys(after || {}).forEach(function (id) { ids[id] = true; });
    Object.keys(ids).forEach(function (id) {
      diffBag(before[id] || {}, after[id] || {}, relationMetricName).forEach(function (item) {
        item.label = relationName(id) + "·" + item.label;
        rows.push(item);
      });
    });
    return rows;
  }

  function npcMetricName(key) {
    return { bond: "羁绊", trust: "信任", debt: "亏欠", resentment: "怨恨" }[key] || key;
  }

  function npcStoryForChange(def, changes) {
    var resentment = changes.find(function (item) { return item.key === "resentment"; });
    var debt = changes.find(function (item) { return item.key === "debt"; });
    var bond = changes.find(function (item) { return item.key === "bond" || item.key === "trust"; });
    if (resentment && resentment.delta > 0) return def.name + "把这笔账记在礼数后面，往后同类事务会更难绕开他。";
    if (debt && debt.delta > 0) return "你与" + def.name + "的人情债更深了；此债能开门，也会在某天被讨回。";
    if (debt && debt.delta < 0) return "欠" + def.name + "的一笔旧账稍稍抹平，话虽未说透，账册上已轻了一行。";
    if (bond && bond.delta > 0) return def.name + "愿意把你当作可托之人，至少下一次风声会来得早些。";
    return def.name + "的态度有了细小挪移，尚未成局，却足以入账。";
  }

  function diffNpcs(before, after) {
    var rows = [];
    (GameData.npcs || []).forEach(function (def) {
      var oldState = before[def.id] || {};
      var newState = after[def.id] || {};
      var changes = ["bond", "trust", "debt", "resentment"].map(function (key) {
        var oldValue = oldState[key] || 0;
        var newValue = newState[key] || 0;
        if (oldValue === newValue) return null;
        return {
          key: key,
          label: npcMetricName(key),
          before: oldValue,
          after: newValue,
          delta: newValue - oldValue,
          direction: newValue > oldValue ? "up" : "down"
        };
      }).filter(Boolean);
      if (!changes.length) return;
      rows.push({
        id: def.id,
        name: def.name,
        role: def.role,
        group: relationName(def.group),
        changes: changes,
        text: npcStoryForChange(def, changes)
      });
    });
    rows.sort(function (a, b) {
      var aPower = Math.max.apply(null, a.changes.map(function (item) { return Math.abs(item.delta); }));
      var bPower = Math.max.apply(null, b.changes.map(function (item) { return Math.abs(item.delta); }));
      return bPower - aPower;
    });
    return rows;
  }

  function diffCards(before, after, stainOnly) {
    var ids = {};
    Object.keys(before || {}).forEach(function (id) { ids[id] = true; });
    Object.keys(after || {}).forEach(function (id) { ids[id] = true; });
    return Object.keys(ids).map(function (id) {
      var oldValue = before[id] || 0;
      var newValue = after[id] || 0;
      if (oldValue === newValue) return null;
      var card = Game.cardById(id);
      return {
        id: id,
        label: card ? card.name : id,
        type: stainOnly ? "污点" : card ? card.type : "牌",
        before: oldValue,
        after: newValue,
        delta: newValue - oldValue,
        direction: newValue > oldValue ? "up" : "down"
      };
    }).filter(Boolean);
  }

  function buildTrackSummary(event, result) {
    return {
      critical: (event.criticalTracks || []).map(function (name) {
        var track = event.tracks[name];
        return {
          name: name,
          value: track ? track.value : 0,
          max: track ? track.max : 0,
          safe: !track || track.value <= CRITICAL_SAFE
        };
      }),
      blocked: result.blocked || [],
      unresolved: result.unresolved || []
    };
  }

  function applyAutoAftermath(result, notes) {
    var s = Game.state;
    var growth = [];
    if (result.success) {
      var draftId = pickDraftCard(result);
      var card = Game.cardById(draftId);
      var successEffect = { addCard: draftId, resources: {} };
      if (s.resources.pressure > 0) successEffect.resources.pressure = -1;
      growth.push("案子收得稳，系统自动纳入《" + (card ? card.name : draftId) + "》，并稍减压力。");
      var successNotes = applyRewardEffect(successEffect);
      notes.push("自动成长：" + successNotes.join("；"));
      return growth.concat(successNotes);
    }
    if (result.partial) {
      var option = styleRewardOption(dominantStyle());
      var partialEffect = Game.Util.deepClone(option.effect || {});
      if (s.resources.pressure > 0) partialEffect = mergeEffect(partialEffect, { resources: { pressure: -1 } });
      growth.push("此事虽不干净，却沉淀出一条做官路数：" + option.name + "。");
      var partialNotes = applyRewardEffect(partialEffect);
      notes.push("自动成长：" + option.name + (partialNotes.length ? "，" + partialNotes.join("；") : ""));
      return growth.concat(partialNotes);
    }
    growth.push("本季失手，未得新法；若有污点、人情或心病，皆按事件本身入账。");
    return growth;
  }

  function buildSeasonSummary(before, after, event, result, text, storyText, consequences, outcomeNotes, autoGrowth) {
    var summary = {
      eventName: event.name,
      level: result.level,
      title: result.title,
      resultText: text,
      story: storyText,
      played: event.played.slice(),
      trackSummary: buildTrackSummary(event, result),
      autoGrowth: autoGrowth || [],
      notes: outcomeNotes || [],
      consequences: consequences || [],
      baseline: before,
      rewardOptions: result.success || result.partial ? buildRewardOptions(result) : [],
      rewardChosen: null
    };
    refreshSummaryDiff(summary, before, after);
    return summary;
  }

  function refreshSummaryDiff(summary, before, after) {
    var careerItems = [];
    pushDiff(careerItems, "官评", before.career.merit || 0, after.career.merit || 0);
    if (before.career.officeId !== after.career.officeId || before.career.rankName !== after.career.rankName) {
      careerItems.push({
        label: "官职",
        beforeText: Game.getOfficeById(before.career.officeId).name,
        afterText: Game.getOfficeById(after.career.officeId).name,
        text: Game.getOfficeById(before.career.officeId).name + " → " + Game.getOfficeById(after.career.officeId).name
      });
    }

    var groups = [
      { title: "资源", items: diffBag(before.resources, after.resources, mapResourceName) },
      { title: "名声", items: diffBag(before.fame, after.fame, mapFameName) },
      { title: "朝局", items: diffBag(before.world, after.world, mapWorldName) },
      { title: "阵营关系", items: diffRelations(before.relations, after.relations) },
      { title: "仕途", items: careerItems }
    ].filter(function (group) { return group.items.length; });
    summary.deltaGroups = groups;
    summary.npcBeats = diffNpcs(before.npcs, after.npcs);
    summary.cardChanges = diffCards(before.cards, after.cards, false);
    summary.stainChanges = diffCards(before.stains, after.stains, true);
    return summary;
  }

  function resolveCurrentEvent() {
    var s = Game.state;
    var event = s.currentEvent;
    if (!event) return;
    var before = snapshotSeasonState();
    var result = evaluateEvent(event);
    var text;

    if (result.success) {
      text = event.success;
      postEventWorldDrift(true);
    } else if (result.partial) {
      text = "此事勉强收束，关键处虽未尽善，却没有立刻败坏。后续仍留余波。";
      s.fame.competence += 1;
    } else {
      var blocked = result.blocked;
      text = event.fail + (blocked.length ? " 关键阻力未解：" + blocked.join("、") + "。" : "");
      postEventWorldDrift(false);
    }

    var consequences = applyUnresolvedConsequences(event, result.success);
    if (consequences.length) text += " 后患：" + consequences.join(" ");

    if (s.stains.length >= 4 && Math.random() < 0.45) {
      s.world.factionHeat += 1;
      s.relations.rival.resentment += 1;
      text += " 旧日污点被人记下，政敌的动作更紧。";
    }

    var outcomeNotes = [];
    changeMerit(resultMeritDelta(result), outcomeNotes);
    applyOutcomeEffect(effectForResult(event, result), outcomeNotes);
    if (outcomeNotes.length) text += " 仕途结算：" + outcomeNotes.join("；") + "。";
    Game.boundState();
    refreshRelationWarnings();

    event.outcome = text;
    var storyText = makeOutcomeStory(event, result, consequences);
    var npcLine = npcOutcomeLine(event, result);
    if (npcLine) storyText += " " + npcLine;
    recordNpcOutcome(event, result);
    s.eventHistory.push(event.id);
    pushStoryBeat(result.level, event.name, storyText);
    Game.addLog(event.name + "：" + text + " 余波：" + storyText);
    Game.discardHand();
    if (shouldTriggerFatal(event, result)) {
      finishForcedEnding("old_case_prison", "旧案被政敌织成死局，君前疑忌已深，辩疏未入内阁便被封还。");
      Game.boundState();
      return;
    }
    var autoGrowth = [];
    Game.maybeAddPressureCard();
    promoteIfReady();
    Game.boundState();
    refreshRelationWarnings();
    var after = snapshotSeasonState();
    s.pendingSummary = buildSeasonSummary(before, after, event, result, text, storyText, consequences, outcomeNotes, autoGrowth);
    s.pendingReward = null;
    s.currentEvent = null;
    Game.boundState();
  }

  function resetQuarterResources() {
    var s = Game.state;
    var office = Game.getOffice();
    s.resources.energy = office.energy;
    if (s.resources.pressure >= 10) s.resources.energy -= 1;
    if (s.resources.pressure >= 15) s.resources.energy -= 1;
    s.resources.energy = Math.max(2, s.resources.energy);
    s.hasDrawn = false;
    s.preparedAction = null;
    s.selectedForExchange = [];
  }

  function advanceTime() {
    var s = Game.state;
    var prevOffice = Game.getOffice().id;
    s.seasonIndex += 1;
    if (s.seasonIndex >= GameData.seasons.length) {
      s.seasonIndex = 0;
      s.year += 1;
      s.age += 1;
      s.resources.money = Game.Util.clamp(s.resources.money + 1, 0, 12);
      s.resources.favor = Game.Util.clamp(s.resources.favor + 1, 0, 12);
      s.world.factionHeat += s.fame.power >= 8 ? 1 : 0;
    }
    if (s.year > 12) {
      Game.finishGame();
      return;
    }
    var newOffice = Game.getOffice().id;
    if (newOffice !== prevOffice) {
      Game.addOfficeCards(newOffice);
      var officeName = Game.getOffice().name;
      Game.addLog("转任" + officeName + "，新的职责与牌池已经展开。");
    }
    tickRelationCooldowns();
    tickNpcCooldowns();
    resetQuarterResources();
    Game.startEvent();
  }

  Game.startEvent = function () {
    var template = chooseEvent();
    Game.state.currentEvent = createEventInstance(template);
    Game.state.pendingReward = null;
    Game.state.pendingSummary = null;
    Game.state.hasDrawn = false;
    Game.state.preparedThisSeason = false;
    Game.state.preparedAction = null;
    Game.state.prepDrawBonus = 0;
    armRelationCooldown(Game.state.currentEvent);
    armNpcCooldown(Game.state.currentEvent);
    pushStoryBeat("hook", Game.state.currentEvent.name, Game.state.currentEvent.story.hook);
  };

  function takePreparedCard(predicate) {
    var s = Game.state;
    var zones = ["deck", "discard"];
    for (var i = 0; i < zones.length; i += 1) {
      var zone = zones[i];
      var index = s[zone].findIndex(predicate);
      if (index >= 0) return s[zone].splice(index, 1)[0];
    }
    return null;
  }

  function highestCriticalForPrepare(event) {
    return (event.criticalTracks || []).map(function (name) {
      return event.tracks[name] ? { name: name, value: event.tracks[name].value } : null;
    }).filter(Boolean).sort(function (a, b) { return b.value - a.value; })[0];
  }

  Game.getPrepareOptions = function () {
    var s = Game.state;
    var locked = s.ended || s.pendingSummary || s.pendingReward || !s.currentEvent || s.hasDrawn || s.preparedThisSeason;
    return [
      { id: "contact", name: "托人探路", desc: "人情 -1，检索一张人情/关系牌。", disabled: locked || s.resources.favor < 1 },
      { id: "evidence", name: "检旧档", desc: "银两 -1，检索一张法度/证据牌。", disabled: locked || s.resources.money < 1 },
      { id: "pressure_draw", name: "连夜筹画", desc: "压力 +2，本季多抽 1 张。", disabled: locked },
      { id: "focus", name: "先定要害", desc: "压低最高关键阻力 1 点。", disabled: locked }
    ];
  };

  Game.prepareForSeason = function (action) {
    var s = Game.state;
    var event = s.currentEvent;
    if (!event || s.pendingSummary || s.pendingReward || s.ended || s.hasDrawn || s.preparedThisSeason) return false;
    var card = null;
    if (action === "contact") {
      if (s.resources.favor < 1) return false;
      s.resources.favor -= 1;
      card = takePreparedCard(function (item) {
        return item.type === "人情" || item.type === "家族" || cardHasAnyTag(item, ["人情", "同年", "师门", "圆滑"]);
      });
      if (card) s.hand.push(card);
      Game.addLog(card ? "准备：托人探路，调来《" + card.name + "》。" : "准备：托人探路，却没有合适人情牌可调。");
    } else if (action === "evidence") {
      if (s.resources.money < 1) return false;
      s.resources.money -= 1;
      card = takePreparedCard(function (item) {
        return item.type === "法度" || cardHasAnyTag(item, ["证据", "法度"]);
      });
      if (card) s.hand.push(card);
      Game.addLog(card ? "准备：检旧档，调来《" + card.name + "》。" : "准备：检旧档，却没有合适证据牌可调。");
    } else if (action === "pressure_draw") {
      s.resources.pressure += 2;
      s.prepDrawBonus = (s.prepDrawBonus || 0) + 1;
      Game.addLog("准备：连夜筹画，本季抽牌 +1，压力 +2。");
    } else if (action === "focus") {
      var target = highestCriticalForPrepare(event);
      if (target && event.tracks[target.name]) {
        event.tracks[target.name].value = Math.max(0, event.tracks[target.name].value - 1);
        Game.addLog("准备：先定要害，" + target.name + " -1。");
      } else {
        Game.addLog("准备：先定要害，但本季没有明确关键阻力。");
      }
    } else {
      return false;
    }
    s.preparedThisSeason = true;
    s.preparedAction = action;
    Game.boundState();
    refreshRelationWarnings();
    return true;
  };

  Game.getDominantStyle = dominantStyle;

  Game.getStylePerks = function () {
    var tagUse = Game.state.tagUse || {};
    return [
      { tag: "圆滑", threshold: 5, text: "人情/圆滑牌人情费用 -1，出牌时缓和政敌怨恨。" },
      { tag: "清流", threshold: 6, text: "清流/清议牌额外压一处舆论阻力，但皇帝猜忌 +1。" },
      { tag: "能吏", threshold: 6, text: "政务/法度牌额外压最高关键阻力，压力 +1。" },
      { tag: "权谋", threshold: 5, text: "权谋牌额外处理反扑或上意，压力 +1。" },
      { tag: "仁政", threshold: 5, text: "仁政牌民心 +1，但财政健康 -1。" }
    ].map(function (perk) {
      perk.value = tagUse[perk.tag] || 0;
      perk.active = perk.value >= perk.threshold;
      return perk;
    });
  };

  Game.getCareerProgress = function () {
    var s = Game.state;
    var office = Game.getOffice();
    return {
      office: office,
      merit: s.career ? s.career.merit : 0,
      threshold: office.promotionMerit,
      nextOffice: office.nextOfficeId ? Game.getOfficeById(office.nextOfficeId) : null,
      rankName: s.career ? s.career.rankName : office.rankName || office.name
    };
  };

  Game.getRelationBadges = function (personId) {
    refreshRelationWarnings();
    return (Game.state.relationWarnings && Game.state.relationWarnings[personId]) || [];
  };

  Game.getNpcById = function (id) {
    var def = npcDefById(id);
    return def ? { def: def, state: npcState(id) } : null;
  };

  Game.getVisibleNpcs = function () {
    return (GameData.npcs || []).map(function (def) {
      var state = npcState(def.id);
      var inOffice = npcIsInCurrentOffice(def);
      var heat = Math.max(state.bond || 0, state.trust || 0, state.debt || 0, state.resentment || 0);
      return { def: def, state: state, inOffice: inOffice, heat: heat };
    }).filter(function (item) {
      return item.inOffice || item.state.met || item.heat >= 4;
    }).sort(function (a, b) {
      if (a.inOffice !== b.inOffice) return a.inOffice ? -1 : 1;
      if ((a.state.resentment >= 6) !== (b.state.resentment >= 6)) return a.state.resentment >= 6 ? -1 : 1;
      if ((a.state.debt >= 5) !== (b.state.debt >= 5)) return a.state.debt >= 5 ? -1 : 1;
      return b.heat - a.heat;
    }).slice(0, 8);
  };

  Game.previewCurrentEventOutcome = function () {
    if (!Game.state.currentEvent) return null;
    return evaluateEvent(Game.state.currentEvent);
  };

  Game.getCardModes = function (card) {
    return card.modes || [];
  };

  Game.getCardModeCost = effectiveCost;

  Game.getCardThreat = computeThreatGain;

  Game.getCardModePreview = effectPreview;

  Game.getCardHints = function (card) {
    var hints = [];
    var event = Game.state.currentEvent;
    (card.modes || []).forEach(function (mode) {
      (mode.bonusIf || []).forEach(function (bonus) {
        hints.push((event && event.flags && event.flags[bonus.flag] ? "可触发：" : "连招：") + (bonus.text || bonus.flag));
      });
      hints.push(mode.name + " 威胁 +" + computeThreatGain(card, mode.id));
    });
    if (!card.modes || !card.modes.length) hints.push("威胁 +" + computeThreatGain(card));
    return hints.slice(0, 3);
  };

  Game.playCard = function (instanceId, modeId) {
    if (Game.state.pendingReward || Game.state.pendingSummary || Game.state.ended || !Game.state.currentEvent) return false;
    var card = Game.state.hand.find(function (item) { return item.instanceId === instanceId; });
    if (!card) return false;
    if (card.modes && !modeId) modeId = card.modes[0].id;
    if (!canPay(card, modeId)) return false;
    card = Game.removeFromHand(instanceId);
    payCost(card, modeId);
    var notes = applyEffect(card, modeId);
    if (Game.state.currentEvent) Game.state.currentEvent.playCount += 1;
    Game.discardCard(card);
    Game.addLog("使用《" + card.name + "》：" + (notes.length ? notes.join("；") : "局势微动。"));
    triggerReaction(card, modeId);
    Game.boundState();
    refreshRelationWarnings();
    return true;
  };

  Game.canPlayCard = canPay;

  Game.keepCard = function (instanceId) {
    var s = Game.state;
    if (s.pendingReward || s.pendingSummary || s.ended) return false;
    if (s.keptCard) return false;
    var card = Game.removeFromHand(instanceId);
    if (!card) return false;
    s.keptCard = card;
    s.selectedForExchange = (s.selectedForExchange || []).filter(function (id) { return id !== instanceId; });
    Game.addLog("保留《" + card.name + "》，下季仍可使用。");
    return true;
  };

  Game.toggleExchangeCard = function (instanceId) {
    var s = Game.state;
    if (s.pendingReward || s.pendingSummary || s.ended) return false;
    s.selectedForExchange = s.selectedForExchange || [];
    var index = s.selectedForExchange.indexOf(instanceId);
    if (index >= 0) {
      s.selectedForExchange.splice(index, 1);
      return true;
    }
    if (s.selectedForExchange.length >= 2) return false;
    if (!s.hand.some(function (card) { return card.instanceId === instanceId; })) return false;
    s.selectedForExchange.push(instanceId);
    return true;
  };

  Game.discardForResource = function (resource) {
    var s = Game.state;
    if (s.pendingReward || s.pendingSummary || s.ended) return false;
    if (["energy", "money", "favor"].indexOf(resource) < 0) return false;
    if (!s.selectedForExchange || s.selectedForExchange.length !== 2) return false;
    var discarded = [];
    s.selectedForExchange.slice().forEach(function (instanceId) {
      var card = Game.removeFromHand(instanceId);
      if (card) {
        discarded.push(card.name);
        Game.discardCard(card);
      }
    });
    s.selectedForExchange = [];
    if (discarded.length !== 2) return false;
    s.resources[resource] += 1;
    Game.boundState();
    Game.addLog("弃换资源：" + discarded.join("、") + " 换得" + mapResourceName(resource) + " +1。");
    return true;
  };

  Game.endQuarter = function () {
    if (Game.state.pendingReward || Game.state.pendingSummary || Game.state.ended) return false;
    resolveCurrentEvent();
    return true;
  };

  Game.continueAfterSummary = function () {
    var s = Game.state;
    if (!s.pendingSummary || s.ended) return false;
    if (s.pendingSummary.rewardOptions && s.pendingSummary.rewardOptions.length && !s.pendingSummary.rewardChosen) return false;
    if (s.pendingOfficeDraft) return false;
    var name = s.pendingSummary.eventName || "本季事务";
    s.pendingSummary = null;
    s.pendingReward = null;
    Game.addLog("本季总结已阅：《" + name + "》入档，转入下一季。");
    advanceTime();
    Game.boundState();
    refreshRelationWarnings();
    return true;
  };

  Game.selectReward = function (index) {
    var s = Game.state;
    var summary = s.pendingSummary;
    if (!summary || summary.rewardChosen || !summary.rewardOptions || !summary.rewardOptions[index]) return false;
    var option = summary.rewardOptions[index];
    var notes = applyRewardEffect(option.effect || {});
    summary.rewardChosen = {
      id: option.id,
      name: option.name,
      desc: option.desc,
      notes: notes
    };
    summary.autoGrowth = (summary.autoGrowth || []).concat(["仕途沉淀：" + option.name + (notes.length ? "，" + notes.join("；") : "")]);
    refreshSummaryDiff(summary, summary.baseline || snapshotSeasonState(), snapshotSeasonState());
    Game.addLog("仕途沉淀：" + option.name + "。");
    Game.boundState();
    refreshRelationWarnings();
    return true;
  };

  Game.selectOfficePackage = function (index) {
    if (!Game.chooseOfficePackage || !Game.chooseOfficePackage(index)) return false;
    var summary = Game.state.pendingSummary;
    if (summary) {
      refreshSummaryDiff(summary, summary.baseline || snapshotSeasonState(), snapshotSeasonState());
    }
    Game.boundState();
    return true;
  };

  Game.chooseReward = function () {
    var s = Game.state;
    if (s.pendingSummary) return Game.continueAfterSummary();
    if (!s.pendingReward) return false;
    s.pendingSummary = {
      legacy: true,
      eventName: s.pendingReward.eventName || "旧档结案",
      level: s.pendingReward.level || "partial",
      title: s.pendingReward.title || "旧档结案",
      resultText: s.pendingReward.text || "",
      story: s.pendingReward.story || "旧版结案状态已转为结案总结。",
      trackSummary: { critical: [], blocked: [], unresolved: [] },
      deltaGroups: [],
      npcBeats: [],
      cardChanges: [],
      stainChanges: [],
      autoGrowth: ["旧版结案状态已转换；进入下一季后按新版规则继续。"],
      notes: []
    };
    s.pendingReward = null;
    Game.boundState();
    return true;
  };

  Game.finishGame = function () {
    var s = Game.state;
    s.ended = true;
    s.currentEvent = null;
    var ending = GameData.endings.find(function (item) { return item.when(s); });
    s.ending = {
      title: ending.title,
      text: ending.text
    };
    Game.addLog("仕途终局：" + ending.title);
  };

  function splitParagraphText(text) {
    return String(text || "").split(/\n+/).map(function (line) {
      return line.trim();
    }).filter(Boolean);
  }

  function currentEndingForState(s) {
    if (s.ending) return s.ending;
    var ending = (GameData.endings || []).find(function (item) {
      try {
        return item.when(s);
      } catch (err) {
        return false;
      }
    });
    return ending || { title: "仕途未终", text: "案卷仍在案头，身后评语尚未落笔。" };
  }

  function strongestFameMetric(s) {
    return [
      ["清名", s.fame.clean, "名节自持，遇利多能止步"],
      ["能名", s.fame.competence, "长于案牍钱粮，能把乱局拆成可办之事"],
      ["文名", s.fame.literary, "以文字、经义和奏疏见称"],
      ["权名", s.fame.power, "善用门路、密折和朝中暗线"],
      ["酷名", s.fame.cruel, "手段峻急，能慑人也易伤人"],
      ["贪名", s.fame.corruption, "灰色交易留痕，清议难为其洗净"]
    ].sort(function (a, b) { return b[1] - a[1]; })[0];
  }

  function npcTone(state) {
    if ((state.resentment || 0) >= 6) return "结怨";
    if ((state.debt || 0) >= 5) return "牵连";
    if ((state.bond || 0) >= 5 || (state.trust || 0) >= 5) return "相助";
    return "相识";
  }

  function npcHighlights(limit) {
    return (GameData.npcs || []).map(function (def) {
      var state = npcState(def.id);
      var heat = Math.max(state.bond || 0, state.trust || 0, state.debt || 0, state.resentment || 0);
      return { def: def, state: state, heat: heat };
    }).filter(function (item) {
      return item.state.met || item.heat >= 4;
    }).sort(function (a, b) {
      return b.heat - a.heat;
    }).slice(0, limit || 5);
  }

  function buildCareerNarrative(s) {
    var office = Game.getOffice();
    var history = s.career && s.career.history || [];
    if (!history.length) {
      return "其人二十四岁入仕，现仍居" + (office.rankName || office.name) + "，官评" + ((s.career && s.career.merit) || 0) + "。履历尚未大转，真正能够定其一生轻重的案卷仍在前方。";
    }
    var entries = history.slice(-4).map(function (entry) {
      return entry.time + "，" + entry.text;
    }).join("；");
    return "履历可考者，近事有：" + entries + "。这些升迁、降调或骤断之笔，使他的仕途不再只是年表，而成了一串能互相解释的因果。";
  }

  function buildFameNarrative(s) {
    var fame = strongestFameMetric(s);
    var stainText = s.stains.length ? "污点入档" + s.stains.length + "处，较重者为" + s.stains.slice(-3).map(cardName).join("、") + "。" : "暂未有污点足以单独成案。";
    return "综其政声，最显者为" + fame[0] + "（" + fame[1] + "）：可谓" + fame[2] + "。清名" + s.fame.clean + "、能名" + s.fame.competence + "、文名" + s.fame.literary + "、权名" + s.fame.power + "、酷名" + s.fame.cruel + "、贪名" + s.fame.corruption + "并列案后，" + stainText;
  }

  function buildPeopleNarrative() {
    var people = npcHighlights(4);
    if (!people.length) return "其仕途尚未与具名人物结成深线，所遇多为泛泛官场人情；这使他暂少牵连，也少了可被后人反复书写的私交。";
    return "人物牵连中，" + people.map(function (item) {
      var state = item.state;
      var latest = state.history && state.history.length ? "，近事为" + state.history[state.history.length - 1].text : "";
      return item.def.name + "（" + item.def.role + "，" + npcTone(state) + latest + "）";
    }).join("；") + "。这些人有的递来台阶，有的藏着旧账，共同把传主从单纯官员写成有亲疏恩怨的人。";
  }

  function buildCaseNarrative(s) {
    var beats = (s.storyBeats || []).slice(0, 5).reverse();
    if (!beats.length) return "案卷纪年尚浅，只有几条寻常记事可供后来史笔取舍。";
    return "案卷纪年中较可入传者，有" + beats.map(function (beat) {
      var text = splitParagraphText(beat.text)[0] || "";
      return beat.time + "《" + beat.title + "》：" + text;
    }).join("；") + "。这些事件未必件件显赫，却能看出其人每一季如何被名声、压力与人情推着前行。";
  }

  Game.buildLifeNarrative = function () {
    var s = Game.state;
    var ending = currentEndingForState(s);
    var office = Game.getOffice();
    var style = dominantStyle();
    var paragraphs = [
      s.ended ? "终局既定，史笔以《" + ending.title + "》为题收束其一生。回看十二年仕途，他最后停在" + (office.rankName || office.name) + "，年" + s.age + "，官评" + ((s.career && s.career.merit) || 0) + "。" : "仕途未终，史笔尚未定稿。此时他居" + (office.rankName || office.name) + "，年" + s.age + "，官评" + ((s.career && s.career.merit) || 0) + "，为官方法暂以“" + style.tag + "”最显。",
      buildFameNarrative(s),
      buildCareerNarrative(s),
      buildPeopleNarrative(),
      buildCaseNarrative(s)
    ];
    if (s.ended) {
      paragraphs = paragraphs.concat(splitParagraphText(ending.text));
    } else {
      var projected = splitParagraphText(ending.text)[0];
      if (projected) paragraphs.push("若以此时功过预断，史笔或暂向《" + ending.title + "》倾斜：" + projected);
    }
    return compactParagraphs(paragraphs, 10);
  };

  Game.exportBiography = function () {
    var s = Game.state;
    var lines = [];
    var ending = currentEndingForState(s);
    lines.push("《官场浮沉生平传》");
    lines.push("");
    lines.push("【传主总评】");
    Game.buildLifeNarrative().forEach(function (paragraph) {
      lines.push(paragraph);
      lines.push("");
    });
    lines.push("结局：" + (s.ended ? ending.title : "未完，暂拟" + ending.title));
    lines.push("");
    lines.push("【政声与局势】");
    lines.push("名声：清名" + s.fame.clean + "，能名" + s.fame.competence + "，文名" + s.fame.literary + "，权名" + s.fame.power + "，酷名" + s.fame.cruel + "，贪名" + s.fame.corruption);
    lines.push("朝局：皇帝信任" + s.world.emperorTrust + "，士林评价" + s.world.scholarOpinion + "，民心" + s.world.publicMood + "，财政健康" + s.world.fiscalHealth + "，朋党烈度" + s.world.factionHeat + "，朝局压力" + s.world.courtPressure);
    lines.push("仕途：现任" + Game.getOffice().name + "（" + (s.career ? s.career.rankName : Game.getOffice().rankName) + "），官评" + (s.career ? s.career.merit : 0));
    lines.push("污点：" + (s.stains.length ? s.stains.map(cardName).join("、") : "无"));
    lines.push("");
    lines.push("【仕途履历】");
    if (s.career && s.career.history && s.career.history.length) {
      s.career.history.forEach(function (entry) {
        lines.push("- " + entry.time + "：" + entry.text);
      });
    } else {
      lines.push("- 尚无升迁或清算记录。");
    }
    lines.push("");
    lines.push("【人物牵连】");
    var highlights = npcHighlights(6);
    if (highlights.length) {
      highlights.forEach(function (item) {
        var state = item.state;
        var latest = state.history && state.history.length ? "；近事：" + state.history[state.history.length - 1].text : "";
        lines.push("- " + item.def.name + "（" + item.def.role + "，" + npcTone(state) + "）：羁绊" + state.bond + "，信任" + state.trust + "，亏欠" + state.debt + "，怨恨" + state.resentment + latest);
      });
    } else {
      lines.push("- 尚无足以入传的人物牵连。");
    }
    lines.push("");
    lines.push("【案卷纪年】");
    (s.storyBeats || []).slice(0, 12).reverse().forEach(function (beat) {
      lines.push("- " + beat.time + "《" + beat.title + "》：" + splitParagraphText(beat.text).join(" / "));
    });
    lines.push("");
    lines.push("【生平记事】");
    s.log.slice().reverse().forEach(function (entry) {
      lines.push("- " + entry.time + "：" + entry.text);
    });
    if (s.ended) {
      lines.push("");
      lines.push("【身后评语】");
      splitParagraphText(ending.text).forEach(function (paragraph) {
        lines.push(paragraph);
      });
    }
    return lines.join("\n");
  };
})();
