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

  var activeView = "main";
  var deckFilter = "全部";
  var selectedDeckId = null;
  var selectedRelationId = "emperor";
  var summaryModalFor = null;

  var deckFilters = [
    { id: "全部", label: "全部" },
    { id: "清流", label: "清流" },
    { id: "能吏", label: "能吏" },
    { id: "圆滑", label: "圆滑" },
    { id: "权谋", label: "权谋" },
    { id: "仁政", label: "仁政" },
    { id: "污点", label: "污点" },
    { id: "心病", label: "心病" }
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

  function statBlock(label, value, max, reverse) {
    return '<div class="stat"><b>' + escapeHtml(label) + " " + value + '</b>' + bar(value, max || 20, reverse) + '</div>';
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

  function renderSeasonSummary(summary) {
    var summaryKey = [
      Game.state.year,
      Game.state.seasonIndex,
      summary.eventName || "",
      summary.title || ""
    ].join("|");
    summaryModalFor = summaryKey;
    var story = summary.story ? '<div class="story-box story-box--outcome"><b>余波</b><p>' + escapeHtml(summary.story) + '</p></div>' : "";
    showModal(
      '<div class="summary-panel summary--' + escapeHtml(summary.level || "partial") + '">' +
        '<div class="event-title-row"><h2>' + escapeHtml(summary.eventName) + '<span class="event-badge">本季总结</span></h2><div class="event-meta">结案：' + escapeHtml(summary.title || "") + '</div></div>' +
        '<p class="event-desc">' + escapeHtml(summary.resultText || "") + '</p>' +
        story +
        '<div class="summary-grid">' +
          '<section class="summary-section"><div class="panel-title">关键阻力与后患</div>' + renderTrackSummary(summary.trackSummary || {}) + '</section>' +
          '<section class="summary-section summary-section--wide"><div class="panel-title">数值变动</div>' + renderDeltaGroups(summary.deltaGroups || []) + '</section>' +
          '<section class="summary-section summary-section--wide"><div class="panel-title">NPC 人情账</div><div class="npc-ledger">' + renderNpcBeats(summary.npcBeats || []) + '</div></section>' +
          '<section class="summary-section"><div class="panel-title">牌库变化</div>' + renderChangeList(summary.cardChanges || [], "本季没有牌库变化。") + '</section>' +
          '<section class="summary-section"><div class="panel-title">污点与心病</div>' + renderChangeList(summary.stainChanges || [], "本季没有新增污点。") + '</section>' +
        '</div>' +
        '<div class="modal-actions summary-actions"><button id="summary-continue">进入下季</button></div>' +
      '</div>'
    );
    document.getElementById("summary-continue").addEventListener("click", function () {
      continueFromSummary();
    });
  }

  function continueFromSummary() {
    if (!Game.state || !Game.state.pendingSummary) {
      hideModal();
      return false;
    }
    Game.continueAfterSummary();
    summaryModalFor = null;
    el("modal").classList.add("hidden");
    if (!Game.state.ended) Game.drawCards(Game.getOffice().handLimit);
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
    var keys = Object.keys(cost || {});
    if (!keys.length) return '<span class="cost-chip cost--free" title="无费用">免</span>';
    return keys.map(function (key) {
      var item = map[key] || { label: key.slice(0, 1), title: key, cls: "cost--other" };
      return '<span class="cost-chip ' + item.cls + '" title="' + escapeHtml(item.title) + '">' +
        '<b>' + escapeHtml(item.label) + '</b><em>' + escapeHtml(cost[key]) + '</em>' +
        '</span>';
    }).join("");
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
      return statBlock(key, s.attributes[key], 10, false);
    }).join("");
    var resHtml = [
      statBlock("精力", s.resources.energy, 8, false),
      statBlock("银两", s.resources.money, 12, false),
      statBlock("人情", s.resources.favor, 12, false),
      statBlock("压力", s.resources.pressure, 20, true)
    ].join("");
    var fameHtml = [
      statBlock("清名", s.fame.clean, 20, false),
      statBlock("能名", s.fame.competence, 20, false),
      statBlock("文名", s.fame.literary, 20, false),
      statBlock("权名", s.fame.power, 20, false),
      statBlock("酷名", s.fame.cruel, 20, true),
      statBlock("贪名", s.fame.corruption, 20, true)
    ].join("");
    var tags = s.traits.concat(office.tags).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join("");
    var style = Game.getDominantStyle ? Game.getDominantStyle() : { tag: "未定", value: 0 };
    var styleHtml = '<div class="style-ribbon"><b>主导流派</b><span>' + escapeHtml(style.tag) + " " + style.value + '</span></div>';

    el("character-panel").innerHTML =
      '<div class="character-identity"><div class="character-portrait-slice" aria-hidden="true"></div><div><b>李燕之</b><span>籍贯：京兆府</span><span>性格：' + escapeHtml(s.traits.join("、")) + '</span><span>官职：' + escapeHtml(office.rankName || office.name) + '</span></div></div>' +
      '<div class="tags">' + tags + '</div>' +
      styleHtml +
      '<div class="section"><div class="panel-title">属性</div><div class="stat-grid">' + attrHtml + '</div></div>' +
      '<div class="section"><div class="panel-title">资源</div><div class="resource-grid">' + resHtml + '</div></div>' +
      '<div class="section"><div class="panel-title">名声</div><div class="resource-grid">' + fameHtml + '</div></div>' +
      '<div class="section"><div class="panel-title">污点</div><div class="tags">' + (s.stains.length ? s.stains.map(function (id) {
        var card = Game.cardById(id);
        return '<span class="tag">' + escapeHtml(card ? card.name : id) + '</span>';
      }).join("") : '<span class="muted">暂无</span>') + '</div></div>';
  }

  function renderEvent() {
    var event = Game.state.currentEvent;
    if (Game.state.ended) {
      el("event-panel").innerHTML = '<h2 class="ending-title">' + escapeHtml(Game.state.ending.title) + '</h2><p class="ending-text">' + escapeHtml(Game.state.ending.text) + '</p><div class="modal-actions"><button id="ending-export">导出生平摘要</button></div>';
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
    var storyHtml = '<div class="story-box">' +
      '<b>案前风声</b>' +
      '<p>' + escapeHtml(story.hook || "案卷压到灯下，尚未开封，局势已经有了重量。") + '</p>' +
      '<p>' + escapeHtml(story.stakes || "") + '</p>' +
      (story.privateNote ? '<p class="muted">' + escapeHtml(story.privateNote) + '</p>' : "") +
      '</div>';
    el("event-panel").innerHTML =
      '<div class="event-title-row"><h2>' + escapeHtml(event.name) + specialBadge + '</h2><div class="event-meta">关键阻力需压到 4 或以下<br>威胁满格触发反制' + relationMeta + '</div></div>' +
      '<p class="event-desc">' + escapeHtml(event.desc) + '</p>' +
      '<div class="tags">' + participantHtml + '</div>' +
      storyHtml +
      threatHtml +
      '<div class="section tracks">' + trackHtml + '</div>' +
      previewHtml +
      played;
  }

  function renderHand() {
    var s = Game.state;
    var locked = s.ended || !!s.pendingReward || !!s.pendingSummary;
    el("hand-hint").innerHTML = (s.pendingSummary ? "本季事务已结案，请阅读总结后进入下季。" : s.pendingReward ? "旧档结案状态已转换为总结。" : s.hasDrawn ? "选择卡牌处理当前事务。费用不足的牌会变暗。" : "本季尚未抽牌。") +
      ' <span class="cost-legend"><span>精=精力</span><span>银=银两</span><span>情=人情</span><span>压=压力</span></span>';
    el("draw-button").disabled = s.hasDrawn || locked;
    el("end-button").disabled = locked || !s.currentEvent;
    var selected = s.selectedForExchange || [];
    var exchangeReady = selected.length === 2;
    var exchangeBar = '<div class="exchange-bar">' +
      '<span>已选筹换：' + selected.length + '/2</span>' +
      '<button data-exchange-resource="energy" class="ghost-button" ' + (exchangeReady && !locked ? "" : "disabled") + '>换精力</button>' +
      '<button data-exchange-resource="money" class="ghost-button" ' + (exchangeReady && !locked ? "" : "disabled") + '>换银两</button>' +
      '<button data-exchange-resource="favor" class="ghost-button" ' + (exchangeReady && !locked ? "" : "disabled") + '>换人情</button>' +
      (s.keptCard ? '<span class="muted">已保留：《' + escapeHtml(s.keptCard.name) + '》</span>' : '<span class="muted">本季可保留 1 张牌到下季</span>') +
      '</div>';
    var html = s.hand.map(function (card) {
      var playable = !locked && Game.canPlayCard(card);
      var visual = cardVisual(card);
      var modes = Game.getCardModes ? Game.getCardModes(card) : [];
      var hints = Game.getCardHints ? Game.getCardHints(card) : [];
      var isSelected = selected.indexOf(card.instanceId) >= 0;
      var tags = (card.tags || []).slice(0, 4).map(function (tag) {
        return '<span class="tag">' + escapeHtml(tag) + '</span>';
      }).join("");
      var hintHtml = hints.length ? '<div class="card-hints">' + hints.map(function (hint) {
        return '<span>' + escapeHtml(hint) + '</span>';
      }).join("") + '</div>' : "";
      return '<article class="card ' + visual.cls + " " + (playable ? "card--playable" : "unplayable") + " " + (isSelected ? "card--selected" : "") + '">' +
        '<div class="card-header">' +
          '<div class="card-title-block">' +
            '<div class="card-type">' + escapeHtml(card.type) + " · " + escapeHtml(card.domain) + '</div>' +
            '<h3>' + escapeHtml(card.name) + '</h3>' +
          '</div>' +
          '<div class="card-costs" aria-label="费用">' + renderCostChips(card.cost) + '</div>' +
        '</div>' +
        '<div class="card-art" aria-hidden="true">' +
          '<span class="card-art-symbol">' + escapeHtml(visual.mark) + '</span>' +
          '<span class="card-art-stamp"></span>' +
        '</div>' +
        '<p class="card-desc">' + escapeHtml(card.desc) + '</p>' +
        hintHtml +
        '<div class="card-footer">' +
          '<div class="tags">' + tags + '</div>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button data-card="' + card.instanceId + '" ' + (playable ? "" : "disabled") + '>' + (modes.length ? "用法" : "打出") + '</button>' +
          '<button data-keep-card="' + card.instanceId + '" class="ghost-button" ' + (s.keptCard || locked ? "disabled" : "") + '>保留</button>' +
          '<button data-exchange-card="' + card.instanceId + '" class="ghost-button" ' + (locked ? "disabled" : "") + '>' + (isSelected ? "取消筹换" : "筹换") + '</button>' +
        '</div>' +
        '</article>';
    }).join("");
    el("hand-panel").innerHTML = exchangeBar + '<div class="cards">' + (html || '<p class="muted">手牌为空。点击抽牌开始处理本季事务。</p>') + '</div>';
    Array.prototype.forEach.call(document.querySelectorAll("[data-card]"), function (button) {
      button.addEventListener("click", function () {
        var instanceId = button.getAttribute("data-card");
        var card = Game.state.hand.find(function (item) { return item.instanceId === instanceId; });
        if (card && Game.getCardModes(card).length) {
          Game.UI.showModeChoice(instanceId);
        } else {
          Game.playCard(instanceId);
          Game.UI.render();
        }
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-keep-card]"), function (button) {
      button.addEventListener("click", function () {
        Game.keepCard(button.getAttribute("data-keep-card"));
        Game.UI.render();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-exchange-card]"), function (button) {
      button.addEventListener("click", function () {
        Game.toggleExchangeCard(button.getAttribute("data-exchange-card"));
        Game.UI.render();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-exchange-resource]"), function (button) {
      button.addEventListener("click", function () {
        Game.discardForResource(button.getAttribute("data-exchange-resource"));
        Game.UI.render();
      });
    });
  }

  function renderWorld() {
    var s = Game.state;
    var worldHtml = [
      statBlock("皇帝信任", s.world.emperorTrust, 20, false),
      statBlock("士林评价", s.world.scholarOpinion, 20, false),
      statBlock("民心", s.world.publicMood, 20, false),
      statBlock("财政健康", s.world.fiscalHealth, 20, false),
      statBlock("朋党烈度", s.world.factionHeat, 20, true),
      statBlock("朝局压力", s.world.courtPressure, 20, true)
    ].join("");
    var relations = GameData.people.map(function (person) {
      var rel = s.relations[person.id] || {};
      var bits = person.keys.map(function (key) {
        var name = { trust: "信任", suspicion: "猜忌", closeness: "亲近", debt: "亏欠", resentment: "怨恨", fear: "畏惧" }[key] || key;
        return name + " " + (rel[key] || 0);
      }).join(" / ");
      var badgeHtml = (Game.getRelationBadges ? Game.getRelationBadges(person.id) : []).map(function (label) {
        var cls = label === "清算" ? "relation-badge--purge" : label === "危险" ? "relation-badge--danger" : label === "牵连" ? "relation-badge--debt" : "relation-badge--good";
        return '<span class="relation-badge ' + cls + '">' + escapeHtml(label) + '</span>';
      }).join("");
      return '<div class="relation"><div class="relation-head"><b>' + escapeHtml(person.name) + '</b><span class="muted">' + escapeHtml(person.label) + '</span></div>' + (badgeHtml ? '<div class="relation-badges">' + badgeHtml + '</div>' : '') + '<div>' + escapeHtml(bits) + '</div></div>';
    }).join("");
    var npcHtml = (Game.getVisibleNpcs ? Game.getVisibleNpcs() : []).map(function (item) {
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
    var contacts = s.contacts.map(function (id) {
      return GameData.contacts.find(function (contact) { return contact.id === id; });
    }).filter(Boolean).map(function (contact) {
      return '<div class="world-item"><b>' + escapeHtml(contact.name) + '</b><span class="muted">' + escapeHtml(contact.desc) + '</span></div>';
    }).join("");

    el("world-panel").innerHTML =
      '<div class="world-list">' + worldHtml + '</div>' +
      '<div class="section"><div class="panel-title">关系</div><div class="relation-list">' + relations + '</div></div>' +
      '<div class="section"><div class="panel-title">人物志</div><div class="npc-list">' + (npcHtml || '<p class="muted">暂无登场人物。</p>') + '</div></div>' +
      '<div class="section"><div class="panel-title">人脉</div><div class="world-list">' + contacts + '</div></div>';
    bindNpcStoryButtons();
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
    var beats = (Game.state.storyBeats || []).slice(0, 4).map(function (beat) {
      return '<div class="story-entry story-entry--' + escapeHtml(beat.kind) + '"><b>' + escapeHtml(beat.title) + '</b><span>' + escapeHtml(beat.time) + '</span><p>' + escapeHtml(beat.text) + '</p></div>';
    }).join("");
    var html = Game.state.log.map(function (entry) {
      return '<div class="log-entry"><b>' + escapeHtml(entry.time) + '</b><br>' + escapeHtml(entry.text) + '</div>';
    }).join("");
    el("log-panel").innerHTML =
      '<div class="panel-title">传闻与余波</div>' +
      '<div class="story-feed">' + (beats || '<p class="muted">尚无传闻。</p>') + '</div>' +
      '<div class="section"><div class="panel-title">记事</div><div class="log-list">' + (html || '<p class="muted">尚无记事。</p>') + '</div></div>';
  }

  function setActiveView(view) {
    var allowed = ["main", "relations", "deck", "life"];
    activeView = allowed.indexOf(view) >= 0 ? view : "main";
  }

  function syncActiveView() {
    Array.prototype.forEach.call(document.querySelectorAll(".app-view"), function (view) {
      view.classList.toggle("hidden", view.id !== activeView + "-view");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".view-tab"), function (button) {
      var active = button.getAttribute("data-view") === activeView;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function allDeckCards() {
    var s = Game.state || {};
    return []
      .concat((s.deck || []).map(function (card) { return { card: card, zone: "抽牌堆" }; }))
      .concat((s.hand || []).map(function (card) { return { card: card, zone: "手牌" }; }))
      .concat((s.discard || []).map(function (card) { return { card: card, zone: "弃牌堆" }; }))
      .concat(s.keptCard ? [{ card: s.keptCard, zone: "保留" }] : [])
      .concat((s.sealed || []).map(function (card) { return { card: card, zone: "封存" }; }));
  }

  function deckItems() {
    var map = {};
    allDeckCards().forEach(function (entry) {
      var card = entry.card;
      if (!card || !card.id) return;
      if (!map[card.id]) map[card.id] = { card: card, count: 0, zones: {} };
      map[card.id].count += 1;
      map[card.id].zones[entry.zone] = (map[card.id].zones[entry.zone] || 0) + 1;
    });
    return Object.keys(map).map(function (id) { return map[id]; }).sort(function (a, b) {
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

  function zoneText(zones) {
    return Object.keys(zones).map(function (name) {
      return name + " " + zones[name];
    }).join(" / ");
  }

  function renderDeckFilters(items) {
    var html = deckFilters.map(function (filter) {
      var count = items.reduce(function (sum, item) {
        return sum + (cardMatchesFilter(item.card, filter.id) ? item.count : 0);
      }, 0);
      return '<button class="deck-filter ' + (deckFilter === filter.id ? "is-active" : "") + '" data-deck-filter="' + escapeHtml(filter.id) + '">' +
        '<span>' + escapeHtml(filter.label) + '</span><b>' + count + '</b>' +
      '</button>';
    }).join("");
    el("deck-filter-panel").innerHTML = html +
      '<div class="deck-search-shell"><label for="deck-filter-note">筛选</label><div id="deck-filter-note" class="deck-note">按路线、污点与心病查看牌库结构。</div></div>';
  }

  function deckStats(items) {
    var groups = [
      ["行动牌", function (card) { return card.type !== "污点" && card.type !== "心病" && (card.tags || []).indexOf("政策") < 0 && (card.tags || []).indexOf("人脉") < 0; }],
      ["关系牌", function (card) { return ["人情", "人物", "家族"].indexOf(card.type) >= 0 || (card.tags || []).indexOf("人情") >= 0 || (card.tags || []).indexOf("NPC") >= 0; }],
      ["污点牌", function (card) { return card.type === "污点" || (card.tags || []).indexOf("污点") >= 0; }],
      ["心病牌", function (card) { return card.type === "心病"; }]
    ];
    return groups.map(function (group) {
      var total = items.reduce(function (sum, item) {
        return sum + (group[1](item.card) ? item.count : 0);
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
      '<div class="library-card-top"><b>' + escapeHtml(card.name) + '</b><em>×' + item.count + '</em></div>' +
      '<div class="library-card-art"><span>' + escapeHtml(visual.mark) + '</span></div>' +
      '<div class="library-card-meta">' + escapeHtml(card.type) + ' · ' + escapeHtml(card.domain) + '</div>' +
      '<div class="library-card-tags">' + tags + '</div>' +
    '</button>';
  }

  function renderDeckDetail(selected) {
    if (!selected) {
      el("deck-detail-panel").innerHTML = '<p class="muted">牌库为空。</p>';
      return;
    }
    var card = selected.card;
    var visual = cardVisual(card);
    var modes = Game.getCardModes ? Game.getCardModes(card) : (card.modes || []);
    var modeHtml = modes.length ? modes.map(function (mode) {
      return '<div class="detail-mode"><b>' + escapeHtml(mode.name) + '</b><span>' + escapeHtml(mode.desc || "") + '</span></div>';
    }).join("") : '<p class="muted">此牌没有分支用法。</p>';
    var tags = (card.tags || []).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join("");
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
      '<div class="section deck-zone-note"><b>所在区域</b><span>' + escapeHtml(zoneText(selected.zones)) + '</span></div>' +
      '<div class="deck-action-stack">' +
        '<button disabled>升级</button>' +
        '<button disabled class="scheme-button">异化</button>' +
        '<button disabled class="ghost-button">移出</button>' +
        '<button disabled>加入</button>' +
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
    el("deck-grid-panel").innerHTML = filtered.length ? '<div class="library-grid">' + filtered.map(renderLibraryCard).join("") + '</div>' : '<p class="muted">当前筛选下没有卡牌。</p>';
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
      return '<div class="mini-meter"><span>' + escapeHtml(relationLabel(key)) + '</span><div><i style="width:' + pct(value, 20) + '%"></i></div><b>' + value + '</b></div>';
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
          '<p class="life-text">' + escapeHtml(ending.text || "案卷仍在案头，身后评语尚未落笔。") + '</p>' +
          '<div class="section"><div class="panel-title">污点与牵连</div><div class="tags">' + (stains || '<span class="muted">暂无污点入档。</span>') + '</div></div>' +
        '</section>' +
        '<aside class="life-judgment">' +
          '<div class="panel-title">身后评定</div>' +
          renderJudgmentRows() +
          '<div class="life-verdict"><b>史评</b><p>' + escapeHtml(s.ended ? ending.text : "功过仍在变化，清名、能名、权势与污点会共同决定身后评语。") + '</p></div>' +
        '</aside>' +
        '<section class="life-timeline"><div class="panel-title">仕途时间线</div><div class="timeline-strip">' + timeline + '</div></section>' +
        '<div class="life-actions"><button data-life-action="export">导出生平</button><button data-life-action="new" class="ghost-button">再开一局</button><button data-life-action="deck" class="ghost-button">查看牌库</button></div>' +
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
        return '<div class="mode-row">' +
          '<div><b>' + escapeHtml(mode.name) + '</b><p>' + escapeHtml(mode.desc || "") + '</p><div class="mode-costs">' + renderCostChips(cost) + '<span class="mode-threat">威胁 +' + threat + '</span></div>' + hints + '</div>' +
          '<button data-mode-card="' + escapeHtml(instanceId) + '" data-mode-id="' + escapeHtml(mode.id) + '" ' + (canPay ? "" : "disabled") + '>使用</button>' +
        '</div>';
      }).join("");
      showModal('<h2>选择用法：《' + escapeHtml(card.name) + '》</h2><p class="muted">同一张牌的不同用法会改变目标、代价和反制风险。</p><div class="mode-list">' + modeHtml + '</div>');
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
      showModal('<h2 class="ending-title">' + escapeHtml(ending.title) + '</h2><p class="ending-text">' + escapeHtml(ending.text) + '</p><div class="modal-actions"><button id="export-button">导出生平摘要</button><button id="new-run-button" class="ghost-button">再开一局</button></div>');
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
