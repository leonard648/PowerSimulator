(function () {
  window.Game = window.Game || {};

  var SAVE_KEY = "bureaucracy_deckbuilder_demo_save";

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function createRelations() {
    return {
      emperor: { trust: 6, suspicion: 3, closeness: 0, resentment: 0, fear: 0, debt: 0 },
      mentor: { trust: 5, closeness: 4, resentment: 0, fear: 0, debt: 0 },
      peers: { trust: 4, closeness: 4, resentment: 0, fear: 0, debt: 0 },
      gentry: { trust: 3, closeness: 3, resentment: 1, fear: 0, debt: 0 },
      clerks: { trust: 3, closeness: 2, resentment: 1, fear: 1, debt: 0 },
      superior: { trust: 4, closeness: 2, resentment: 0, fear: 0, debt: 0 },
      rival: { trust: 0, closeness: 0, resentment: 3, fear: 0, debt: 0 },
      scholars: { trust: 4, closeness: 4, resentment: 0, fear: 0, debt: 0 }
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

  function officeById(id) {
    return GameData.offices.find(function (office) { return office.id === id; }) || GameData.offices[0];
  }

  function inferOfficeId(year) {
    if (year <= 4) return "hanlin";
    if (year <= 8) return "county";
    return "censor";
  }

  function inferMerit(year, officeId) {
    if (officeId === "censor") return 64;
    if (officeId === "county") return Math.max(28, (year - 4) * 7);
    return Math.max(0, (year - 1) * 5);
  }

  function createCareer(year) {
    var officeId = inferOfficeId(year || 1);
    var office = officeById(officeId);
    return {
      officeId: officeId,
      merit: inferMerit(year || 1, officeId),
      rankName: office.rankName || office.name,
      unlockedOffices: officeId === "censor" ? ["hanlin", "county", "censor"] : officeId === "county" ? ["hanlin", "county"] : ["hanlin"],
      history: []
    };
  }

  function normalizeCareer(career, year) {
    var result = career || createCareer(year || 1);
    var office = officeById(result.officeId || inferOfficeId(year || 1));
    result.officeId = office.id;
    result.merit = typeof result.merit === "number" ? result.merit : inferMerit(year || 1, office.id);
    result.rankName = result.rankName || office.rankName || office.name;
    result.unlockedOffices = result.unlockedOffices || (office.id === "censor" ? ["hanlin", "county", "censor"] : office.id === "county" ? ["hanlin", "county"] : ["hanlin"]);
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
      age: 24,
      seasonIndex: 0,
      career: createCareer(1),
      currentEvent: null,
      hasDrawn: false,
      preparedThisSeason: false,
      prepDrawBonus: 0,
      ended: false,
      resources: {
        energy: 4,
        money: 3,
        favor: 2,
        pressure: 0
      },
      attributes: {
        才学: 6,
        政务: 4,
        权谋: 3,
        口才: 5,
        操守: 5,
        体魄: 4
      },
      traits: ["刚直", "惜名"],
      fame: {
        clean: 3,
        competence: 2,
        literary: 3,
        power: 0,
        cruel: 0,
        corruption: 0
      },
      world: {
        emperorTrust: 6,
        scholarOpinion: 6,
        publicMood: 6,
        fiscalHealth: 5,
        factionHeat: 4,
        courtPressure: 4
      },
      relations: createRelations(),
      npcs: createNpcs(),
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
          story: loaded.pendingReward.story || "旧日案卷已归档，余波照旧写入仕途。",
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
      loaded.prepDrawBonus = loaded.prepDrawBonus || 0;
      loaded.pendingOfficeDraft = loaded.pendingOfficeDraft || null;
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
      time: "第" + s.year + "年" + season + "·" + office,
      text: text
    });
    s.log = s.log.slice(0, 80);
  };

  Game.boundState = function () {
    var s = Game.state;
    s.resources.energy = clamp(s.resources.energy, 0, 8);
    s.resources.money = clamp(s.resources.money, 0, 12);
    s.resources.favor = clamp(s.resources.favor, 0, 12);
    s.resources.pressure = clamp(s.resources.pressure, 0, 20);
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
