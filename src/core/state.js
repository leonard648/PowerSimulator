(function () {
  window.Game = window.Game || {};

  var SAVE_KEY = "wanli_zhang_juzheng_save_v1";

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function createRelations() {
    return {
      emperor: { trust: 8, suspicion: 2, closeness: 4, resentment: 0, fear: 0, debt: 0 },
      mentor: { trust: 8, closeness: 6, resentment: 0, fear: 0, debt: 1 },
      peers: { trust: 5, closeness: 4, resentment: 1, fear: 0, debt: 0 },
      gentry: { trust: 2, closeness: 2, resentment: 4, fear: 1, debt: 0 },
      clerks: { trust: 4, closeness: 2, resentment: 2, fear: 3, debt: 0 },
      superior: { trust: 5, closeness: 5, resentment: 0, fear: 0, debt: 2 },
      rival: { trust: 0, closeness: 0, resentment: 6, fear: 1, debt: 0 },
      scholars: { trust: 4, closeness: 3, resentment: 3, fear: 0, debt: 0 }
    };
  }

  function emptyTagUse() {
    return {
      清流: 0,
      能吏: 0,
      权谋: 0,
      仁政: 0,
      贪腐: 0,
      酷吏: 0,
      圆滑: 0,
      恬退: 0
    };
  }

  var STARTING_ACTION_IDS = [
    "memorial_direct", "careful_memorial", "academy_lecture", "write_edict",
    "visit_mentor", "peer_letter", "peer_mediation", "refuse_gift", "court_debate",
    "archive_search", "seal_document", "family_support", "marriage_plea",
    "ritual_poem", "educate_heir", "copy_classics", "private_warning", "medical_rest"
  ];

  function cardDef(id) {
    return (GameData.cards || []).find(function (card) { return card.id === id; });
  }

  function cardIdsFromZone(zone) {
    return (zone || []).map(function (card) {
      return card && card.id;
    }).filter(function (id) {
      var def = cardDef(id);
      return !!id && !!def && def.type !== "污点" && def.type !== "心病";
    });
  }

  function migrateOldNegativeCards(loaded) {
    loaded.stains = loaded.stains || [];
    loaded.ailments = loaded.ailments || [];
    []
      .concat(loaded.deck || [])
      .concat(loaded.hand || [])
      .concat(loaded.discard || [])
      .concat(loaded.sealed || [])
      .concat(loaded.keptCard ? [loaded.keptCard] : [])
      .forEach(function (card) {
        if (!card || !card.id) return;
        var def = cardDef(card.id);
        if (!def) return;
        if (def.type === "污点" && loaded.stains.indexOf(card.id) < 0) loaded.stains.push(card.id);
        if (def.type === "心病" && loaded.ailments.indexOf(card.id) < 0) loaded.ailments.push(card.id);
      });
  }

  function createActionLibrary(ids, source) {
    var library = { unlocked: {}, routes: [] };
    (ids || STARTING_ACTION_IDS).forEach(function (id) {
      if (!cardDef(id)) return;
      library.unlocked[id] = library.unlocked[id] || {
        id: id,
        level: 1,
        sources: []
      };
      if (source && library.unlocked[id].sources.indexOf(source) < 0) {
        library.unlocked[id].sources.push(source);
      }
    });
    return library;
  }

  function normalizeActionLibrary(loaded) {
    migrateOldNegativeCards(loaded);
    var ids = []
      .concat(cardIdsFromZone(loaded.deck))
      .concat(cardIdsFromZone(loaded.hand))
      .concat(cardIdsFromZone(loaded.discard))
      .concat(cardIdsFromZone(loaded.sealed))
      .concat(cardIdsFromZone(loaded.keptCard ? [loaded.keptCard] : []));
    var library = loaded.actionLibrary || null;
    if (!library || !library.unlocked) {
      library = createActionLibrary(ids.length ? ids : STARTING_ACTION_IDS, ids.length ? "旧存档迁移" : "辅政根基");
    } else {
      library.unlocked = library.unlocked || {};
      library.routes = library.routes || [];
      ids.forEach(function (id) {
        if (!cardDef(id)) return;
        library.unlocked[id] = library.unlocked[id] || { id: id, level: 1, sources: [] };
        library.unlocked[id].sources = library.unlocked[id].sources || [];
        if (library.unlocked[id].sources.indexOf("旧存档迁移") < 0) {
          library.unlocked[id].sources.push("旧存档迁移");
        }
      });
    }
    Object.keys(library.unlocked).forEach(function (id) {
      if (!cardDef(id)) {
        delete library.unlocked[id];
        return;
      }
      library.unlocked[id].id = id;
      library.unlocked[id].level = Math.max(1, library.unlocked[id].level || 1);
      library.unlocked[id].sources = library.unlocked[id].sources || [];
    });
    return library;
  }

  function normalizeLoadedEvent(event) {
    if (!event) return null;
    var template = (GameData.events || []).find(function (item) { return item.id === event.id; });
    if (template && (!event.choiceStages || !event.choiceStages.length)) {
      event.choiceStages = deepClone(template.choiceStages || []);
    }
    if (template && template.desc) {
      event.desc = template.desc;
    }
    if (template && (!event.story || event.story.version !== 2)) {
      var detail = GameData.eventDetails && GameData.eventDetails[template.id] || {};
      var critical = (template.criticalTracks || Object.keys(template.tracks || {}).slice(0, 2)).join("、");
      var stakes = critical ? "此案真正咬人的地方，是" + critical + "。若只把表面压平，余波会在下一季换个名字回来。" : "此案已转入阶段处置：先查明底账，再定案表态。";
      var opening = [detail.scene || template.desc, detail.background || template.desc].filter(Boolean).join("");
      var turn = [detail.conflict || stakes, "旧存档已迁移为事务抉择流程，案卷仍按当前轨道继续推进。"].filter(Boolean).join("");
      var close = detail.historicalWeight || stakes;
      var paragraphs = [opening, turn, close]
        .filter(function (line) { return line && String(line).trim(); });
      event.story = {
        version: 2,
        hook: detail.scene || template.desc,
        stakes: stakes,
        paragraphs: paragraphs.length ? paragraphs : [template.desc, "旧存档已迁移为事务抉择流程，案卷仍按当前轨道继续。"]
      };
    }
    event.choiceStageIndex = Math.max(0, event.choiceStageIndex || 0);
    event.choicesTaken = event.choicesTaken || [];
    event.choiceLog = event.choiceLog || [];
    event.played = event.played || [];
    return event;
  }

  function officeById(id) {
    return GameData.offices.find(function (office) { return office.id === id; }) || GameData.offices[0];
  }

  function inferOfficeId(year) {
    var phases = GameData.timeline && GameData.timeline.phases || [];
    var numericYear = Math.max(1, year || 1);
    var match = phases.find(function (phase) {
      return numericYear >= phase.startYear && numericYear <= phase.endYear;
    });
    if (match && match.officeId) return match.officeId;
    if (numericYear <= 2) return "hanlin";
    if (numericYear <= 7) return "county";
    return "censor";
  }

  function inferMerit(year, officeId) {
    return Math.max(0, (year || 1) - 1);
  }

  function timelineOfficeIdsThrough(year) {
    var phases = GameData.timeline && GameData.timeline.phases || [];
    if (!phases.length) {
      var officeId = inferOfficeId(year || 1);
      return officeId === "censor" ? ["hanlin", "county", "censor"] : officeId === "county" ? ["hanlin", "county"] : ["hanlin"];
    }
    return phases.filter(function (phase) {
      return (year || 1) >= phase.startYear;
    }).map(function (phase) {
      return phase.officeId;
    }).filter(function (id, index, list) {
      return id && list.indexOf(id) === index;
    });
  }

  function createCareer(year) {
    var officeId = inferOfficeId(year || 1);
    var office = officeById(officeId);
    return {
      officeId: officeId,
      merit: inferMerit(year || 1, officeId),
      rankName: office.rankName || office.name,
      unlockedOffices: timelineOfficeIdsThrough(year || 1),
      history: []
    };
  }

  function normalizeCareer(career, year) {
    var result = career || createCareer(year || 1);
    var inferredOfficeId = inferOfficeId(year || 1);
    var office = officeById(inferredOfficeId || result.officeId);
    result.officeId = office.id;
    result.merit = typeof result.merit === "number" ? result.merit : inferMerit(year || 1, office.id);
    result.rankName = office.rankName || office.name;
    result.unlockedOffices = timelineOfficeIdsThrough(year || 1);
    result.history = result.history || [];
    return result;
  }

  function createNpcState(def) {
    var initial = def.initial || {};
    return {
      bond: initial.bond || 0,
      resentment: initial.resentment || 0,
      debt: initial.debt || 0,
      trust: initial.trust || 0,
      stage: 0,
      met: false,
      status: "active",
      cooldown: 0,
      history: []
    };
  }

  function createNpcs() {
    var result = {};
    (GameData.npcs || []).forEach(function (def) {
      result[def.id] = createNpcState(def);
    });
    return result;
  }

  function normalizeNpcs(npcs) {
    var result = npcs || {};
    (GameData.npcs || []).forEach(function (def) {
      var base = createNpcState(def);
      result[def.id] = Object.assign(base, result[def.id] || {});
      result[def.id].history = result[def.id].history || [];
      result[def.id].status = result[def.id].status || "active";
      result[def.id].cooldown = result[def.id].cooldown || 0;
    });
    return result;
  }

  Game.Util = { deepClone: deepClone, clamp: clamp };

  Game.getOfficeById = officeById;

  Game.getOffice = function () {
    var state = Game.state || {};
    var officeId = state.career && state.career.officeId ? state.career.officeId : inferOfficeId(state.year || 1);
    return officeById(officeId);
  };

  Game.createNewState = function () {
    return {
      year: 1,
      age: GameData.player && GameData.player.startAge || 48,
      seasonIndex: 0,
      career: createCareer(1),
      currentEvent: null,
      hasDrawn: false,
      preparedThisSeason: false,
      preparedAction: null,
      prepDrawBonus: 0,
      ended: false,
      resources: {
        energy: 5,
        money: 4,
        favor: 4,
        pressure: 0
      },
      attributes: {
        才学: 8,
        政务: 8,
        权谋: 7,
        口才: 7,
        操守: 6,
        体魄: 4
      },
      traits: ["综核名实", "刚毅任事"],
      fame: {
        clean: 5,
        competence: 8,
        literary: 7,
        power: 7,
        cruel: 0,
        corruption: 1
      },
      world: {
        emperorTrust: 8,
        scholarOpinion: 5,
        publicMood: 6,
        fiscalHealth: 4,
        factionHeat: 6,
        courtPressure: 6
      },
      relations: createRelations(),
      npcs: createNpcs(),
      actionLibrary: createActionLibrary(STARTING_ACTION_IDS, "辅政根基"),
      deck: [],
      hand: [],
      discard: [],
      sealed: [],
      stains: [],
      keptCard: null,
      selectedForExchange: [],
      pendingReward: null,
      pendingSummary: null,
      pendingOfficeDraft: null,
      ailments: [],
      contacts: ["mentor", "peer_friend", "adviser"],
      policies: [],
      eventHistory: [],
      storyBeats: [],
      relationEventCooldowns: {},
      npcEventCooldown: 0,
      relationWarnings: {},
      log: [],
      tagUse: emptyTagUse(),
      flags: {}
    };
  };

  Game.save = function () {
    localStorage.setItem(SAVE_KEY, JSON.stringify(Game.state));
    Game.addLog("已存档。");
  };

  Game.load = function () {
    var raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      var loaded = JSON.parse(raw);
      loaded.keptCard = loaded.keptCard || null;
      loaded.selectedForExchange = loaded.selectedForExchange || [];
      loaded.pendingReward = loaded.pendingReward || null;
      loaded.pendingSummary = loaded.pendingSummary || null;
      if (loaded.pendingReward && !loaded.pendingSummary) {
        loaded.pendingSummary = {
          legacy: true,
          eventName: loaded.pendingReward.eventName || "旧档结案",
          level: loaded.pendingReward.level || "partial",
          title: loaded.pendingReward.title || "旧档结案",
          resultText: loaded.pendingReward.text || "此存档停在旧版结案状态。新版已改为结案总结，可直接进入下一季。",
          story: loaded.pendingReward.story || "旧日案卷已归档，余波照旧写入新政。",
          trackSummary: { critical: [], blocked: [], unresolved: [] },
          deltaGroups: [],
          npcBeats: [],
          cardChanges: [],
          autoGrowth: ["旧版结案状态已转换；进入下一季后按新版规则继续。"],
          notes: []
        };
        loaded.pendingReward = null;
      }
      loaded.storyBeats = loaded.storyBeats || [];
      loaded.preparedThisSeason = !!loaded.preparedThisSeason;
      loaded.preparedAction = loaded.preparedThisSeason ? (loaded.preparedAction || null) : null;
      loaded.prepDrawBonus = loaded.prepDrawBonus || 0;
      loaded.pendingOfficeDraft = loaded.pendingOfficeDraft || null;
      loaded.actionLibrary = normalizeActionLibrary(loaded);
      loaded.deck = [];
      loaded.hand = [];
      loaded.discard = [];
      loaded.sealed = loaded.sealed || [];
      loaded.keptCard = null;
      loaded.ailments = loaded.ailments || [];
      loaded.career = normalizeCareer(loaded.career, loaded.year || 1);
      loaded.npcs = normalizeNpcs(loaded.npcs);
      loaded.relationEventCooldowns = loaded.relationEventCooldowns || {};
      loaded.npcEventCooldown = loaded.npcEventCooldown || 0;
      loaded.relationWarnings = loaded.relationWarnings || {};
      loaded.tagUse = Object.assign(emptyTagUse(), loaded.tagUse || {});
      if (loaded.currentEvent) {
        loaded.currentEvent.flags = loaded.currentEvent.flags || {};
        loaded.currentEvent.playCount = loaded.currentEvent.playCount || 0;
        loaded.currentEvent.reactionCount = loaded.currentEvent.reactionCount || 0;
        loaded.currentEvent.criticalTracks = loaded.currentEvent.criticalTracks || [];
        loaded.currentEvent.threat = loaded.currentEvent.threat || 0;
        loaded.currentEvent.threatMax = loaded.currentEvent.threatMax || 3;
        loaded.currentEvent.story = loaded.currentEvent.story || null;
        normalizeLoadedEvent(loaded.currentEvent);
      }
      return loaded;
    } catch (err) {
      return null;
    }
  };

  Game.clearSave = function () {
    localStorage.removeItem(SAVE_KEY);
  };

  Game.addLog = function (text) {
    var s = Game.state;
    var office = Game.getOffice ? Game.getOffice().name : "";
    var season = GameData.seasons[s.seasonIndex] || "";
    s.log.unshift({
      time: (Game.timelineYearLabel ? Game.timelineYearLabel(s.year) : "第" + s.year + "年") + season + "·" + office,
      text: text
    });
    s.log = s.log.slice(0, 80);
  };

  Game.getStartingActionIds = function () {
    return STARTING_ACTION_IDS.slice();
  };

  Game.createActionLibrary = createActionLibrary;

  Game.normalizeActionLibrary = normalizeActionLibrary;

  Game.boundState = function () {
    var s = Game.state;
    s.resources.energy = clamp(s.resources.energy, 0, 8);
    s.resources.money = clamp(s.resources.money, 0, 12);
    s.resources.favor = clamp(s.resources.favor, 0, 12);
    s.resources.pressure = clamp(s.resources.pressure, 0, 20);
    s.actionLibrary = normalizeActionLibrary(s);
    s.career = normalizeCareer(s.career, s.year || 1);
    s.ailments = s.ailments || [];
    Object.keys(s.world).forEach(function (key) {
      s.world[key] = clamp(s.world[key], 0, 20);
    });
    Object.keys(s.fame).forEach(function (key) {
      s.fame[key] = clamp(s.fame[key], 0, 20);
    });
    Object.keys(s.relations).forEach(function (id) {
      Object.keys(s.relations[id]).forEach(function (key) {
        s.relations[id][key] = clamp(s.relations[id][key], 0, 20);
      });
    });
    s.npcs = normalizeNpcs(s.npcs);
    s.npcEventCooldown = clamp(s.npcEventCooldown || 0, 0, 20);
    Object.keys(s.npcs).forEach(function (id) {
      ["bond", "resentment", "debt", "trust"].forEach(function (key) {
        s.npcs[id][key] = clamp(s.npcs[id][key] || 0, 0, 20);
      });
      s.npcs[id].cooldown = clamp(s.npcs[id].cooldown || 0, 0, 40);
      s.npcs[id].stage = clamp(s.npcs[id].stage || 0, 0, 9);
    });
  };
})();
