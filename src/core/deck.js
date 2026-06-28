(function () {
  window.Game = window.Game || {};

  function cardById(id) {
    return GameData.cards.find(function (card) { return card.id === id; });
  }

  function cloneCard(card) {
    var copy = Game.Util.deepClone(card);
    copy.instanceId = card.id + "_" + Math.random().toString(36).slice(2, 10);
    return copy;
  }

  function shuffle(items) {
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }
    return items;
  }

  function isNegative(card) {
    return card.type === "污点" || card.type === "心病";
  }

  function ensureLibrary() {
    Game.state.actionLibrary = Game.normalizeActionLibrary ? Game.normalizeActionLibrary(Game.state) : (Game.state.actionLibrary || { unlocked: {}, routes: [] });
    return Game.state.actionLibrary;
  }

  function libraryEntry(id) {
    var library = ensureLibrary();
    return library.unlocked[id] || null;
  }

  function unlockAction(id, source) {
    var card = cardById(id);
    if (!card) return null;
    var library = ensureLibrary();
    var entry = library.unlocked[id];
    var existed = !!entry;
    if (!entry) {
      entry = { id: id, level: 1, sources: [] };
      library.unlocked[id] = entry;
    } else {
      entry.sources = entry.sources || [];
    }
    if (existed && source && entry.sources.indexOf(source) < 0) {
      entry.level = Math.min(3, (entry.level || 1) + 1);
    }
    if (source && entry.sources.indexOf(source) < 0) entry.sources.push(source);
    return card;
  }

  var officeCardPools = {
    county: [
      "survey_fields", "open_granary", "audit_accounts", "banquet_gentry",
      "strict_interrogation", "borrow_treasury", "report_truth", "conceal_deficit_action",
      "repair_waterworks", "pacify_lawsuit", "commercial_tax", "comfort_people",
      "catch_bandits", "protect_subordinate", "scapegoat_clerk", "public_works",
      "night_reading", "seal_grain", "village_covenant", "salt_levy_audit",
      "relief_register", "hire_adviser"
    ],
    censor: [
      "impeach_unlawful", "secret_memorial", "withhold_dossier", "plant_protege",
      "divide_faction", "public_petition", "cross_examine", "seek_inner_tip",
      "resign_for_principle", "share_credit", "frugal_house", "smooth_transfer",
      "evidence_chain", "humble_apology", "delay_deliberation", "strict_quota",
      "quiet_compensation", "wind_hearsay", "summon_witness", "imperial_mood",
      "burn_private_letter"
    ]
  };

  var starterByOffice = {
    county: ["audit_accounts", "open_granary", "catch_bandits", "seal_grain", "village_covenant"],
    censor: ["evidence_chain", "cross_examine", "imperial_mood", "humble_apology"]
  };

  var officePackages = {
    county: [
      {
        id: "county_accounts",
        name: "清丈财赋",
        desc: "围绕清丈田亩、钱粮稽核与一条鞭法，推动国用转稳。",
        cards: ["audit_accounts", "survey_fields", "seal_grain", "commercial_tax", "borrow_treasury"]
      },
      {
        id: "county_benevolent",
        name: "河工赈济",
        desc: "把治河、水利与民生安抚纳入新政，减少地方反噬。",
        cards: ["open_granary", "repair_waterworks", "comfort_people", "village_covenant", "public_works"]
      },
      {
        id: "county_control",
        name: "边防考成",
        desc: "以考成、边饷和部院督责压住执行链，短期效率更高。",
        cards: ["banquet_gentry", "strict_interrogation", "protect_subordinate", "scapegoat_clerk", "hire_adviser"]
      }
    ],
    censor: [
      {
        id: "censor_law",
        name: "帝心维系",
        desc: "以奏对、御前证据与成例稳住万历信任，压低转冷风险。",
        cards: ["impeach_unlawful", "cross_examine", "evidence_chain", "joint_review", "summon_witness"]
      },
      {
        id: "censor_public",
        name: "言路应对",
        desc: "处理言官弹劾与士林清议，能保名声，也更刺眼。",
        cards: ["public_petition", "resign_for_principle", "chain_memorial", "public_repute", "wind_hearsay"]
      },
      {
        id: "censor_shadow",
        name: "身后保全",
        desc: "以内廷消息、把柄与冷处理预备清算风险，权力更近，污点也更近。",
        cards: ["secret_memorial", "withhold_dossier", "seek_inner_tip", "watch_in_silence", "turn_reaction"]
      }
    ]
  };

  function validIds(ids) {
    return (ids || []).filter(function (id) { return !!cardById(id); });
  }

  Game.cardById = cardById;

  Game.getActionLibrary = function () {
    return ensureLibrary();
  };

  Game.hasAction = function (id) {
    return !!libraryEntry(id);
  };

  Game.unlockAction = unlockAction;

  Game.getActionLibraryItems = function () {
    var library = ensureLibrary();
    return Object.keys(library.unlocked).map(function (id) {
      var card = cardById(id);
      if (!card) return null;
      return {
        id: id,
        card: card,
        level: library.unlocked[id].level || 1,
        sources: library.unlocked[id].sources || []
      };
    }).filter(Boolean).sort(function (a, b) {
      return a.card.name.localeCompare(b.card.name, "zh-Hans-CN");
    });
  };

  Game.cloneCardById = function (id) {
    var source = cardById(id);
    return source ? cloneCard(source) : null;
  };

  Game.buildStartingDeck = function () {
    var baseIds = [
      "memorial_direct", "careful_memorial", "academy_lecture", "write_edict",
      "visit_mentor", "peer_letter", "peer_mediation", "refuse_gift", "court_debate",
      "archive_search", "seal_document", "family_support", "marriage_plea",
      "ritual_poem", "educate_heir", "copy_classics", "private_warning", "medical_rest"
    ];
    Game.state.actionLibrary = Game.createActionLibrary ? Game.createActionLibrary(baseIds, "辅政根基") : { unlocked: {}, routes: [] };
    Game.state.deck = [];
    Game.state.hand = [];
    Game.state.discard = [];
  };

  Game.getOfficeCardPackages = function (officeId) {
    return (officePackages[officeId] || []).map(function (pack) {
      return {
        id: pack.id,
        name: pack.name,
        desc: pack.desc,
        cards: validIds(pack.cards)
      };
    }).filter(function (pack) { return pack.cards.length; });
  };

  Game.addOfficeCards = function (officeId, selectedIds) {
    Game.state.flags = Game.state.flags || {};
    Game.state.flags["phase_cards_" + officeId] = 1;
    validIds(selectedIds && selectedIds.length ? selectedIds : officeCardPools[officeId]).forEach(function (id) {
      unlockAction(id, Game.getOfficeById ? ("阶段展开：" + Game.getOfficeById(officeId).name) : "阶段展开");
    });
  };

  Game.queueOfficeCardDraft = function (officeId) {
    var packages = Game.getOfficeCardPackages(officeId);
    if (!packages.length) {
      Game.addOfficeCards(officeId);
      return false;
    }
    Game.state.pendingOfficeDraft = {
      officeId: officeId,
      packages: packages
    };
    return true;
  };

  Game.chooseOfficePackage = function (index) {
    var draft = Game.state.pendingOfficeDraft;
    if (!draft || !draft.packages || !draft.packages[index]) return false;
    var pack = draft.packages[index];
    Game.addOfficeCards(draft.officeId, pack.cards);
    Game.addLog("阶段择策：" + pack.name + "写入手段库。");
    Game.state.pendingOfficeDraft = null;
    return true;
  };

  Game.drawCards = function (count) {
    var s = Game.state;
    if (s.pendingReward || s.pendingSummary || s.ended) return;
    var office = Game.getOffice();
    var bonus = s.prepDrawBonus || 0;
    var target = Math.min(office.handLimit + bonus, count + bonus);
    if (s.keptCard) {
      s.hand.push(s.keptCard);
      s.keptCard = null;
    }
    for (var i = 0; i < target; i += 1) {
      if (s.hand.length >= target) break;
      if (s.deck.length === 0 && s.discard.length > 0) {
        s.deck = shuffle(s.discard.splice(0));
      }
      if (s.deck.length === 0) break;
      s.hand.push(s.deck.pop());
    }
    s.hasDrawn = true;
    s.prepDrawBonus = 0;
  };

  Game.discardHand = function () {
    var s = Game.state;
    s.selectedForExchange = [];
    while (s.hand.length) {
      s.discard.push(s.hand.pop());
    }
  };

  Game.removeFromHand = function (instanceId) {
    var s = Game.state;
    var index = s.hand.findIndex(function (card) { return card.instanceId === instanceId; });
    if (index < 0) return null;
    s.selectedForExchange = (s.selectedForExchange || []).filter(function (id) { return id !== instanceId; });
    return s.hand.splice(index, 1)[0];
  };

  Game.discardCard = function (card) {
    if (!card) return;
    unlockAction(card.id, "旧流程兼容");
  };

  Game.addCardToDiscard = function (id) {
    return unlockAction(id, "事务沉淀");
  };

  Game.removeFirstCardByIds = function (ids) {
    var s = Game.state;
    var library = ensureLibrary();
    for (var i = 0; i < ids.length; i += 1) {
      var id = ids[i];
      if (library.unlocked[id]) {
        delete library.unlocked[id];
        return cardById(id);
      }
    }
    return null;
  };

  Game.upgradeFirstCard = function (pairs) {
    var fromIds = Object.keys(pairs);
    var removed = Game.removeFirstCardByIds(fromIds);
    if (!removed) return null;
    var upgraded = unlockAction(pairs[removed.id], "升格旧法");
    var entry = upgraded && libraryEntry(upgraded.id);
    if (entry) entry.level = Math.max(2, entry.level || 1);
    return upgraded ? { from: removed, to: upgraded } : null;
  };

  Game.addNegativeCard = function (id) {
    var source = cardById(id);
    if (!source) return;
    if (source.type === "污点") {
      Game.state.stains.push(id);
    } else if (source.type === "心病") {
      Game.state.ailments = Game.state.ailments || [];
      Game.state.ailments.push(id);
    }
  };

  Game.maybeAddPressureCard = function () {
    var s = Game.state;
    if (s.resources.pressure >= 8 && Math.random() < 0.45) {
      var pool = ["sleepless", "guilty_conscience", "fear_purge", "burnout"];
      Game.addNegativeCard(pool[Math.floor(Math.random() * pool.length)]);
      Game.addLog("压力郁积，心病入档。");
    }
  };

  Game.deckSummary = function () {
    var counts = {};
    Game.getActionLibraryItems().forEach(function (item) {
      counts[item.card.name] = (counts[item.card.name] || 0) + 1;
    });
    return Object.keys(counts).sort().map(function (name) {
      return { name: name, count: counts[name] };
    });
  };

  Game.isNegativeCard = isNegative;
})();
