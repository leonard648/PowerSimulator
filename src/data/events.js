(function () {
  window.GameData = window.GameData || {};

  function ev(id, office, name, desc, tracks, participants, success, fail, weight) {
    return {
      id, office, name, desc, tracks, participants,
      success: success || "此事处置得体，名声稍振。",
      fail: fail || "此事拖延失据，后患渐生。",
      weight: weight || 1
    };
  }

  GameData.events = [
    ev("hanlin_edict", "hanlin", "修撰诏书争议", "中枢欲借新诏压下地方争议，翰林院内却有人担心文辞过重，伤及清议。", { "文辞未备": 7, "上意不明": 5, "清议沸腾": 5, "期限逼近": 3 }, ["皇帝", "士林", "同年"], "诏书成而不失分寸，你在近君与士林之间留下姓名。", "诏书仓促成文，既不合上意，也被士林讥为粉饰。"),
    ev("hanlin_lecture", "hanlin", "经筵讲读", "皇帝临御经筵，诸臣都等着看你如何借经义进言。话太浅则无名，话太切则危险。", { "文名不足": 6, "上意不明": 6, "派系阻挠": 4, "期限逼近": 3 }, ["皇帝", "座师", "政敌"], "讲读得体，皇帝记住了你的才学。", "讲读失衡，你被视为轻躁或庸钝。"),
    ev("hanlin_faction", "hanlin", "馆选派系暗涌", "同年与师门各有举荐名单，翰林清贵，却从来不清静。", { "举荐不足": 7, "派系阻挠": 6, "流言滋生": 5, "清议沸腾": 3 }, ["座师", "同年", "政敌"], "你没有被派系完全吞没，并获得一次稳固举荐。", "你在馆阁中被贴上派系标签。"),
    ev("hanlin_slander", "hanlin", "诗文招谤", "一首应制诗忽然流传宫外，有人称其讽上，有人称其清切。", { "流言滋生": 7, "上意不明": 5, "清议沸腾": 6, "文名不足": 3 }, ["皇帝", "士林", "政敌"], "流言转为文名，你的名声更响。", "诗名成了祸根，皇帝心中添了一分猜疑。"),
    ev("hanlin_mentor", "hanlin", "座师请托", "座师请你为一名门生润色奏疏。此事不大，却会让你站进某张网里。", { "派系阻挠": 5, "举荐不足": 5, "清议沸腾": 4, "期限逼近": 3 }, ["座师", "同年", "士林"], "你顾全师门而未失公论。", "请托之事外泄，清名受损。"),
    ev("hanlin_impeach_friend", "hanlin", "同年被参", "同年好友忽遭弹劾，请你代为转圜。案情真假未明，帮与不帮都要付代价。", { "证据不足": 6, "派系阻挠": 6, "清议沸腾": 4, "上意不明": 4 }, ["同年", "政敌", "皇帝"], "你保住同年，也没有把自己拖入泥中。", "同年之案牵连到你，往后朝局中多了一处软肋。"),

    ev("county_granary", "county", "县仓亏空案", "秋粮将至，账册称存粮充足，开仓却见大量亏空。上司限期补足，士绅暗示可共同遮掩。", { "钱粮缺口": 8, "证据不足": 6, "士绅掣肘": 5, "期限逼近": 4 }, ["地方士绅", "胥吏", "上司"], "亏空查明，虽树地方敌人，却得能名与清名。", "亏空未清，只能遮掩过关，污点埋入未来。", 2),
    ev("county_flood", "county", "夏汛决口", "连日暴雨，河堤漫决。百姓求赈，上司却催钱粮照旧。", { "灾情蔓延": 8, "民怨积累": 7, "钱粮缺口": 4, "期限逼近": 4 }, ["百姓", "上司", "胥吏"], "灾民得救，地方为你立碑请留。", "赈务失措，流民与谣言一起涌向县城。"),
    ev("county_lawsuit", "county", "豪族夺田讼案", "小民状告豪族侵田，证据散佚，乡绅已递来名帖。", { "证据不足": 7, "士绅掣肘": 7, "民怨积累": 5, "期限逼近": 3 }, ["地方士绅", "百姓", "胥吏"], "案子判得硬，百姓知县衙不是摆设。", "豪族退你一步，也从此记你一笔。"),
    ev("county_tax", "county", "钱粮催征", "考成将近，欠粮未完。严催可保官评，缓征可保民心。", { "钱粮缺口": 8, "民怨积累": 6, "胥吏欺瞒": 5, "上司追责": 4 }, ["上司", "胥吏", "百姓"], "钱粮与民心勉强两全，能吏之名渐起。", "钱粮未齐，上司评语里多了刺。"),
    ev("county_bandits", "county", "盗匪夜入乡市", "乡市被劫，捕快推诿，士绅要求先保大族庄院。", { "治安崩坏": 8, "胥吏欺瞒": 5, "士绅掣肘": 4, "民怨积累": 5 }, ["胥吏", "地方士绅", "百姓"], "盗匪平定，百姓稍安。", "盗匪未除，地方开始传你无能。"),
    ev("county_clerks", "county", "胥吏联手怠工", "你整顿太急，胥吏彼此通气，公文忽然处处卡住。", { "胥吏欺瞒": 8, "流程迟滞": 6, "上司追责": 5, "期限逼近": 3 }, ["胥吏", "上司", "幕友"], "属吏被压服，县政重新运转。", "胥吏不明着反你，却让所有事慢下来。"),

    ev("censor_corrupt_minister", "censor", "参劾权臣", "权臣门生遍布六部，罪证似有似无。士林催你出手，皇帝却态度暧昧。", { "证据不足": 8, "朋党反扑": 8, "上意不明": 6, "清议沸腾": 5 }, ["皇帝", "政敌", "士林"], "弹章命中，你名震台垣。", "弹劾反噬，你成了党争的靶子。", 2),
    ev("censor_border", "censor", "边饷冒领", "边镇奏称缺饷，户部账面却有重重虚冒。军功集团与户部互相推诿。", { "证据不足": 7, "钱粮缺口": 6, "派系阻挠": 7, "期限逼近": 4 }, ["边将", "户部", "政敌"], "边饷弊端被揭开，财政与军心暂得稳定。", "查边饷像摸刀口，你割伤了自己。"),
    ev("censor_palace", "censor", "内廷传旨疑云", "一道口谕绕开外廷，有人请你装作没看见，也有人盼你借机发难。", { "上意不明": 8, "派系阻挠": 5, "政敌反扑": 6, "清议沸腾": 4 }, ["皇帝", "内侍", "士林"], "你在皇权与制度之间留下谨慎一笔。", "口谕变成陷阱，你进退失据。"),
    ev("censor_exam_scandal", "censor", "科场舞弊案", "新科放榜，坊间传出关节与夹带。你的座师也被流言卷入。", { "证据不足": 8, "流言滋生": 7, "派系阻挠": 6, "上意不明": 3 }, ["座师", "同年", "士林"], "科场案查到该止之处，你保住公论。", "舞弊案牵出师门，你被迫在公义与恩义间失血。"),
    ev("censor_reform", "censor", "税制改革廷议", "中枢欲推新税法，清流疑其扰民，实政派嫌其太缓。你被推到廷议中央。", { "上意不明": 6, "清议沸腾": 7, "派系阻挠": 7, "民怨积累": 5 }, ["皇帝", "士林", "政敌"], "改革得以试行，你也背上争议。", "廷议失控，改革与名声一起受损。"),
    ev("censor_final_purge", "censor", "清算风声", "十二年仕途将尽，旧案、门生、密折、亏空都被人重新翻出。", { "政敌反扑": 9, "证据不足": 5, "上意不明": 8, "清议沸腾": 6 }, ["皇帝", "政敌", "士林"], "你熬过清算，身后评价仍有余地。", "旧账合流，生前功名被晚年的阴影吞没。")
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
    relationEv("rel_secret_mandate", "密旨试探", "皇帝忽命内侍传来一件不入外朝的差遣。做得好，是近君恩遇；做得急，便像内外交结。", { "上意不明": 7, "清议沸腾": 5, "政敌反扑": 4, "期限逼近": 3 }, ["皇帝", "内侍", "政敌"], "密旨办得有分寸，皇帝对你多记一笔。", "密旨成了把柄，外廷与宫中都有人开始盯你。", "皇帝信任高", {
      success: { merit: 4, world: { emperorTrust: 2 }, relations: { emperor: { trust: 1, suspicion: -1 } }, fame: { power: 1 } },
      partial: { merit: 1, relations: { emperor: { suspicion: 1 } }, resources: { pressure: 1 } },
      fail: { world: { emperorTrust: -1, factionHeat: 1 }, relations: { emperor: { suspicion: 2 } }, addStain: "inner_palace_contact" }
    }),
    relationEv("rel_vermilion_suspicion", "朱批疑云", "一道朱批忽然圈出你旧日奏疏里的两句。无人明说罪名，但所有人都知道这不是寻常问话。", { "上意不明": 9, "证据不足": 5, "政敌反扑": 6, "清议沸腾": 4 }, ["皇帝", "政敌", "士林"], "你把疑处说清，君前暂得转圜。", "朱批落下后，你的名字被放进另一册薄薄的簿子里。", "皇帝猜忌", {
      success: { merit: 2, world: { emperorTrust: 1 }, relations: { emperor: { suspicion: -2 } } },
      partial: { relations: { emperor: { suspicion: 1 } }, resources: { pressure: 1 } },
      fail: { merit: -6, world: { emperorTrust: -2, courtPressure: 1 }, relations: { emperor: { suspicion: 3 }, rival: { resentment: 1 } }, resources: { pressure: 2 }, demote: true }
    }),
    relationEv("rel_framed_case", "罗织旧案", "政敌把几件不相干的旧案钉在一起，像织网一样慢慢收紧。最毒的地方，是每一根线都曾碰过你的手。", { "政敌反扑": 10, "证据不足": 7, "流言滋生": 6, "上意不明": 5 }, ["政敌", "皇帝", "士林"], "你拆开旧案线头，反让对手露了急相。", "旧案越辩越浑，连清白二字也变得费力。", "政敌怨恨", {
      success: { merit: 3, relations: { rival: { resentment: -2, fear: 1 } }, fame: { clean: 1 } },
      partial: { resources: { pressure: 2 }, relations: { rival: { resentment: 1 } } },
      fail: { merit: -8, resources: { pressure: 3 }, world: { factionHeat: 2, emperorTrust: -1 }, relations: { rival: { resentment: 2 }, emperor: { suspicion: 2 } }, addStain: "withheld_file" },
      fatalOnFail: "framed_execution"
    }),
    relationEv("rel_scholar_support", "清议拥戴", "书院诸生联名为你称颂，清议一时如潮。它能托起你，也能把你推到君前最刺眼的位置。", { "清议沸腾": 8, "上意不明": 5, "派系阻挠": 5, "流言滋生": 4 }, ["士林", "皇帝", "政敌"], "清议为你所用，没有越过君臣分寸。", "清议太盛，反叫宫中疑你邀名结党。", "士林亲近", {
      success: { merit: 4, fame: { clean: 2, literary: 1 }, world: { scholarOpinion: 2 } },
      partial: { fame: { clean: 1 }, relations: { emperor: { suspicion: 1 } } },
      fail: { world: { courtPressure: 2, factionHeat: 1 }, relations: { emperor: { suspicion: 2 }, scholars: { resentment: 1 } }, resources: { pressure: 1 } }
    }),
    relationEv("rel_public_backlash", "公论反噬", "旧日几句话被士林重新翻出，原本替你鼓噪的人，如今也等着看你如何自证。", { "清议沸腾": 9, "流言滋生": 7, "上意不明": 4, "期限逼近": 3 }, ["士林", "同年", "政敌"], "你稳住公论，让非议止于纸面。", "公论翻脸比政敌更快，清名被剥去一层。", "士林怨恨", {
      success: { merit: 2, world: { scholarOpinion: 1 }, relations: { scholars: { resentment: -2 } } },
      partial: { fame: { clean: -1 }, resources: { pressure: 1 } },
      fail: { fame: { clean: -2 }, world: { scholarOpinion: -2, factionHeat: 1 }, relations: { scholars: { resentment: 2 }, rival: { resentment: 1 } } }
    }),
    relationEv("rel_gentry_circle", "乡绅合围", "地方大族终于不再各自递帖，而是同日闭门。钱粮、诉讼、赈务，忽然处处少一只手。", { "士绅掣肘": 10, "钱粮缺口": 7, "民怨积累": 5, "期限逼近": 4 }, ["地方士绅", "百姓", "上司"], "你破开地方合围，至少让县衙还能发号施令。", "士绅不必明着抗命，只要让每件事慢半拍。", "士绅怨恨", {
      success: { merit: 3, relations: { gentry: { resentment: -2, fear: 1 } }, fame: { competence: 1 } },
      partial: { world: { fiscalHealth: -1 }, relations: { gentry: { resentment: 1 } } },
      fail: { world: { fiscalHealth: -2, publicMood: -1 }, relations: { gentry: { resentment: 2 }, superior: { trust: -1 } }, resources: { pressure: 1 } }
    }),
    relationEv("rel_clerk_trap", "文书陷阱", "胥吏把几件文书照规矩送上来，章程无错，时辰无错，错处却像专等你签押之后才会显形。", { "胥吏欺瞒": 10, "流程迟滞": 7, "证据不足": 5, "上司追责": 4 }, ["胥吏", "上司", "幕友"], "你识破文书陷阱，属吏一时不敢再欺。", "你在一纸公文上失手，往后每件案卷都更滑。", "胥吏怨恨", {
      success: { merit: 3, relations: { clerks: { resentment: -2, fear: 1 } }, fame: { competence: 1 } },
      partial: { relations: { clerks: { resentment: 1 } }, resources: { pressure: 1 } },
      fail: { relations: { clerks: { resentment: 2 } }, world: { courtPressure: 1 }, resources: { pressure: 2 }, flags: { clerk_trap: 1 } }
    }),
    relationEv("rel_school_pressure", "师门逼请", "座师与同年同时来信，请你替一桩不干净的事说句话。恩义是真的，坑也是真的。", { "派系阻挠": 8, "清议沸腾": 6, "流言滋生": 5, "上意不明": 4 }, ["座师", "同年", "士林"], "你既还了恩义，也没有把自己全押进去。", "师门恩义变成牵连，你从此难说自己置身事外。", "师门亏欠", {
      success: { merit: 2, resources: { favor: 2 }, relations: { mentor: { debt: -2 }, peers: { debt: -1 } } },
      partial: { resources: { favor: 1 }, fame: { clean: -1 }, relations: { mentor: { debt: -1 } } },
      fail: { fame: { clean: -2 }, world: { factionHeat: 1 }, relations: { mentor: { resentment: 1 }, peers: { resentment: 1 } }, addStain: "protege_scandal" }
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
    npcEv("npc_shen_recommend", "shen_ruhui", "hanlin", "座师荐人", "沈如晦遣人送来一封门生名帖，望你在馆阁中为其润色铺路。小事一桩，却会把你的名声写进师门账里。", { "派系阻挠": 7, "清议沸腾": 5, "期限逼近": 4, "举荐不足": 5 }, ["沈如晦", "座师", "士林"], "你替师门留了体面，也没有把自己卖得太深。", "荐人之事传开，旁人开始把你看作师门爪牙。", "沈如晦请托", {
      success: { merit: 3, addCard: "npc_mentor_letter", npcs: { shen_ruhui: { bond: 2, debt: -1, trust: 1 } }, relations: { mentor: { debt: -1, closeness: 1 } }, resources: { favor: 1 } },
      partial: { merit: 1, npcs: { shen_ruhui: { debt: -1, bond: 1 } }, resources: { favor: 1 }, fame: { clean: -1 } },
      fail: { merit: -2, addStain: "protege_scandal", npcs: { shen_ruhui: { resentment: 2, trust: -1 } }, relations: { mentor: { resentment: 1 } }, fame: { clean: -1 } }
    }),
    npcEv("npc_gu_rescue", "gu_yuanheng", "hanlin", "同年求援", "顾元衡夜里来访，说自己被人抓住一句诗文破绽。救他，会牵动同年；不救，他会记你一生。", { "流言滋生": 8, "证据不足": 5, "派系阻挠": 5, "清议沸腾": 4 }, ["顾元衡", "同年", "政敌"], "你替顾元衡拆开流言，同年之谊更稳。", "援手迟疑，顾元衡脱身不净，也把怨气留给你。", "顾元衡求援", {
      success: { merit: 2, addCard: "npc_peer_alliance", npcs: { gu_yuanheng: { bond: 2, debt: -1, trust: 1 } }, relations: { peers: { closeness: 1, debt: -1 } } },
      partial: { npcs: { gu_yuanheng: { bond: 1, debt: -1 } }, relations: { peers: { debt: -1 } }, resources: { pressure: 1 } },
      fail: { npcs: { gu_yuanheng: { resentment: 2, trust: -1 } }, relations: { peers: { resentment: 1 } }, fame: { clean: -1 } }
    }),
    npcEv("npc_ye_joint_name", "ye_shenyan", "hanlin", "清流联名", "叶慎言邀你同署一封清议公疏。若署名，清名可振；若失手，君前也会记得你站得太直。", { "清议沸腾": 8, "上意不明": 6, "派系阻挠": 5, "期限逼近": 3 }, ["叶慎言", "士林", "皇帝"], "联名没有失控，清流中多了一席你的名字。", "清议太直，宫中与同僚都觉得你不好收拾。", "叶慎言邀名", {
      success: { merit: 3, addCard: "npc_academy_voice", npcs: { ye_shenyan: { bond: 2, trust: 1 } }, world: { scholarOpinion: 1 }, fame: { clean: 1 } },
      partial: { npcs: { ye_shenyan: { bond: 1 } }, relations: { emperor: { suspicion: 1 } }, fame: { clean: 1 } },
      fail: { npcs: { ye_shenyan: { resentment: 1 } }, world: { emperorTrust: -1, factionHeat: 1 }, resources: { pressure: 1 } }
    }),
    npcEv("npc_wei_probe", "wei_chengbi", "hanlin", "设局试探", "魏承弼忽然替你转来一份旧稿，语气客气得反常。稿中藏着几处可杀人的字眼。", { "流言滋生": 8, "证据不足": 6, "政敌反扑": 6, "上意不明": 4 }, ["魏承弼", "政敌", "皇帝"], "你看破试探，反让魏承弼露出心急。", "旧稿流入宫中，你的名字被人轻轻圈住。", "魏承弼设局", {
      success: { merit: 2, npcs: { wei_chengbi: { resentment: -1, trust: -1 } }, relations: { rival: { resentment: -1, fear: 1 } }, fame: { clean: 1 } },
      partial: { npcs: { wei_chengbi: { resentment: 1 } }, resources: { pressure: 1 } },
      fail: { npcs: { wei_chengbi: { resentment: 3 } }, relations: { rival: { resentment: 2 }, emperor: { suspicion: 1 } }, resources: { pressure: 2 } }
    }),
    npcEv("npc_zhao_quota", "zhao_tingzan", "county", "考成催逼", "赵廷瓒连发三道府札，催你把钱粮与积案一并压下。能办成，是上司赏识；办砸了，就是替他背锅。", { "上司追责": 8, "钱粮缺口": 7, "流程迟滞": 5, "期限逼近": 5 }, ["赵廷瓒", "上司", "胥吏"], "考成压住，赵廷瓒终于在批语里少写了两句刺话。", "你替府台挡了火，火灰却落在自己身上。", "赵廷瓒催考", {
      success: { merit: 4, npcs: { zhao_tingzan: { trust: 2, bond: 1 } }, relations: { superior: { trust: 2 } }, fame: { competence: 1 } },
      partial: { merit: 1, npcs: { zhao_tingzan: { trust: 1, debt: 1 } }, resources: { pressure: 1 } },
      fail: { merit: -4, npcs: { zhao_tingzan: { resentment: 2, trust: -1 } }, relations: { superior: { trust: -2 } }, resources: { pressure: 2 } }
    }),
    npcEv("npc_lin_bargain", "lin_boheng", "county", "乡绅交易", "林伯珩愿意先拨粮券，却要县衙在清丈田亩上缓一缓。你看得出这是交易，也看得出百姓正在等粮。", { "士绅掣肘": 8, "钱粮缺口": 8, "民怨积累": 5, "清议沸腾": 4 }, ["林伯珩", "地方士绅", "百姓"], "粮券入仓，地方暂时肯让县衙说话。", "粮到了，话柄也到了，地方规矩又压近一步。", "林伯珩交易", {
      success: { merit: 3, addCard: "npc_gentry_grain", npcs: { lin_boheng: { bond: 2, debt: 1, trust: 1 } }, relations: { gentry: { closeness: 1, debt: 1 } }, resources: { money: 1 } },
      partial: { npcs: { lin_boheng: { debt: 1, bond: 1 } }, fame: { clean: -1 }, resources: { money: 1 } },
      fail: { npcs: { lin_boheng: { resentment: 2 } }, relations: { gentry: { resentment: 2 } }, world: { publicMood: -1 } }
    }),
    npcEv("npc_cao_account", "cao_heng", "county", "账房暗门", "曹衡暗示账房还有一本不入册的旧簿。要他开口，得给他台阶；逼得太急，整座县衙都会装聋。", { "胥吏欺瞒": 9, "证据不足": 6, "流程迟滞": 6, "上司追责": 4 }, ["曹衡", "胥吏", "幕友"], "曹衡交出旧簿，账房里的门暂时向你开了一道缝。", "旧簿只露半页，曹衡知道你还离不开他。", "曹衡试探", {
      success: { merit: 3, addCard: "npc_clerk_eyes", npcs: { cao_heng: { bond: 2, resentment: -1, trust: 1 } }, relations: { clerks: { resentment: -1, fear: 1 } } },
      partial: { npcs: { cao_heng: { debt: 1, bond: 1 } }, relations: { clerks: { debt: 1 } } },
      fail: { npcs: { cao_heng: { resentment: 3 } }, relations: { clerks: { resentment: 2 } }, world: { courtPressure: 1 } }
    }),
    npcEv("npc_cheng_plan", "cheng_jie", "county", "幕友献策", "程介替你写出三条路：一条得名，一条得财，一条得罪人。他不替你选，只把代价摆在灯下。", { "流程迟滞": 7, "案卷迟滞": 6, "期限逼近": 5, "上司追责": 4 }, ["程介", "幕友", "上司"], "你采纳程介筹策，乱局被拆成可办的几步。", "策是好策，只是人心未必肯照算式走。", "程介献策", {
      success: { merit: 3, addCard: "npc_adviser_plan", npcs: { cheng_jie: { bond: 2, trust: 1 } }, fame: { competence: 1 } },
      partial: { merit: 1, npcs: { cheng_jie: { bond: 1 } }, resources: { pressure: -1 } },
      fail: { npcs: { cheng_jie: { resentment: 1 } }, resources: { pressure: 1 }, fame: { competence: -1 } }
    }),
    npcEv("npc_emperor_private", "jinghe_emperor", "censor", "御前私问", "景和帝屏退左右，只问你一句：若天下人都说该参，朕是否也该信？这不是问策，是问你站在哪里。", { "上意不明": 9, "清议沸腾": 6, "政敌反扑": 5, "期限逼近": 3 }, ["景和帝", "皇帝", "政敌"], "你答得不卑不亢，景和帝记住的是分寸。", "御前一问后，皇帝记住的不是你的答案，而是你的危险。", "景和帝私问", {
      success: { merit: 4, npcs: { jinghe_emperor: { trust: 2, bond: 1 } }, world: { emperorTrust: 2 }, relations: { emperor: { suspicion: -1 } } },
      partial: { merit: 1, npcs: { jinghe_emperor: { trust: 1 } }, relations: { emperor: { suspicion: 1 } } },
      fail: { merit: -4, npcs: { jinghe_emperor: { resentment: 2, trust: -1 } }, relations: { emperor: { suspicion: 3 } }, resources: { pressure: 2 } }
    }),
    npcEv("npc_feng_whisper", "feng_jin", "censor", "宫门风声", "冯谨在宫门外停了半步，像是无意说出内廷风向。消息可以救你，也可以证明你不该知道。", { "上意不明": 8, "政敌反扑": 5, "清议沸腾": 5, "证据不足": 4 }, ["冯谨", "内侍", "皇帝"], "宫门风声来得正好，你借它避开一处暗坑。", "风声传得太准，反倒像内外交结。", "冯谨递话", {
      success: { merit: 2, addCard: "npc_palace_whisper", npcs: { feng_jin: { bond: 2, debt: 1, trust: 1 } }, world: { emperorTrust: 1 } },
      partial: { npcs: { feng_jin: { debt: 1, bond: 1 } }, world: { scholarOpinion: -1 } },
      fail: { addStain: "inner_palace_contact", npcs: { feng_jin: { resentment: 1 } }, relations: { emperor: { suspicion: 2 } }, resources: { pressure: 1 } }
    }),
    npcEv("npc_tao_impeach", "tao_wendao", "censor", "清议逼参", "陶闻道以书院名义送来证词，催你参劾一名权贵。若不动笔，士林会问你是不是怕了。", { "清议沸腾": 9, "证据不足": 6, "朋党反扑": 6, "上意不明": 4 }, ["陶闻道", "士林", "政敌"], "你让清议与证据并行，陶闻道没有白等。", "清议逼得太急，证据还没跟上，反扑已经先到。", "陶闻道逼参", {
      success: { merit: 4, addCard: "npc_academy_voice", npcs: { tao_wendao: { bond: 2, trust: 1 } }, world: { scholarOpinion: 2 }, fame: { clean: 1 } },
      partial: { npcs: { tao_wendao: { bond: 1 } }, world: { scholarOpinion: 1 }, resources: { pressure: 1 } },
      fail: { npcs: { tao_wendao: { resentment: 2 } }, relations: { scholars: { resentment: 1 } }, world: { factionHeat: 1 }, resources: { pressure: 2 } }
    }),
    npcEv("npc_yan_invite", "yan_shao", "censor", "权臣投帖", "严绍送来名帖，字少而意重：入我门，旧案可平；不入门，旧案也可重开。", { "朋党反扑": 9, "政敌反扑": 7, "上意不明": 5, "清议沸腾": 5 }, ["严绍", "权臣", "政敌"], "你接住名帖却没有入网，严绍暂时收手。", "权臣门路太宽，你走了一步，身后便多了影子。", "严绍投帖", {
      success: { merit: 3, npcs: { yan_shao: { resentment: -1, trust: 1 } }, relations: { rival: { resentment: -1 } }, fame: { power: 1 } },
      partial: { addCard: "npc_power_path", npcs: { yan_shao: { debt: 1, bond: 1 } }, fame: { power: 1, clean: -1 } },
      fail: { addStain: "protege_scandal", npcs: { yan_shao: { resentment: 3 } }, relations: { rival: { resentment: 2 } }, world: { factionHeat: 2 } }
    })
  ]);

  function detail(background, scene, conflict, historicalWeight) {
    return { background: background, scene: scene, conflict: conflict, historicalWeight: historicalWeight };
  }

  GameData.eventDetails = {
    hanlin_edict: detail(
      "新诏所涉并非一县一府之争，而是中枢想借文书重新规定地方官与士绅、百姓之间的边界。诏书一出，天下州县都会照着字句揣摩风向。",
      "翰林院里灯火未熄，几份草稿在案上反复传看。有人要辞气严峻，有人要为将来留余地，连删去一个虚字都像是在替朝廷选择姿态。",
      "难处在于你既要写出皇帝能用的威严，又不能把士林清议逼到对立处。文字看似柔软，落到地方便会变成催科、问罪和申辩的凭据。",
      "史书写诏书，常只录成文；传主若在其中留名，后人看的却是他如何在君命与公论之间安放自己的笔。"
    ),
    hanlin_lecture: detail(
      "经筵不是单纯讲书，而是朝廷用儒义试探臣子、臣子借经义试探皇帝的地方。讲得太平，会被视为无骨；讲得太峭，又像借古讽今。",
      "御座之前，讲案、注本、随侍诸臣都已排定。你的声音不高，却能被每个等着记错处的人听见。",
      "此局最怕才学不足以托住锋芒，也怕上意未明时误把进言说成逼问。每一句经义背后，都藏着对现实政务的暗指。",
      "一场讲读不会立刻改朝局，却会决定你在君前是可记之才、可用之臣，还是只会把书读成祸端的清客。"
    ),
    hanlin_faction: detail(
      "馆选本该以文章定高下，实际却牵着师门、同年、部院和内阁的旧账。谁被举荐，谁被压下，往往预示日后朝局里会站在哪一边。",
      "名单尚未公开，传言已先在廊下转了几圈。每个人都说自己只论才学，袖中却都有一两张不能让人看见的名帖。",
      "你若全拒人情，便少了托举；若全靠人情，又会被贴上派系标签。举荐不足与派系阻挠并行，正是清贵衙门最不清贵的地方。",
      "日后传记提起早年馆阁，往往会从这类小名单写起，因为许多大案的根，其实在此时已经埋下。"
    ),
    hanlin_slander: detail(
      "应制诗本是粉饰太平的文字，却最容易被人从字缝里找出讽意。宫中、士林与政敌各取所需，能把一首诗说成清名，也能说成罪证。",
      "诗稿不知从哪一只袖中流出，传到宫外时已经多了几句评语。有人替你叫好，有人替你担忧，更多人只是在等皇帝是否皱眉。",
      "流言滋生与上意不明互相推高：你越急着解释，越像心中有鬼；你若不解释，旁人又会替你补完一个更险的版本。",
      "文名在官场不是闲名。它能给人护身的光，也能让每一次失言都被照得格外清楚。"
    ),
    hanlin_mentor: detail(
      "座师请托表面是润色奏疏，背后却是师门如何延续势力、如何安排年轻门生的惯常手法。此类小事从不写进公文，却常写进人情账。",
      "来人说得极客气，只称先生念你文章老成，愿请你顺手一改。那封奏疏薄薄几页，压在案上却像压着整个师门的眼色。",
      "你若推辞，师门会觉得你忘恩；你若应承，士林又会疑你为私门奔走。分寸难处不在文字，而在你到底替谁开路。",
      "史传里所谓门生故吏，多由这种不起眼的请托积成。你今日替人添一字，明日或许就要替这一个字作证。"
    ),
    hanlin_impeach_friend: detail(
      "同年被参，往往不只是一人得失。科名把一榜人拴在同一张网里，某人落水，其余人即使站在岸上也会湿了鞋。",
      "好友来得匆忙，连衣角都带着夜雨。他说案情尚未坐实，只求你代为递一句话，可你知道一句话也会留下痕迹。",
      "帮他会被政敌看成同党，不帮则会让同年圈子寒心。证据未明时，恩义和自保都显得理直气壮，也都显得亏心。",
      "后人看官员早年交游，常从同年之谊判断其一生人脉。此事若写进生平，写的不是一场救援，而是你怎样理解同榜二字。"
    ),
    county_granary: detail(
      "县仓亏空不是单纯少了几石粮，而是多年报损、借支、遮掩和地方交易堆出的洞。秋粮将至，洞若补不上，便会吞掉官声与民命。",
      "仓门打开时，灰尘先落下来，随后才是空囤和错账。胥吏低头称旧例如此，士绅递话说可先填账面，上司的限期却一日比一日近。",
      "你可以查到底，也可以遮掩过关。前者会得罪地方既得之人，后者会让污点留在你自己的履历里，等将来被人翻出。",
      "地方官传记最看钱粮。仓廪清不清，常比一篇漂亮判词更能决定后人如何称你。"
    ),
    county_flood: detail(
      "夏汛决口牵动的不只河堤，还有钱粮、民心与上司考成。救灾要银米，银米一动，账册便会露出旧病。",
      "雨声压过鼓声，百姓拥在县衙外等粥棚和船只。府里札子却仍按旧日程催缴，像灾水从未淹过田地。",
      "若先救民，财政与考成会吃紧；若先保账面，民怨会在水退后留下更深的泥印。灾情蔓延时，每一次迟疑都会变成流亡名单。",
      "救荒之政最能入民间记忆。朝廷或许只看报销格式，地方却会记得谁在水中开仓，谁在堂上算账。"
    ),
    county_lawsuit: detail(
      "豪族夺田案常年积压，状纸只是最后露出的那一角。田亩、族谱、旧契、佃户口供纠缠在一起，牵一处便会动整乡规矩。",
      "小民跪在堂下，手里攥着被水浸过的旧契；乡绅的名帖则干净平整，先一步摆到了你的案头。",
      "证据散佚让公义显得软弱，士绅掣肘又让判决不可能只靠律例。你判得轻，百姓失望；判得重，地方大族从此记你。",
      "一县政声常由几桩讼案传开。史书或许只记判语，民间记的却是县衙那日有没有替弱者说话。"
    ),
    county_tax: detail(
      "钱粮催征是地方官最常见也最消磨人的考题。欠粮背后有灾歉、有豪右拖延，也有胥吏趁机加派。",
      "催科簿摆在堂上，数字像一排冷脸。上司要限期，百姓求宽缓，胥吏只问你准备用哪一种名目催下去。",
      "严催能保官评，却会把民怨推高；缓征能保一时民心，却可能让你在府台眼里成了无能之官。",
      "后世评价地方官，常在能吏与酷吏之间摇摆。钱粮一事，正是这条界线最容易被踩乱的地方。"
    ),
    county_bandits: detail(
      "盗匪夜入乡市，往往说明地方秩序已有裂缝。若只是捉几个贼，治安还会再坏；若追根查去，又会碰到差役、豪族和赃物流向。",
      "被劫的铺户挤在堂外，捕快却把话说得含糊。士绅要求先护庄院，百姓却问为何巡夜总绕开大族田庄。",
      "治安崩坏与胥吏欺瞒互相遮掩，你越想快办，越容易被推向只抓替罪之人；你若细查，地方又嫌你拖延。",
      "一任知县若不能保市井夜安，再多仁政也会显得虚。治安案写进传记，写的是官府还能不能让人信服。"
    ),
    county_clerks: detail(
      "胥吏联手怠工，是旧衙门对新官最惯熟的反击。公文仍按规矩走，只是每一步都慢半拍，慢到责任最终落在你身上。",
      "清晨开印时，案卷少了一份，传票迟了一刻，书吏们都说不是故意。整个县衙像一架被暗中拆松的木机。",
      "你若强压，胥吏会更会装聋；你若宽纵，县政便会被他们重新握住。流程迟滞看似琐碎，实则最能消磨官威。",
      "传记里少写胥吏，却处处有胥吏的影子。能否驾驭旧吏，常决定一名地方官是做事，还是被事推着走。"
    ),
    censor_corrupt_minister: detail(
      "参劾权臣不是一纸弹章能够了结的事。权臣门生在六部、科道、地方皆有根脚，罪证每露一寸，反扑便多一层。",
      "台垣同僚催你落笔，士林已在外面造势，宫中却没有给出准话。你看见的是证据，别人看见的是站队。",
      "证据不足会让清议变成空喊，朋党反扑又会把你从弹劾者变成被审视者。此局不是问你敢不敢，而是问你拿什么敢。",
      "御史之名往往由一两封弹章定型。命中者为直臣，失手者为党争之器，差别有时只在一条证链。"
    ),
    censor_border: detail(
      "边饷冒领牵涉军心与财政，远比普通钱粮案危险。边镇说缺饷，户部说已拨，账册之间藏着将领、粮商和部院的旧关系。",
      "送来的账册厚而整齐，整齐得叫人不安。每一笔饷银都有印信，每一个印信背后又都有能说话的人。",
      "你若查得太浅，只会被边将与户部互相推开；查得太深，则可能被说成动摇军心。证据和时机必须同时站稳。",
      "边务案入传，往往比内廷案更显分量。它说明传主处理的不只是官场恩怨，还有国家筋骨。"
    ),
    censor_palace: detail(
      "内廷口谕绕开外廷，是制度与皇权之间最细也最险的一道缝。看见它的人若沉默，像默认；若发难，又像逼宫。",
      "消息从宫门出来时没有正式文书，只有几句被转述的口风。内侍称只是传达圣意，外廷却已经有人等着你如何定名。",
      "上意不明使每一步都可能反噬，政敌反扑则会把制度之争说成你借题邀名。你要守规矩，却不能显得不敬君上。",
      "史家最爱从此类事里看臣子的分寸。太软则为顺从，太硬则为躁进，能留名者往往只多半步清醒。"
    ),
    censor_exam_scandal: detail(
      "科场舞弊案连着士子命运与朝廷取士根基，一旦坐实，牵涉者不会止于考官。座师、同年、门生都有可能被流言卷入。",
      "放榜后的喜气尚未散尽，坊间已传出夹带、关节和暗号。你收到的证词半真半假，最刺眼的是其中竟提到熟人的名字。",
      "查浅了，士林说你护短；查深了，师门可能被拖进泥中。证据不足时，每一个名字都既像线索，也像陷阱。",
      "科场案写进传记，等于把传主放在公义与恩义的交叉处。后人未必知道真相，却会记得你查到哪里停手。"
    ),
    censor_reform: detail(
      "税制改革廷议表面争的是制度，实际争的是各派能否借新法重分权责。清流怕扰民，实政派怕太缓，皇帝怕无人担责。",
      "廷上言官、部臣、阁臣轮番开口，话里都有百姓，话外都有自己。你被推到中间，是因为各方都需要一个可攻可用的人。",
      "上意不明时，改革是功也是罪；派系阻挠中，任何折中都可能被说成骑墙。民怨若被带入廷议，纸上新法便会有血肉重量。",
      "改革之议最能显出一名官员的政治性格。史书未必评新法成败，却会评你在风口上是否只顾保身。"
    ),
    censor_final_purge: detail(
      "清算风声是十二年旧账的总回潮。曾经救过你的人、害过你的人、你欠过的人，都可能把旧案重新摆到灯下。",
      "案头忽然多出许多旧名目：门生、密折、亏空、弹章、荐札。每一桩都曾在当年被压下，如今却像约好了一起醒来。",
      "政敌反扑与上意不明相合，最容易把功劳改写成罪证。你越有声名，清算者越能从声名里找到可疑之处。",
      "终局清算决定的不是一季胜负，而是整段仕途能否被后人解释为一贯。传主的晚年，常会反过来改写他的早年。"
    ),
    rel_secret_mandate: detail(
      "密旨试探源于君臣之间的额外通道。它绕开外廷，却不绕开责任；一旦失败，所有受命都会被说成私交。",
      "内侍来得很轻，连随从都被留在门外。话不多，却足够让你明白此事不宜写进寻常公文。",
      "做成了，是皇帝把你视作可用之人；做急了，是你与宫中往来过密。近君恩遇和内外交结只隔一层说法。",
      "这类事若入传，往往成为后人判断传主权名的证据：他究竟是被信任，还是已经走进权力的阴影。"
    ),
    rel_vermilion_suspicion: detail(
      "朱批疑云不是普通责问，而是皇帝把你旧日文字重新拿出来审视。文字一旦被朱笔圈住，原意便不再由你完全决定。",
      "内阁抄件传来时，旁人都装作没看见朱圈位置。你却知道那两句若解释不清，会牵出此前许多奏疏。",
      "上意不明使辩解没有固定方向，政敌反扑则会帮皇帝补齐疑心。你要说明白，又不能显得急于自保。",
      "传记里写朱批，写的是君前信用的裂纹。一道红痕，常比一百句流言更能改变仕途走向。"
    ),
    rel_framed_case: detail(
      "罗织旧案是政敌怨恨积久后的手段。几件看似不相干的小案被穿成一串，便能让清白之人也显得行迹可疑。",
      "案卷摊开时，每一处签押都是真的，每一个日期也都能对上。危险正在于它们不全是假。",
      "你要拆的是叙事，而不只是证据。若拆不开，政敌便能替你写出另一种人生：你从来不是失手，而是早有预谋。",
      "旧案成败常决定身后名。史家最怕材料连成一线，因为一旦成线，后来所有善举也会被重新解释。"
    ),
    rel_scholar_support: detail(
      "清议拥戴看似助力，实则也是一种推举与胁迫。士林把你托高，同时也要求你不能低头、不能转圜、不能失望他们。",
      "书院诸生联名送来的颂词已经在城中传开，茶肆甚至比官署更早知道你的名字。声势来得快，也来得响。",
      "你若借势过猛，皇帝会疑你邀名；你若不用，士林会觉得你辜负公论。清名在此时像火，可照路，也可燎身。",
      "后世称孤臣，多从清议拥戴写起。但清议不是身后才有的赞语，它在生前常先是一种压力。"
    ),
    rel_public_backlash: detail(
      "公论反噬说明士林从拥戴转为审判。旧日几句话被重新翻出，赞誉会倒过来成为质问你的证词。",
      "原本替你传名的人，如今在等你自证。那些曾经漂亮的说法，被人逐字拆开，像拆一件旧衣。",
      "流言滋生与清议沸腾相合时，解释越多越像狡辩，沉默越久越像承认。你面对的不只是政敌，而是曾经期待你的人。",
      "传主若要有完整生平，就不能只有被称颂的时刻。公论翻脸处，最能看见他是否仍能守住自己的说法。"
    ),
    rel_gentry_circle: detail(
      "乡绅合围是地方社会对县衙的集体试探。大族不必抗命，只要在粮、役、讼、赈几处同时慢下来，官府便会显得失灵。",
      "一日之内，几家大户都称病闭门。粮车不来，证人不到，义仓钥匙也恰好找不见。",
      "你若让步，地方规矩会压过官府规矩；你若硬破，钱粮和民心都可能被牵连。士绅掣肘的可怕，在于它从不只发生在一个案子里。",
      "地方官的传记若写得扎实，必然要写他与士绅的角力。谁能让县衙发号施令，谁才真正在一县立住。"
    ),
    rel_clerk_trap: detail(
      "文书陷阱是胥吏怨恨升高后的精细反击。他们不与官争，只把错处藏在章程、时限和旧例的夹缝里。",
      "送来的文书干净得反常，印信、年月、签押无一不齐。你越看越觉得它像一张已经合上的网。",
      "若识破，旧吏会知道你不是只会坐堂的新官；若失手，往后每一纸公文都能成为他们拿捏你的凭据。",
      "案牍小错往往不入史书，却能改变一生史评。许多所谓无能，并非不会判断，而是先败给了文书。"
    ),
    rel_school_pressure: detail(
      "师门逼请是恩义累积后的回收。座师和同年不会明说要你徇私，只说请你替旧情留一句余地。",
      "两封信几乎同时抵达，一封称师门体面，一封称同榜情义。措辞不同，指向却一样。",
      "你若全拒，便像忘本；你若全应，清名会被牵进师门旧账。恩义最难处，在于它往往是真的，坑也是真的。",
      "一个官员的传记若没有人情债，便不像真实仕途。此事会告诉后人，你如何在欠情与守法之间自处。"
    ),
    npc_shen_recommend: detail(
      "沈如晦的荐人并非临时起意，而是师门延续影响力的一环。门生能否在馆阁露面，决定师门来年的声气。",
      "名帖由老仆送来，外封无华，内里却把履历、文章和可托之处写得极细。沈如晦显然早已替你想过说辞。",
      "替他办事，会让你得到师门照拂，也会让旁人看见你受师门支配。派系阻挠和清议沸腾会从小小荐札里长出来。",
      "此事若入传，写的是你早年如何偿还提携之恩。师门给你的光，也会在必要时变成绳。"
    ),
    npc_gu_rescue: detail(
      "顾元衡求援来得急，是同年关系中最常见的考验。他的祸未必大，却足以让同榜诸人判断你是否可靠。",
      "夜半来访时，他把声音压得很低，仍掩不住慌。那句诗文破绽或许只是小错，但已经被有心人抄了出去。",
      "你若援手，便与他的流言同担风险；你若迟疑，同年圈子里会慢慢少一分热意。义气与自保都不轻。",
      "传记里同年往来多半只写几笔，但每一笔都能看出一个人是否肯在别人失势时伸手。"
    ),
    npc_ye_joint_name: detail(
      "叶慎言的联名公疏带着清流气味：字句正，姿态直，也很难回头。署名不是附和，而是把自己放进士林名单。",
      "他带来的草稿已经改过数遍，锋芒仍在。纸边有几处墨色较深，像是他昨夜争到最后也不肯删去的句子。",
      "署名能得清名，也会让君前觉得你站得太直。叶慎言要的是明白，官场偏偏最怕明白得没有余地。",
      "后人若称你为清流，此类联名就是证据；若称你为躁进，它同样也会成为证据。"
    ),
    npc_wei_probe: detail(
      "魏承弼的试探从不显得凶狠。他递来的旧稿像是帮忙，实则把几处可杀人的字眼放到你手边。",
      "来信语气周到，周到得不像他。旧稿纸色发黄，边角却被重新裁过，像有人特意洗去来路。",
      "你若看不破，旧稿一旦流入宫中，便会成为你与旧议牵连的证据；你若看破，也要想好如何不让他再换一套说法。",
      "政敌最危险的地方，不在正面攻讦，而在替你保存另一个版本的生平。魏承弼正擅长此事。"
    ),
    npc_zhao_quota: detail(
      "赵廷瓒催考成，是府台对下属能力的直接称量。钱粮、积案、流程三项并压，说明他要的不只是结果，也要有人替结果负责。",
      "府札一封比一封短，语气也一封比一封硬。幕友看完只说：这不是催你，是在看你能不能扛事。",
      "办成了，上司会记你能干；办砸了，你便是最合适的挡火之人。上司信任与上司追责从来相邻。",
      "地方履历里，府台评语常能决定升沉。赵廷瓒这一催，可能是台阶，也可能是坑口。"
    ),
    npc_lin_bargain: detail(
      "林伯珩的交易代表地方士绅最柔软也最难拒的力量。他给粮，不是行善；他缓你一局，是要你承认他的规矩。",
      "粮券摆在案上，百姓确实等着救济。林伯珩没有逼你，只把清丈田亩的事轻轻提了一句。",
      "收下粮，便欠地方一个口子；拒绝粮，民怨可能先落到你身上。仁政与清名在此时并不总是同路。",
      "传记写地方治理，若只写清廉便太单薄。真正难写的是你如何面对能救人、也能套住你的交易。"
    ),
    npc_cao_account: detail(
      "曹衡暗示旧簿，是旧吏决定是否向新官开门的信号。账房里最有用的账，往往不在正式册页中。",
      "他没有直接交簿，只说柜房里有些年头太久的纸怕潮。话说得像闲谈，却让堂上空气忽然紧了一寸。",
      "逼急了，他会让全衙装聋；给台阶，他也许交出半截真相。胥吏欺瞒不是一堵墙，而是一排会自己移动的门。",
      "地方官能否留下实绩，常取决于有没有人肯把旧账交给他。曹衡这一页，可能是破局，也可能是新债。"
    ),
    npc_cheng_plan: detail(
      "程介献策带着幕友的冷静。他不替你说哪条路正，只把每条路的代价算清，逼你承认官场没有无价之选。",
      "灯下三张纸，一张写名，一张写财，一张写罪人。字迹平稳，像写的不是风波，而是一笔可结的账。",
      "采纳他，乱局会变得可办；太依赖他，官声也会沾上算计。幕友不是官，却能决定官如何显得像官。",
      "史传多称幕友为某某佐治，却少写其冷处。程介入局，会让你的传记多一层精密，也多一分薄情。"
    ),
    npc_emperor_private: detail(
      "景和帝私问不是问策，而是把你从群臣之中单独拎出来，看你如何在清议、证据与君心之间站定。",
      "殿中人退下后，声音反而更轻。皇帝只问一句，旁边却像摆着你多年奏疏、声名和交游。",
      "答得太随众，像被清议牵着走；答得太迎合，又失直臣本色。景和帝要分寸，而分寸从来没有成例可抄。",
      "君前私问若入传，往往是传主命运的转折。后人会从你的回答里寻找一生荣辱的伏笔。"
    ),
    npc_feng_whisper: detail(
      "冯谨递来的宫门风声，是内廷消息对外廷官员的诱惑。它可能帮你避祸，也可能证明你本不该知道这些。",
      "宫门外半步停留，半句闲话落下。他没有说请你回报什么，但你知道宫中消息从不白来。",
      "用它，你能看清上意；用得太准，士林和政敌都会疑你内外交结。消息越有用，痕迹越危险。",
      "传记里内侍线索总带阴影。冯谨若多次出现，后人会问：你靠的是识见，还是宫门暗线。"
    ),
    npc_tao_impeach: detail(
      "陶闻道逼参，是士林把公论转化为行动的方式。书院不在朝堂，却能把朝堂推到不得不表态的位置。",
      "证词由士子送来，附着联名与山长印记。它们未必足以定案，却足以让沉默显得可疑。",
      "你若不动笔，士林问你是否畏权；你若仓促动笔，权贵反扑会先于证据抵达。清议与证据必须并行，少一边都危险。",
      "孤臣名声常由士林追赠，也常先由士林催逼而成。陶闻道递来的不是证词，是一条难退的路。"
    ),
    npc_yan_invite: detail(
      "严绍投帖是权臣招揽与威胁并行的手法。他不必明说后果，因为六部与台垣都知道他的门路有多宽。",
      "名帖只有寥寥数字，字越少，分量越重。来人没有催答复，只说严公知道你近来不易。",
      "接近他，旧案或许能平；拒绝他，旧案也许重开。权臣给的路看似平坦，真正代价往往写在后面。",
      "传主若与权臣有染，后世会重新读他每一次升迁；若拒权臣而受挫，也可能由此得身后清名。"
    )
  };

  var critical = {
    hanlin_edict: ["文辞未备", "上意不明"],
    hanlin_lecture: ["文名不足", "上意不明"],
    hanlin_faction: ["举荐不足", "派系阻挠"],
    hanlin_slander: ["流言滋生", "上意不明"],
    hanlin_mentor: ["派系阻挠", "清议沸腾"],
    hanlin_impeach_friend: ["证据不足", "派系阻挠"],
    county_granary: ["钱粮缺口", "证据不足"],
    county_flood: ["灾情蔓延", "民怨积累"],
    county_lawsuit: ["证据不足", "士绅掣肘"],
    county_tax: ["钱粮缺口", "上司追责"],
    county_bandits: ["治安崩坏", "民怨积累"],
    county_clerks: ["胥吏欺瞒", "流程迟滞"],
    censor_corrupt_minister: ["证据不足", "朋党反扑"],
    censor_border: ["证据不足", "钱粮缺口"],
    censor_palace: ["上意不明", "政敌反扑"],
    censor_exam_scandal: ["证据不足", "流言滋生"],
    censor_reform: ["上意不明", "派系阻挠"],
    censor_final_purge: ["政敌反扑", "上意不明"],
    rel_secret_mandate: ["上意不明", "清议沸腾"],
    rel_vermilion_suspicion: ["上意不明", "政敌反扑"],
    rel_framed_case: ["政敌反扑", "证据不足"],
    rel_scholar_support: ["清议沸腾", "上意不明"],
    rel_public_backlash: ["清议沸腾", "流言滋生"],
    rel_gentry_circle: ["士绅掣肘", "钱粮缺口"],
    rel_clerk_trap: ["胥吏欺瞒", "流程迟滞"],
    rel_school_pressure: ["派系阻挠", "清议沸腾"],
    npc_shen_recommend: ["派系阻挠", "举荐不足"],
    npc_gu_rescue: ["流言滋生", "证据不足"],
    npc_ye_joint_name: ["清议沸腾", "上意不明"],
    npc_wei_probe: ["流言滋生", "政敌反扑"],
    npc_zhao_quota: ["上司追责", "钱粮缺口"],
    npc_lin_bargain: ["士绅掣肘", "钱粮缺口"],
    npc_cao_account: ["胥吏欺瞒", "证据不足"],
    npc_cheng_plan: ["流程迟滞", "期限逼近"],
    npc_emperor_private: ["上意不明", "清议沸腾"],
    npc_feng_whisper: ["上意不明", "政敌反扑"],
    npc_tao_impeach: ["清议沸腾", "证据不足"],
    npc_yan_invite: ["朋党反扑", "政敌反扑"]
  };

  var hooks = {
    "上意不明": { world: { emperorTrust: -1 }, text: "上意未定，君前安全感下降。" },
    "清议沸腾": { world: { scholarOpinion: -1, factionHeat: 1 }, text: "清议未平，士林议论继续发酵。" },
    "流言滋生": { fame: { clean: -1 }, relations: { rival: { resentment: 1 } }, text: "流言入耳，清名受损。" },
    "派系阻挠": { world: { factionHeat: 1 }, relations: { rival: { resentment: 1 } }, text: "派系仍在暗中设障。" },
    "钱粮缺口": { world: { fiscalHealth: -1 }, text: "钱粮缺口转为财政隐患。" },
    "证据不足": { resources: { pressure: 1 }, text: "证据未足，案子留下话柄。" },
    "士绅掣肘": { relations: { gentry: { resentment: 1 } }, text: "士绅余力未清，地方阻力延续。" },
    "灾情蔓延": { world: { publicMood: -2 }, text: "灾情未止，民心转冷。" },
    "民怨积累": { world: { publicMood: -1 }, text: "民怨未散，地方评价下降。" },
    "胥吏欺瞒": { relations: { clerks: { resentment: 1 } }, text: "胥吏继续遮掩，日后更难驱使。" },
    "上司追责": { resources: { pressure: 1 }, relations: { superior: { trust: -1 } }, text: "上司追责未消，考成留下刺。" },
    "治安崩坏": { world: { publicMood: -1 }, fame: { competence: -1 }, text: "治安未定，能名受疑。" },
    "流程迟滞": { world: { courtPressure: 1 }, text: "流程迟滞，朝局压力上升。" },
    "朋党反扑": { world: { factionHeat: 1 }, relations: { rival: { resentment: 1 } }, text: "朋党反扑未止，政敌更紧。" },
    "政敌反扑": { relations: { rival: { resentment: 1 } }, resources: { pressure: 1 }, text: "政敌抓住余波继续追咬。" },
    "期限逼近": { resources: { pressure: 1 }, text: "期限压力转为心头旧账。" },
    "文名不足": { fame: { literary: -1 }, text: "文名不足，馆阁评价走低。" },
    "文辞未备": { fame: { literary: -1 }, text: "文辞未备，才名受损。" },
    "举荐不足": { resources: { favor: -1 }, text: "举荐不足，人情入口变窄。" },
    "案卷迟滞": { world: { courtPressure: 1 }, text: "案卷迟滞，后续公文更难推动。" },
    "贪墨诱因": { fame: { corruption: 1 }, text: "贪墨诱因未除，旁人看你的眼神更浑。" }
  };

  GameData.events.forEach(function (event) {
    event.criticalTracks = critical[event.id] || Object.keys(event.tracks).slice(0, 2);
    event.failureHooks = hooks;
    event.reactions = [
      { source: "士绅掣肘", add: { "流言滋生": 2 }, text: "士绅借势放出流言。" },
      { source: "胥吏欺瞒", add: { "胥吏欺瞒": 2, "期限逼近": 1 }, text: "胥吏拖延文牍，期限更紧。" },
      { source: "政敌反扑", add: { "政敌反扑": 2 }, text: "政敌抓住破绽反咬。" },
      { source: "朋党反扑", add: { "朋党反扑": 2 }, text: "朋党合流，反扑加剧。" },
      { source: "上意不明", add: { "上意不明": 1 }, text: "宫中风向摇摆，上意更加难测。" },
      { source: "清议沸腾", add: { "清议沸腾": 1, "派系阻挠": 1 }, text: "清议被人借题发挥。" }
    ];
  });
})();
