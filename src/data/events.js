(function () {
  window.GameData = window.GameData || {};

  function ev(id, office, name, desc, tracks, participants, success, fail, weight) {
    return {
      id: id,
      office: office,
      name: name,
      desc: desc,
      tracks: tracks,
      participants: participants,
      success: success || "此事处置得体，新政威望稍振。",
      fail: fail || "此事拖延失据，反噬渐生。",
      weight: weight || 1
    };
  }

  GameData.events = [
    ev("hanlin_edict", "hanlin", "遗诏辅政", "穆宗遗诏已下，幼主初立。外廷要看张居正如何承接顾命，内廷也要看首辅是否能替宫中稳住第一季朝局。", { "帝心未定": 7, "高拱余波": 7, "内廷牵连": 5, "言路沸腾": 4 }, ["万历帝", "李太后", "高拱"], "辅政名义稳住，首辅得以用遗诏开局。", "顾命之名被旧相余党搅浑，首辅得位的议论先起。", 2),
    ev("hanlin_lecture", "hanlin", "经筵训主", "万历帝年少，读书听政皆在众目之下。帝师讲得太宽，幼主难立规矩；讲得太严，日后也会记住这份管束。", { "幼主学业": 8, "帝心未定": 6, "言路沸腾": 4, "内廷牵连": 4 }, ["万历帝", "李太后", "申时行"], "经筵立住规矩，帝心与师道暂时相合。", "训主之严被记成拘束，帝心深处添了阴影。"),
    ev("hanlin_faction", "hanlin", "高拱去位余波", "高拱已退，旧部未散。有人说此为遗诏辅政，有人说这是冯保与张居正联手逐相。", { "高拱余波": 8, "内廷牵连": 6, "阁臣观望": 5, "言路沸腾": 4 }, ["高拱", "冯保", "内阁同僚"], "旧相余波被收束，内阁开始承认新的中枢秩序。", "旧相之议不绝，政敌从得位处替你写下第一笔。"),
    ev("hanlin_slander", "hanlin", "司礼监协力", "票拟要行，批红要合，冯保递来的宫中消息正好解一处急局。可外廷已经有人把“内廷”二字写在旁边。", { "内廷牵连": 8, "帝心未定": 5, "言路沸腾": 6, "阁臣观望": 3 }, ["冯保", "万历帝", "士林清议"], "内廷协力没有越界，政令得以下达。", "司礼监之助太显眼，言路开始疑你倚宦。"),
    ev("hanlin_mentor", "hanlin", "太后托重", "李太后命人传话：皇帝读书不可懈，朝政也不可乱。宫中把幼主托给你，也把成败压到你肩上。", { "帝心未定": 7, "幼主学业": 6, "内廷牵连": 5, "言路沸腾": 4 }, ["李太后", "万历帝", "内廷"], "太后倚重成为新政护持，帝师名分更实。", "宫中托重太过显眼，外廷讥你以内廷自重。"),
    ev("hanlin_impeach_friend", "hanlin", "阁臣分寸", "申时行、张四维等阁臣都在看首辅如何分功、分责。若一切归于张居正，内阁就会只剩听令；若过度迁就，新政又难成形。", { "阁臣观望": 7, "部院迟滞": 5, "帝心未定": 4, "言路沸腾": 4 }, ["内阁同僚", "申时行", "张四维"], "阁臣各得其位，首辅权威未伤。", "阁臣口服心疑，中枢内部先多了一层缝。"),

    ev("county_granary", "county", "考成法下六部", "考成法要让六部诸司按限交卷。章程一出，部院官员知道从此难再以空文塞责，也知道怨气该投向谁。", { "考成压力": 8, "部院迟滞": 7, "言路沸腾": 5, "帝心未定": 4 }, ["王国光", "部院执行", "万历帝"], "考成法压住拖沓，政令有了准绳。", "考成过急，部院怨气与言路非议一同回潮。", 2),
    ev("county_flood", "county", "黄河河工告急", "黄河与漕运牵动国脉，潘季驯请银请权，反对者则说河工耗费太重。", { "河工急迫": 8, "财赋缺口": 6, "部院迟滞": 5, "言路沸腾": 4 }, ["潘季驯", "户部", "地方士绅"], "河工得以推进，漕运与民田暂有依托。", "河工银两未齐，堤岸与朝议同时发紧。"),
    ev("county_lawsuit", "county", "清丈隐田", "清丈田亩触到地方士绅的根基。隐田一摊开，国赋有望；族谱、契书和地方人情也会一齐涌上案头。", { "清丈阻力": 9, "地方抵制": 7, "财赋缺口": 5, "言路沸腾": 4 }, ["地方士绅", "王国光", "士林清议"], "隐田入册，国用稍充，新政政绩更实。", "清丈受阻，地方把新政说成扰民聚敛。", 2),
    ev("county_tax", "county", "一条鞭法筹议", "赋役折银、归并征收，看似清楚，落到地方却牵动里甲、银价、役法与旧利。", { "财赋缺口": 8, "清丈阻力": 6, "地方抵制": 6, "部院迟滞": 4 }, ["户部", "地方士绅", "部院执行"], "筹议成形，赋役渐有可行章程。", "新法未稳，地方与部院各自留下推脱口子。"),
    ev("county_bandits", "county", "蓟镇练兵与边饷", "戚继光镇蓟，边防安稳需饷银不断。文臣疑武将拥兵，户部又说国用吃紧。", { "边镇军饷": 8, "财赋缺口": 6, "部院迟滞": 5, "言路沸腾": 4 }, ["戚继光", "户部", "言官"], "边饷接续，蓟镇军备成为新政实绩。", "边镇缺饷，武臣与户部互相推诿。"),
    ev("county_clerks", "county", "部院文牍怠工", "考成催得太紧，部院官吏不敢明抗，却能让每一道文书慢半拍。", { "部院迟滞": 9, "考成压力": 7, "帝心未定": 4, "言路沸腾": 4 }, ["部院执行", "内阁同僚", "万历帝"], "文牍重新运转，考成法的威力落到日常。", "部院怠工变成无声反扑，政令越催越滞。"),

    ev("censor_corrupt_minister", "censor", "言官弹劾新政", "新政行久，言路开始合流：有人劾你专权，有人劾你聚敛，有人只等夺情旧事重燃。", { "言路沸腾": 9, "权势过盛": 8, "帝心未定": 6, "身后清算": 4 }, ["吴中行", "邹元标", "万历帝"], "言路被压而不至失控，新政仍能前行。", "弹章反噬，首辅权势被写成众矢之的。", 2),
    ev("censor_border", "censor", "边臣去留", "戚继光仍守边镇，张居正的庇护却越来越显眼。政敌说这是任贤，也说这是私恩。", { "边镇军饷": 7, "权势过盛": 6, "帝心未定": 5, "言路沸腾": 5 }, ["戚继光", "万历帝", "言官"], "边臣留用得当，边防实绩抵住攻讦。", "武臣牵连入局，边防功劳也被染上党附之名。"),
    ev("censor_palace", "censor", "帝心转冷", "万历帝已渐长成。昔日严师之恩，开始与少年被约束的记忆纠缠。", { "帝心未定": 10, "权势过盛": 7, "内廷牵连": 5, "身后清算": 5 }, ["万历帝", "李太后", "冯保"], "你让皇帝仍觉新政可用，旧日管束暂未成怨。", "帝心转冷，昔日师道开始变成身后风险。", 2),
    ev("censor_exam_scandal", "censor", "夺情风波", "父丧传来，朝廷夺情留任。国事需要首辅，名教却要求归丧。言官的奏疏已经在路上。", { "夺情非议": 10, "言路沸腾": 8, "帝心未定": 5, "家门牵连": 4 }, ["吴中行", "邹元标", "李太后"], "夺情之议虽重，朝政仍被稳住。", "名教之伤入骨，廷杖也压不住身后非议。", 2),
    ev("censor_reform", "censor", "新政通行", "考成、清丈、一条鞭、治河、边防渐成体系。成效越显，权势之名也越重。", { "权势过盛": 8, "财赋缺口": 6, "部院迟滞": 6, "身后清算": 5 }, ["王国光", "潘季驯", "申时行"], "新政成体系，后世再难抹去其功。", "新政虽成，却把太多怨气一并系到首辅身上。"),
    ev("censor_final_purge", "censor", "身后清算阴影", "万历十年将尽，旧相、内廷、夺情、家门、门生、边臣都可能被重新翻出。你要保的不只是生前权势，还有死后新政。", { "身后清算": 10, "家门牵连": 8, "帝心未定": 8, "言路沸腾": 6 }, ["万历帝", "张四维", "张敬修"], "旧账未能合流，新政身后仍有余地。", "旧账合流，家门与新政一并落入清算。", 2)
  ];

  function relationEv(id, name, desc, tracks, participants, success, fail, source, effects) {
    var event = ev(id, "relation", name, desc, tracks, participants, success, fail, 1);
    event.special = "relation";
    event.relationSource = source;
    event.successEffect = effects && effects.success || {};
    event.partialEffect = effects && effects.partial || {};
    event.failEffect = effects && effects.fail || {};
    event.fatalOnFail = effects && effects.fatalOnFail || null;
    return event;
  }

  GameData.events = GameData.events.concat([
    relationEv("rel_secret_mandate", "宫中密议", "李太后与冯保递来宫中风声，催你趁帝心尚稳推进一件难事。做得好，是内廷协力；做过了，就是倚内廷压外廷。", { "内廷牵连": 8, "帝心未定": 6, "言路沸腾": 5, "部院迟滞": 3 }, ["李太后", "冯保", "万历帝"], "宫中协力用得有度，外廷暂难指摘。", "密议露了痕迹，内廷二字更刺眼。", "内廷亲近", {
      success: { merit: 4, world: { emperorTrust: 2 }, relations: { emperor: { trust: 1, suspicion: -1 }, mentor: { closeness: 1 } }, fame: { power: 1 } },
      partial: { merit: 1, relations: { emperor: { suspicion: 1 }, mentor: { debt: 1 } }, resources: { pressure: 1 } },
      fail: { world: { emperorTrust: -1, factionHeat: 1 }, relations: { emperor: { suspicion: 2 }, rival: { resentment: 1 } }, addStain: "inner_palace_contact" }
    }),
    relationEv("rel_vermilion_suspicion", "御批转冷", "一道御批忽然追问旧日章奏。无人明说罪名，但每个人都知道万历帝已经不再只是当年的幼主。", { "帝心未定": 10, "权势过盛": 7, "身后清算": 5, "言路沸腾": 4 }, ["万历帝", "内阁同僚", "言官"], "你把疑处说开，君臣之间仍有余温。", "御批落下，首辅之功开始被疑心重新丈量。", "万历猜忌", {
      success: { merit: 2, world: { emperorTrust: 1 }, relations: { emperor: { suspicion: -2 } } },
      partial: { relations: { emperor: { suspicion: 1 } }, resources: { pressure: 1 } },
      fail: { merit: -6, world: { emperorTrust: -2, courtPressure: 1 }, relations: { emperor: { suspicion: 3 }, rival: { resentment: 1 } }, resources: { pressure: 2 }, demote: true }
    }),
    relationEv("rel_framed_case", "旧政罗织", "政敌把夺情、内廷、家门和门生几条线钉在一起，像把新政功绩翻成一册罪案。", { "身后清算": 10, "家门牵连": 8, "言路沸腾": 7, "帝心未定": 6 }, ["政敌言官", "万历帝", "张四维"], "你拆开旧案线头，让新政功过仍可分论。", "旧案越辩越浑，连新政二字也被拖入泥中。", "政敌怨恨", {
      success: { merit: 3, relations: { rival: { resentment: -2, fear: 1 } }, fame: { clean: 1 } },
      partial: { resources: { pressure: 2 }, relations: { rival: { resentment: 1 } } },
      fail: { merit: -8, resources: { pressure: 3 }, world: { factionHeat: 2, emperorTrust: -1 }, relations: { rival: { resentment: 2 }, emperor: { suspicion: 2 } }, addStain: "withheld_file" },
      fatalOnFail: "framed_execution"
    }),
    relationEv("rel_scholar_support", "清议暂服", "士林中也有人承认新政有功，愿替清丈、河工、边防说句公道话。声望能托起你，也会让皇帝看见你名太重。", { "言路沸腾": 8, "帝心未定": 5, "权势过盛": 5, "身后清算": 4 }, ["士林清议", "万历帝", "政敌言官"], "清议为新政所用，没有越过君臣分寸。", "清议太盛，反叫宫中疑你以名逼主。", "士林亲近", {
      success: { merit: 4, fame: { clean: 2, literary: 1 }, world: { scholarOpinion: 2 } },
      partial: { fame: { clean: 1 }, relations: { emperor: { suspicion: 1 } } },
      fail: { world: { courtPressure: 2, factionHeat: 1 }, relations: { emperor: { suspicion: 2 }, scholars: { resentment: 1 } }, resources: { pressure: 1 } }
    }),
    relationEv("rel_public_backlash", "士林反噬", "旧日训令、廷杖与夺情之议被重新传抄。原本称你能臣的人，也开始问你是否伤了名教。", { "言路沸腾": 9, "夺情非议": 8, "帝心未定": 4, "身后清算": 4 }, ["士林清议", "言官", "万历帝"], "你稳住公论，让非议暂止于纸面。", "士林翻脸比政敌更快，清名被剥去一层。", "士林怨恨", {
      success: { merit: 2, world: { scholarOpinion: 1 }, relations: { scholars: { resentment: -2 } } },
      partial: { fame: { clean: -1 }, resources: { pressure: 1 } },
      fail: { fame: { clean: -2 }, world: { scholarOpinion: -2, factionHeat: 1 }, relations: { scholars: { resentment: 2 }, rival: { resentment: 1 } } }
    }),
    relationEv("rel_gentry_circle", "地方抗清丈", "地方大户不再各自申辩，而是同声说新政扰民。清丈、税粮、里甲册页忽然处处缺一角。", { "清丈阻力": 10, "地方抵制": 8, "财赋缺口": 6, "言路沸腾": 4 }, ["地方士绅", "户部", "士林清议"], "你破开地方合围，隐田仍能入册。", "地方不必明着抗命，只要让每件账慢半拍。", "士绅怨恨", {
      success: { merit: 3, relations: { gentry: { resentment: -2, fear: 1 } }, fame: { competence: 1 } },
      partial: { world: { fiscalHealth: -1 }, relations: { gentry: { resentment: 1 } } },
      fail: { world: { fiscalHealth: -2, publicMood: -1 }, relations: { gentry: { resentment: 2 }, clerks: { resentment: 1 } }, resources: { pressure: 1 } }
    }),
    relationEv("rel_clerk_trap", "部院推诿", "部院把几件文书照章送上来，条款无错，时限无错，错处却专等首辅批过之后才会显形。", { "部院迟滞": 10, "考成压力": 7, "帝心未定": 5, "言路沸腾": 4 }, ["部院执行", "内阁同僚", "万历帝"], "你识破推诿，部院一时不敢再拖。", "你在一纸公文上失手，考成法被反过来嘲笑。", "部院怨恨", {
      success: { merit: 3, relations: { clerks: { resentment: -2, fear: 1 } }, fame: { competence: 1 } },
      partial: { relations: { clerks: { resentment: 1 } }, resources: { pressure: 1 } },
      fail: { relations: { clerks: { resentment: 2 } }, world: { courtPressure: 1 }, resources: { pressure: 2 }, flags: { clerk_trap: 1 } }
    }),
    relationEv("rel_school_pressure", "阁臣求缓", "内阁同僚同时来劝：新政再好，也要给部院和地方留一口气。缓一步，可能保全局；急一步，才像张居正。", { "阁臣观望": 8, "部院迟滞": 7, "言路沸腾": 5, "帝心未定": 4 }, ["内阁同僚", "申时行", "张四维"], "你既留了台阶，也没有让新政散架。", "阁臣求缓变成牵连，你从此难说中枢同心。", "阁臣亏欠", {
      success: { merit: 2, resources: { favor: 2 }, relations: { peers: { debt: -2, closeness: 1 } } },
      partial: { resources: { favor: 1 }, fame: { clean: -1 }, relations: { peers: { debt: -1 } } },
      fail: { fame: { clean: -1 }, world: { factionHeat: 1 }, relations: { peers: { resentment: 1 }, rival: { resentment: 1 } }, addStain: "protege_scandal" }
    })
  ]);

  function npcEv(id, npcId, office, name, desc, tracks, participants, success, fail, source, effects) {
    var event = ev(id, office, name, desc, tracks, participants, success, fail, 1);
    event.special = "npc";
    event.npcId = npcId;
    event.relationSource = source;
    event.successEffect = effects && effects.success || {};
    event.partialEffect = effects && effects.partial || {};
    event.failEffect = effects && effects.fail || {};
    return event;
  }

  GameData.events = GameData.events.concat([
    npcEv("npc_shen_recommend", "shen_ruhui", "hanlin", "太后懿旨", "李太后命你更严督万历读书，又要你勿使外廷觉宫中越权。", { "帝心未定": 8, "幼主学业": 7, "内廷牵连": 6, "言路沸腾": 4 }, ["李太后", "万历帝", "内廷"], "你让懿旨成为师道，而非宫中干政。", "懿旨太重，外廷开始疑首辅挟宫中。", "李太后托重", {
      success: { merit: 3, addCard: "npc_mentor_letter", npcs: { shen_ruhui: { bond: 2, debt: -1, trust: 1 } }, relations: { mentor: { closeness: 1, debt: -1 }, emperor: { trust: 1 } }, resources: { favor: 1 } },
      partial: { merit: 1, npcs: { shen_ruhui: { debt: -1, bond: 1 } }, resources: { favor: 1 }, relations: { emperor: { suspicion: 1 } } },
      fail: { merit: -2, addStain: "inner_palace_contact", npcs: { shen_ruhui: { resentment: 1, trust: -1 } }, relations: { mentor: { resentment: 1 } }, fame: { clean: -1 } }
    }),
    npcEv("npc_gu_rescue", "gu_yuanheng", "hanlin", "冯保递话", "冯保送来半句宫中风声，能替你避开御前一处暗坑。只是这半句若用得太准，外廷也会听见。", { "内廷牵连": 8, "帝心未定": 6, "言路沸腾": 5, "高拱余波": 4 }, ["冯保", "内廷", "万历帝"], "你用宫中消息而不露痕迹，冯保更愿相助。", "风声传得太准，内外勾连之议又起。", "冯保递话", {
      success: { merit: 2, addCard: "npc_peer_alliance", npcs: { gu_yuanheng: { bond: 2, debt: -1, trust: 1 } }, relations: { mentor: { closeness: 1, debt: -1 }, emperor: { trust: 1 } } },
      partial: { npcs: { gu_yuanheng: { bond: 1, debt: -1 } }, resources: { pressure: 1 } },
      fail: { npcs: { gu_yuanheng: { resentment: 2, trust: -1 } }, relations: { rival: { resentment: 1 } }, fame: { clean: -1 }, addStain: "inner_palace_contact" }
    }),
    npcEv("npc_ye_joint_name", "ye_shenyan", "hanlin", "申时行调停", "申时行劝你让几位部臣在新章程上署名。名分分出去，责任也分出去。", { "阁臣观望": 8, "部院迟滞": 6, "帝心未定": 4, "言路沸腾": 3 }, ["申时行", "内阁同僚", "部院执行"], "调停没有损伤权威，内阁更像一架能运转的机器。", "台阶留得太多，旁人开始试探首辅是否可退。", "申时行调停", {
      success: { merit: 3, addCard: "npc_academy_voice", npcs: { ye_shenyan: { bond: 2, trust: 1 } }, relations: { peers: { closeness: 1 } }, world: { courtPressure: -1 } },
      partial: { npcs: { ye_shenyan: { bond: 1 } }, relations: { peers: { closeness: 1 } }, fame: { clean: 1 } },
      fail: { npcs: { ye_shenyan: { resentment: 1 } }, world: { courtPressure: 1 }, resources: { pressure: 1 } }
    }),
    npcEv("npc_wei_probe", "wei_chengbi", "hanlin", "张四维观望", "张四维送来一份措辞极稳的拟票。字面无错，却把最冒险的一处留给你亲自承担。", { "阁臣观望": 8, "权势过盛": 5, "帝心未定": 5, "言路沸腾": 4 }, ["张四维", "内阁同僚", "万历帝"], "你看破观望，反让张四维不得不入局。", "拟票落下后，风险都归在首辅名下。", "张四维观望", {
      success: { merit: 2, npcs: { wei_chengbi: { resentment: -1, trust: -1 } }, relations: { peers: { resentment: -1 }, rival: { fear: 1 } }, fame: { competence: 1 } },
      partial: { npcs: { wei_chengbi: { resentment: 1 } }, resources: { pressure: 1 } },
      fail: { npcs: { wei_chengbi: { resentment: 3 } }, relations: { peers: { resentment: 2 }, emperor: { suspicion: 1 } }, resources: { pressure: 2 } }
    }),
    npcEv("npc_zhao_quota", "zhao_tingzan", "county", "王国光请限", "王国光请你给户部清丈与征银定下硬限。限期能成账，也能激起地方怨声。", { "财赋缺口": 8, "考成压力": 7, "清丈阻力": 6, "地方抵制": 5 }, ["王国光", "户部", "地方士绅"], "户部得限，财赋章程开始见数。", "硬限压下，地方把怨气记到账外。", "王国光请限", {
      success: { merit: 4, npcs: { zhao_tingzan: { trust: 2, bond: 1 } }, relations: { clerks: { fear: 1, trust: 1 } }, fame: { competence: 1 }, world: { fiscalHealth: 1 } },
      partial: { merit: 1, npcs: { zhao_tingzan: { trust: 1, debt: 1 } }, resources: { pressure: 1 } },
      fail: { merit: -4, npcs: { zhao_tingzan: { resentment: 2, trust: -1 } }, relations: { clerks: { resentment: 2 } }, resources: { pressure: 2 } }
    }),
    npcEv("npc_lin_bargain", "lin_boheng", "county", "潘季驯请河银", "潘季驯请拨河银，并求你给他足够处置河工的人事权。户部皱眉，言路已备好弹章。", { "河工急迫": 8, "财赋缺口": 7, "部院迟滞": 5, "言路沸腾": 4 }, ["潘季驯", "户部", "言官"], "河银拨下，河工得以照章推进。", "河工与财赋两头吃紧，反对者找到了口实。", "潘季驯请银", {
      success: { merit: 3, addCard: "npc_gentry_grain", npcs: { lin_boheng: { bond: 2, debt: 1, trust: 1 } }, relations: { clerks: { closeness: 1, debt: 1 } }, resources: { money: -1 }, world: { publicMood: 1 } },
      partial: { npcs: { lin_boheng: { debt: 1, bond: 1 } }, fame: { competence: 1 }, resources: { pressure: 1 } },
      fail: { npcs: { lin_boheng: { resentment: 2 } }, relations: { clerks: { resentment: 2 } }, world: { publicMood: -1 } }
    }),
    npcEv("npc_cao_account", "cao_heng", "county", "戚继光请饷", "戚继光奏称蓟镇练兵不可断饷。户部账面吃紧，言官却盯着首辅与武臣的交情。", { "边镇军饷": 9, "财赋缺口": 6, "言路沸腾": 5, "部院迟滞": 4 }, ["戚继光", "户部", "言官"], "边饷接续，戚继光更能守住北门。", "边饷只得半数，武臣知道首辅也有力穷处。", "戚继光请饷", {
      success: { merit: 3, addCard: "npc_clerk_eyes", npcs: { cao_heng: { bond: 2, trust: 1 } }, relations: { clerks: { trust: 1, closeness: 1 } }, world: { publicMood: 1 } },
      partial: { npcs: { cao_heng: { bond: 1 } }, resources: { pressure: 1 } },
      fail: { npcs: { cao_heng: { resentment: 2 } }, relations: { clerks: { resentment: 1 } }, world: { courtPressure: 1 } }
    }),
    npcEv("npc_cheng_plan", "cheng_jie", "county", "家书入阁", "张敬修来信求你替家门一桩人情留意。信写得谨慎，危险也正在谨慎二字里。", { "家门牵连": 8, "言路沸腾": 6, "帝心未定": 5, "身后清算": 4 }, ["张敬修", "家门", "言官"], "你压住家门伸手，亲情没有变成公案。", "家书虽小，却让家门牵连添了一处入口。", "张敬修来信", {
      success: { merit: 2, addCard: "npc_adviser_plan", npcs: { cheng_jie: { bond: 1, debt: -1, trust: 1 } }, relations: { superior: { debt: -1, trust: 1 } }, fame: { clean: 1 } },
      partial: { npcs: { cheng_jie: { debt: 1, bond: 1 } }, resources: { favor: 1 }, fame: { clean: -1 } },
      fail: { npcs: { cheng_jie: { resentment: 2 } }, relations: { superior: { debt: 2 } }, fame: { clean: -2 }, addStain: "family_obligation" }
    }),
    npcEv("npc_emperor_private", "jinghe_emperor", "censor", "万历私问", "万历帝屏退左右，只问你一句：先生所行，皆为国乎，亦为权乎？", { "帝心未定": 10, "权势过盛": 8, "身后清算": 5, "言路沸腾": 4 }, ["朱翊钧", "万历帝", "张居正"], "你答得有师道也有臣节，帝心暂未转尽。", "私问之后，皇帝记住的不是答案，而是权势。", "万历私问", {
      success: { merit: 4, npcs: { jinghe_emperor: { trust: 2, resentment: -1 } }, relations: { emperor: { trust: 2, suspicion: -1 } }, world: { emperorTrust: 2 } },
      partial: { npcs: { jinghe_emperor: { trust: 1, resentment: 1 } }, relations: { emperor: { suspicion: 1 } } },
      fail: { merit: -5, npcs: { jinghe_emperor: { resentment: 3, trust: -1 } }, relations: { emperor: { suspicion: 3 } }, world: { emperorTrust: -2 }, resources: { pressure: 2 } }
    }),
    npcEv("npc_feng_whisper", "feng_jin", "censor", "高拱旧议", "京中忽传高拱旧事新说，暗指当年逐相乃首辅与内廷合谋。", { "高拱余波": 8, "内廷牵连": 7, "身后清算": 6, "言路沸腾": 5 }, ["高拱", "冯保", "言官"], "旧议被压回旧纸堆，暂未伤到新政根基。", "旧相之名重回朝局，开局旧账变成晚局新刀。", "高拱旧议", {
      success: { merit: 2, npcs: { feng_jin: { resentment: -1 } }, relations: { rival: { resentment: -1, fear: 1 } } },
      partial: { npcs: { feng_jin: { resentment: 1 } }, resources: { pressure: 1 } },
      fail: { npcs: { feng_jin: { resentment: 2 } }, relations: { rival: { resentment: 2 }, emperor: { suspicion: 1 } }, world: { factionHeat: 1 } }
    }),
    npcEv("npc_tao_impeach", "tao_wendao", "censor", "吴中行劾夺情", "吴中行上疏反对夺情，言辞直指首辅违礼。若压下，名教之议不会消失；若退让，新政中断。", { "夺情非议": 10, "言路沸腾": 8, "帝心未定": 5, "身后清算": 5 }, ["吴中行", "言官", "李太后"], "你让夺情留任仍有可辩之义，廷杖未成唯一答案。", "夺情之疏入骨，廷杖只把它打进士林记忆。", "吴中行弹劾", {
      success: { merit: 3, addCard: "npc_academy_voice", npcs: { tao_wendao: { bond: 1, resentment: -1 } }, world: { scholarOpinion: 1 }, fame: { clean: 1 } },
      partial: { npcs: { tao_wendao: { resentment: 1 } }, fame: { clean: -1 }, resources: { pressure: 1 } },
      fail: { npcs: { tao_wendao: { resentment: 3 } }, relations: { scholars: { resentment: 2 }, rival: { resentment: 1 } }, world: { scholarOpinion: -2 }, addStain: "protege_scandal" }
    }),
    npcEv("npc_yan_invite", "yan_shao", "censor", "邹元标直谏", "邹元标继而直言，新政有功不等于首辅可以坏名教、压言路。", { "言路沸腾": 9, "夺情非议": 8, "权势过盛": 7, "身后清算": 5 }, ["邹元标", "言官", "士林清议"], "你没有让直谏完全化为死敌，清议仍留一线。", "直谏被压成怨，日后清算会记住他的名字。", "邹元标直谏", {
      success: { merit: 2, addCard: "npc_power_path", npcs: { yan_shao: { resentment: -1, trust: 1 } }, relations: { rival: { resentment: -1 }, scholars: { closeness: 1 } } },
      partial: { npcs: { yan_shao: { resentment: 1 } }, resources: { pressure: 1 } },
      fail: { npcs: { yan_shao: { resentment: 3 } }, relations: { rival: { resentment: 2 }, scholars: { resentment: 1 } }, world: { factionHeat: 1 } }
    })
  ]);

  function detail(scene, background, conflict, historicalWeight) {
    return {
      scene: scene,
      background: background,
      conflict: conflict,
      historicalWeight: historicalWeight
    };
  }

  GameData.eventDetails = {
    hanlin_edict: detail("遗诏墨迹未干，内阁值房里灯火整夜不灭。", "万历初政的第一关，不是颁一道漂亮诏书，而是让幼主、太后、司礼监与外廷都承认辅政秩序。", "高拱余波和帝心未定交叠，任何一步都可能被说成夺权。", "此事写进传记，是张居正万历新政的开篇。"),
    hanlin_lecture: detail("经筵上，幼主的目光还带着少年迟疑。", "帝师之责既是教书，也是教君。", "训得太严会成怨，训得太宽又不足以立政。", "万历后来如何看张居正，常可从此类早年约束里寻找伏笔。"),
    hanlin_faction: detail("高拱去位后，旧相门生仍在京中互通声气。", "张居正必须把旧相余波收束为制度更替，而非内廷夺权。", "内廷牵连越重，高拱余党越有话可说。", "高拱之去，是张居正掌权绕不开的历史节点。"),
    hanlin_slander: detail("冯保递来的话轻得像偶然，分量却足以改变票拟去向。", "内廷协力是新政发动机之一。", "问题在于外廷是否接受这种协力。", "张居正与冯保的同盟，既成就新政，也成为身后攻讦的把柄。"),
    hanlin_mentor: detail("宫中传话，要求皇帝读书不可一日松懈。", "李太后以母后之尊支持帝师严格督学。", "严教幼主可立规矩，也可埋下成年后的不满。", "太后支持是新政开局的重要条件。"),
    hanlin_impeach_friend: detail("阁臣的沉默并不等于同心。", "张居正权威越重，内阁同僚越要衡量自己是否只是陪衬。", "分权太多会慢，分权太少会怨。", "内阁同僚的观望决定新政能否从个人意志变成中枢惯性。"),
    county_granary: detail("考成册页一张张摊开，限期朱笔压得极重。", "考成法以期限和核验约束官僚机器。", "它能提高效率，也能制造大规模怨气。", "考成法是张居正新政最具标志性的制度工具之一。"),
    county_flood: detail("河工急报与户部银册同时到案。", "黄河与漕运关系国用和民生。", "河工要银、要权、要背书，任何一项不足都可能失败。", "潘季驯治河是万历新政务实面的重要见证。"),
    county_lawsuit: detail("清丈册里一个数字，就能牵出一族隐田。", "清丈田亩触动地方士绅利益。", "国赋与民怨常在同一册田簿上相邻。", "清丈隐田是财赋改革能否见效的关键。"),
    county_tax: detail("役法、银两、里甲旧册在户部案上堆成一座小山。", "一条鞭法要求把复杂赋役折并归一。", "章程越清楚，旧利被夺者越不甘心。", "一条鞭法代表明代财政制度的重要转向。"),
    county_bandits: detail("边镇奏报说粮饷尚缺，蓟门风紧。", "戚继光练兵需要稳定支持。", "武臣得首辅庇护，既是任贤，也易被说成私恩。", "边防安稳是张居正新政的另一项硬实绩。"),
    county_clerks: detail("部院文书比往常更齐整，也更迟。", "考成法压住官僚拖沓，却逼出更隐蔽的推诿。", "首辅要让机器运转，不能只靠训斥。", "制度改革常败在执行细处。"),
    censor_corrupt_minister: detail("弹章像秋雨一样接连入阁。", "言官不掌政务，却能决定一项政务在史笔里的名分。", "新政越有成效，专权之名越重。", "张居正晚局最大的对手，常是他亲手压下的言路。"),
    censor_border: detail("戚继光的军报仍稳，朝中非议却越来越多。", "边臣去留牵动国家安全，也牵动党附之名。", "庇护能臣与任私人之间，只隔着政敌的一套说辞。", "张居正死后戚继光失势，反衬此线的重要。"),
    censor_palace: detail("万历帝的问话少了少年依赖，多了君主审视。", "严师之恩会随皇帝长大而改变味道。", "你要保帝心，又不能显得恋权。", "帝心转冷决定张居正身后命运。"),
    censor_exam_scandal: detail("父丧之报抵京，朝廷却要首辅留任。", "夺情留任把国事与名教正面相撞。", "留下可保新政，留下也会让名节永远裂开。", "夺情是张居正评价中最难绕开的争议。"),
    censor_reform: detail("新政各线渐成体系，成效与怨气也一起成体系。", "考成、清丈、一条鞭、治河、边防相互支撑。", "越像个人功业，越像个人罪案。", "这正是张居正功过难分的历史重量。"),
    censor_final_purge: detail("旧案簿、家书、门生名册与弹章被人重新翻出。", "人死之后，权力留下的每一条线都会被重新命名。", "要保住新政，就不能让所有旧怨合流。", "张居正死后被清算，家产籍没，是本局终点的阴影。")
  };

  var critical = {
    hanlin_edict: ["帝心未定", "高拱余波"],
    hanlin_lecture: ["幼主学业", "帝心未定"],
    hanlin_faction: ["高拱余波", "内廷牵连"],
    hanlin_slander: ["内廷牵连", "言路沸腾"],
    hanlin_mentor: ["帝心未定", "幼主学业"],
    hanlin_impeach_friend: ["阁臣观望", "部院迟滞"],
    county_granary: ["考成压力", "部院迟滞"],
    county_flood: ["河工急迫", "财赋缺口"],
    county_lawsuit: ["清丈阻力", "地方抵制"],
    county_tax: ["财赋缺口", "清丈阻力"],
    county_bandits: ["边镇军饷", "财赋缺口"],
    county_clerks: ["部院迟滞", "考成压力"],
    censor_corrupt_minister: ["言路沸腾", "权势过盛"],
    censor_border: ["边镇军饷", "帝心未定"],
    censor_palace: ["帝心未定", "权势过盛"],
    censor_exam_scandal: ["夺情非议", "言路沸腾"],
    censor_reform: ["权势过盛", "身后清算"],
    censor_final_purge: ["身后清算", "家门牵连"],
    rel_secret_mandate: ["内廷牵连", "帝心未定"],
    rel_vermilion_suspicion: ["帝心未定", "权势过盛"],
    rel_framed_case: ["身后清算", "家门牵连"],
    rel_scholar_support: ["言路沸腾", "帝心未定"],
    rel_public_backlash: ["言路沸腾", "夺情非议"],
    rel_gentry_circle: ["清丈阻力", "地方抵制"],
    rel_clerk_trap: ["部院迟滞", "考成压力"],
    rel_school_pressure: ["阁臣观望", "部院迟滞"],
    npc_shen_recommend: ["帝心未定", "幼主学业"],
    npc_gu_rescue: ["内廷牵连", "帝心未定"],
    npc_ye_joint_name: ["阁臣观望", "部院迟滞"],
    npc_wei_probe: ["阁臣观望", "权势过盛"],
    npc_zhao_quota: ["财赋缺口", "考成压力"],
    npc_lin_bargain: ["河工急迫", "财赋缺口"],
    npc_cao_account: ["边镇军饷", "财赋缺口"],
    npc_cheng_plan: ["家门牵连", "身后清算"],
    npc_emperor_private: ["帝心未定", "权势过盛"],
    npc_feng_whisper: ["高拱余波", "内廷牵连"],
    npc_tao_impeach: ["夺情非议", "言路沸腾"],
    npc_yan_invite: ["言路沸腾", "夺情非议"]
  };

  var hooks = {
    "帝心未定": { world: { emperorTrust: -1 }, relations: { emperor: { suspicion: 1 } }, text: "帝心未安，君臣之间多一层疑影。" },
    "幼主学业": { world: { emperorTrust: -1 }, text: "经筵规矩未立，帝师名分受疑。" },
    "高拱余波": { world: { factionHeat: 1 }, relations: { rival: { resentment: 1 } }, text: "旧相余波未平，得位之议再起。" },
    "内廷牵连": { fame: { clean: -1 }, relations: { mentor: { debt: 1 }, rival: { resentment: 1 } }, text: "内廷牵连加深，外廷议论更刺耳。" },
    "言路沸腾": { world: { scholarOpinion: -1, factionHeat: 1 }, text: "言路未平，弹章与传抄继续发酵。" },
    "阁臣观望": { relations: { peers: { resentment: 1 } }, text: "阁臣仍在观望，中枢同心不足。" },
    "部院迟滞": { world: { courtPressure: 1 }, relations: { clerks: { resentment: 1 } }, text: "部院执行迟滞，政令落地更慢。" },
    "考成压力": { resources: { pressure: 1 }, relations: { clerks: { resentment: 1 } }, text: "考成压力反噬，部院怨气更重。" },
    "清丈阻力": { world: { fiscalHealth: -1 }, relations: { gentry: { resentment: 1 } }, text: "清丈阻力未解，隐田仍在册外。" },
    "地方抵制": { world: { publicMood: -1 }, relations: { gentry: { resentment: 1 } }, text: "地方抵制延续，扰民之议更响。" },
    "财赋缺口": { world: { fiscalHealth: -1 }, text: "财赋缺口未补，国用仍显吃紧。" },
    "河工急迫": { world: { publicMood: -1, fiscalHealth: -1 }, text: "河工急迫未缓，民生与漕运皆受牵动。" },
    "边镇军饷": { world: { courtPressure: 1 }, text: "边镇军饷未稳，武臣与户部互相推诿。" },
    "权势过盛": { world: { factionHeat: 1 }, fame: { power: 1 }, relations: { emperor: { suspicion: 1 }, rival: { resentment: 1 } }, text: "权势之名更重，身后风险随之抬头。" },
    "夺情非议": { fame: { clean: -1 }, world: { scholarOpinion: -1 }, relations: { scholars: { resentment: 1 } }, text: "夺情非议未散，名教之伤更深。" },
    "家门牵连": { resources: { pressure: 1 }, relations: { superior: { debt: 1 } }, text: "家门牵连加重，私事渐成公案。" },
    "身后清算": { resources: { pressure: 1 }, relations: { rival: { resentment: 1 }, emperor: { suspicion: 1 } }, text: "清算阴影未退，旧账正等风向。" }
  };

  function trackMap(names, amount) {
    var result = {};
    names.filter(Boolean).forEach(function (name) {
      result[name] = amount;
    });
    return result;
  }

  function mergeTracks(base, extra) {
    var result = {};
    Object.keys(base || {}).forEach(function (key) { result[key] = base[key]; });
    Object.keys(extra || {}).forEach(function (key) {
      result[key] = (result[key] || 0) + extra[key];
    });
    return result;
  }

  function tagBag(tags) {
    var result = {};
    (tags || []).forEach(function (tag) { result[tag] = (result[tag] || 0) + 1; });
    return result;
  }

  function firstMatchingTrack(event, patterns, fallback) {
    var names = Object.keys(event.tracks || {});
    for (var p = 0; p < patterns.length; p += 1) {
      for (var i = 0; i < names.length; i += 1) {
        if (names[i].indexOf(patterns[p]) >= 0) return names[i];
      }
    }
    return fallback || names[0] || "";
  }

  function participantGroup(event) {
    var joined = (event.participants || []).join("、") + "、" + event.name;
    if (joined.indexOf("万历") >= 0 || joined.indexOf("朱翊钧") >= 0 || joined.indexOf("皇帝") >= 0) return { id: "emperor", name: "君前" };
    if (joined.indexOf("李太后") >= 0 || joined.indexOf("冯保") >= 0 || joined.indexOf("内廷") >= 0 || joined.indexOf("司礼监") >= 0) return { id: "mentor", name: "内廷" };
    if (joined.indexOf("申时行") >= 0 || joined.indexOf("张四维") >= 0 || joined.indexOf("内阁") >= 0 || joined.indexOf("阁臣") >= 0) return { id: "peers", name: "阁臣" };
    if (joined.indexOf("地方士绅") >= 0 || joined.indexOf("士绅") >= 0 || joined.indexOf("清丈") >= 0) return { id: "gentry", name: "地方" };
    if (joined.indexOf("部院") >= 0 || joined.indexOf("户部") >= 0 || joined.indexOf("王国光") >= 0 || joined.indexOf("潘季驯") >= 0 || joined.indexOf("戚继光") >= 0) return { id: "clerks", name: "部院" };
    if (joined.indexOf("家门") >= 0 || joined.indexOf("张敬修") >= 0) return { id: "superior", name: "家门" };
    if (joined.indexOf("言官") >= 0 || joined.indexOf("高拱") >= 0 || joined.indexOf("邹元标") >= 0 || joined.indexOf("政敌") >= 0) return { id: "rival", name: "言路" };
    if (joined.indexOf("士林") >= 0 || joined.indexOf("吴中行") >= 0 || joined.indexOf("清议") >= 0) return { id: "scholars", name: "士林" };
    return { id: "peers", name: "中枢" };
  }

  function stainForOffice(office) {
    if (office === "county") return "conceal_deficit";
    if (office === "censor") return "withheld_file";
    return "inner_palace_contact";
  }

  function choice(id, title, body, cost, effect, tags, outcomeText, reactionRisk, libraryTags, setFlags) {
    return {
      id: id,
      title: title,
      body: body,
      cost: cost || {},
      effect: effect || {},
      tags: tags || [],
      outcomeText: outcomeText,
      reactionRisk: reactionRisk || 0,
      libraryTags: libraryTags || tags || [],
      setFlags: setFlags || {}
    };
  }

  function buildChoiceStages(event) {
    var criticalTracks = critical[event.id] || Object.keys(event.tracks || {}).slice(0, 2);
    var first = criticalTracks[0] || Object.keys(event.tracks || {})[0] || "";
    var second = criticalTracks[1] || Object.keys(event.tracks || {})[1] || first;
    var evidence = firstMatchingTrack(event, ["案", "票拟", "考成", "册", "清丈", "财赋", "河工", "军饷"], first);
    var publicTrack = firstMatchingTrack(event, ["言路", "士林", "夺情", "地方", "民", "清议"], second);
    var relationTrack = firstMatchingTrack(event, ["内廷", "阁臣", "部院", "地方", "家门", "政敌", "权势"], second);
    var deadline = firstMatchingTrack(event, ["帝心", "限", "考成", "财赋", "河工", "边镇", "身后"], first);
    var group = participantGroup(event);
    var relationEffect = {};
    relationEffect[group.id] = group.id === "rival" ? { resentment: -1 } : group.id === "emperor" ? { trust: 1 } : { closeness: 1, debt: 1 };
    var hardRelation = {};
    hardRelation[group.id] = group.id === "rival" ? { resentment: 1, fear: 1 } : { resentment: 1 };

    return [
      {
        id: "probe",
        title: "查明底账",
        desc: "先看此事真正咬人的地方，再决定用制度、名分还是人情去压。",
        choices: [
          choice(
            "probe_records",
            "翻旧牍，核制度来路",
            "你没有急着表态，只命人把旧诏、票拟、册页和旁证一并摊开。纸页翻到深处，" + evidence + "的虚实开始露出边角。",
            { energy: 1 },
            { tracks: mergeTracks(trackMap([evidence], -3), trackMap([deadline], -1)), tags: tagBag(["能吏"]) },
            ["能吏", "法度"],
            "旧牍被重新系好，案中最含混的一处已经能说出眉目。",
            0,
            ["能吏", "法度", "政务"],
            { records_found: 1 }
          ),
          choice(
            "probe_people",
            "请人递话，听暗处口风",
            "你让话先从" + group.name + "那边绕一圈回来。明面上只是问安，暗地里却试出谁急、谁怕、谁等着你失言。",
            { favor: 1 },
            { tracks: mergeTracks(trackMap([relationTrack], -3), trackMap([second], -1)), relations: relationEffect, tags: tagBag(["圆滑"]) },
            ["圆滑", "人情"],
            "几句不落纸面的回话送回案前，局面没有变轻，却有了可转圜的缝。",
            0,
            ["圆滑", "人情"]
          ),
          choice(
            "probe_public",
            "先稳公论，压住外声",
            "你把言路、士林和地方最急的声音先收拢起来：该安抚的安抚，该明示的明示，不让传言替你先判了这桩事。",
            { energy: 1 },
            { tracks: trackMap([publicTrack, second], -2), fame: { clean: 1 }, world: { publicMood: event.office === "county" ? 1 : 0, scholarOpinion: event.office !== "county" ? 1 : 0 }, tags: tagBag(["仁政", "清流"]) },
            ["仁政", "清流"],
            "人声稍稍退开，至少在你落笔之前，局外人不再只听最坏的版本。",
            0,
            ["仁政", "清流", "经术"]
          ),
          choice(
            "probe_pressure",
            "连夜申饬，先撬开缺口",
            "灯油烧到后半夜，你把人和账都压在案前。此法快，也锋利，锋利到旁人会记住首辅的手劲。",
            { energy: 1, pressure: 1 },
            { tracks: trackMap([first], -4), relations: hardRelation, fame: { cruel: 1, power: 1 }, tags: tagBag(["酷吏", "权谋"]) },
            ["酷吏", "权谋"],
            "最硬的一处被你撬动了，可屋里每个人都听见了木头开裂的声音。",
            1,
            ["权谋", "法度", "酷吏"],
            { forced_gap: 1 }
          )
        ]
      },
      {
        id: "settle",
        title: "定策落笔",
        desc: "底细已有眉目，接下来要把此事写成能承担后果的政令。",
        choices: [
          choice(
            "settle_procedure",
            "按制度定策，留足成例",
            "你把诏令、成例和责任次第排开，不让任何一方只凭声势改写章程。结论未必讨巧，却能经得起复看。",
            { energy: 1 },
            { tracks: mergeTracks(trackMap([first], -3), trackMap([second], -2)), fame: { competence: 1 }, world: { courtPressure: -1 }, tags: tagBag(["能吏"]) },
            ["能吏", "法度"],
            "批语落下时，章程像终于有了骨架，旁人再想添枝也难了些。",
            0,
            ["能吏", "法度", "政务"],
            { settled_by_law: 1 }
          ),
          choice(
            "settle_principle",
            "据实上陈，把话说到明处",
            "你没有把最难看的部分藏进套话里，而是把利害、风险和自己的判断一并写上去。清白不是退路，是代价。",
            { energy: 1 },
            { tracks: mergeTracks(trackMap([first], -2), trackMap([publicTrack], -3)), fame: { clean: 1 }, world: { emperorTrust: event.office === "hanlin" || event.office === "censor" ? 1 : 0, scholarOpinion: 1 }, tags: tagBag(["清流"]) },
            ["清流", "奏疏"],
            "话说到明处后，许多人不便再装作没看见，也有人从此记住你刺眼。",
            1,
            ["清流", "奏疏", "经术"],
            { public_mandate: 1 }
          ),
          choice(
            "settle_compromise",
            "分责留台阶，换各方退半步",
            "你把责任拆开，也把体面分出去。谁都不能说自己全胜，却也不必当场撕破脸。",
            { favor: 1 },
            { tracks: mergeTracks(trackMap([relationTrack], -4), trackMap([deadline], -1)), relations: relationEffect, fame: { clean: -1 }, resources: { pressure: -1 }, tags: tagBag(["圆滑"]) },
            ["圆滑", "人情"],
            "台阶搭好后，众人退得很慢，却总算开始后退。",
            0,
            ["圆滑", "人情"]
          ),
          choice(
            "settle_shadow",
            "走暗门，先把风波压下",
            "你接过那条不能写进公文的路：有人补账，有人递话，有人替你把最刺眼的一页暂时按住。",
            { money: event.office === "county" ? 1 : 0, pressure: 1 },
            { tracks: mergeTracks(trackMap([first, deadline], -3), trackMap([relationTrack], -2)), fame: { power: 1, clean: -1, corruption: event.office === "county" ? 1 : 0 }, addStain: stainForOffice(event.office), tags: tagBag(["权谋", event.office === "county" ? "贪腐" : "圆滑"]) },
            ["权谋", "贪腐"],
            "风波被压住了，可你知道有一页账只是换了地方存放。",
            2,
            ["权谋", "财赋", "人情"],
            { shadow_settlement: 1 }
          )
        ]
      }
    ];
  }

  GameData.events.forEach(function (event) {
    event.criticalTracks = critical[event.id] || Object.keys(event.tracks).slice(0, 2);
    event.failureHooks = hooks;
    event.reactions = [
      { source: "言路沸腾", add: { "言路沸腾": 1, "身后清算": 1 }, text: "言路借题发挥，身后清算的影子更近。" },
      { source: "内廷牵连", add: { "内廷牵连": 2 }, text: "外廷把内廷线索继续往深处说。" },
      { source: "部院迟滞", add: { "部院迟滞": 2, "考成压力": 1 }, text: "部院拖延文牍，考成压力更紧。" },
      { source: "地方抵制", add: { "清丈阻力": 1, "言路沸腾": 1 }, text: "地方把清丈阻力转成扰民之议。" },
      { source: "帝心未定", add: { "帝心未定": 1, "权势过盛": 1 }, text: "君前风向摇摆，权势之名更刺眼。" },
      { source: "身后清算", add: { "身后清算": 2 }, text: "旧账被人重新摊开，清算阴影加重。" }
    ];
    event.choiceStages = event.choiceStages && event.choiceStages.length ? event.choiceStages : buildChoiceStages(event);
  });
})();
