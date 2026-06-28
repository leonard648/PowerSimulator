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
