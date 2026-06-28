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
        name: "清账能吏",
        desc: "压钱粮、证据与流程，适合把地方治理做成账面实绩。",
        cards: ["audit_accounts", "survey_fields", "seal_grain", "commercial_tax", "borrow_treasury"]
      },
      {
        id: "county_benevolent",
        name: "仁政地方",
        desc: "照顾民心与灾荒，升迁慢些，但地方评价更稳。",
        cards: ["open_granary", "repair_waterworks", "comfort_people", "village_covenant", "public_works"]
      },
      {
        id: "county_control",
        name: "胥吏控局",
        desc: "用属吏、士绅和惩戒手段压住现场，短期效率更高。",
        cards: ["banquet_gentry", "strict_interrogation", "protect_subordinate", "scapegoat_clerk", "hire_adviser"]
      }
    ],
    censor: [
      {
        id: "censor_law",
        name: "据法弹章",
        desc: "强化证据、质证与成例，适合走能吏御史。",
        cards: ["impeach_unlawful", "cross_examine", "evidence_chain", "joint_review", "summon_witness"]
      },
      {
        id: "censor_public",
        name: "清议正声",
        desc: "借士林与名节开路，能得清名，也更刺眼。",
        cards: ["public_petition", "resign_for_principle", "chain_memorial", "public_repute", "wind_hearsay"]
      },
      {
        id: "censor_shadow",
        name: "宫门暗线",
        desc: "以内廷消息和把柄处理反扑，权力更近，污点也更近。",
        cards: ["secret_memorial", "withhold_dossier", "seek_inner_tip", "watch_in_silence", "turn_reaction"]
      }
    ]
  };

  function validIds(ids) {
    return (ids || []).filter(function (id) { return !!cardById(id); });
  }

  Game.cardById = cardById;

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
    Game.state.deck = shuffle(baseIds.map(function (id) { return cloneCard(cardById(id)); }));
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
    var starters = starterByOffice[officeId] || [];
    validIds(selectedIds && selectedIds.length ? selectedIds : officeCardPools[officeId]).forEach(function (id) {
      var card = cloneCard(cardById(id));
      if (starters.indexOf(id) >= 0) {
        Game.state.deck.push(card);
      } else {
        Game.state.discard.push(card);
      }
    });
    if (starters.length) Game.state.deck = shuffle(Game.state.deck);
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
    Game.addLog("升迁选包：" + pack.name + "入库。");
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
    Game.state.discard.push(card);
  };

  Game.addCardToDiscard = function (id) {
    var card = Game.cloneCardById(id);
    if (!card) return null;
    Game.state.discard.push(card);
    return card;
  };

  Game.removeFirstCardByIds = function (ids) {
    var s = Game.state;
    var zones = ["discard", "deck", "hand"];
    for (var z = 0; z < zones.length; z += 1) {
      var zone = zones[z];
      var index = s[zone].findIndex(function (card) { return ids.indexOf(card.id) >= 0; });
      if (index >= 0) return s[zone].splice(index, 1)[0];
    }
    return null;
  };

  Game.upgradeFirstCard = function (pairs) {
    var fromIds = Object.keys(pairs);
    var removed = Game.removeFirstCardByIds(fromIds);
    if (!removed) return null;
    var upgraded = Game.addCardToDiscard(pairs[removed.id]);
    return upgraded ? { from: removed, to: upgraded } : null;
  };

  Game.addNegativeCard = function (id) {
    var source = cardById(id);
    if (!source) return;
    var card = cloneCard(source);
    Game.state.discard.push(card);
    if (source.type === "污点") {
      Game.state.stains.push(id);
    }
  };

  Game.maybeAddPressureCard = function () {
    var s = Game.state;
    if (s.resources.pressure >= 8 && Math.random() < 0.45) {
      var pool = ["sleepless", "guilty_conscience", "fear_purge", "burnout"];
      Game.addNegativeCard(pool[Math.floor(Math.random() * pool.length)]);
      Game.addLog("压力郁积，心病入牌库。");
    }
  };

  Game.deckSummary = function () {
    var zones = []
      .concat(Game.state.deck)
      .concat(Game.state.hand)
      .concat(Game.state.discard);
    var counts = {};
    zones.forEach(function (card) {
      counts[card.name] = (counts[card.name] || 0) + 1;
    });
    return Object.keys(counts).sort().map(function (name) {
      return { name: name, count: counts[name] };
    });
  };

  Game.isNegativeCard = isNegative;
})();
