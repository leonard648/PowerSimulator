(function () {
  window.GameData = window.GameData || {};

  GameData.player = {
    name: "张居正",
    courtesy: "叔大",
    nativePlace: "湖广江陵",
    title: "内阁首辅、帝师",
    startAge: 48,
    startLog: "万历元年，张居正奉遗诏辅政。",
    biographyTitle: "张居正万历新政纪略"
  };

  GameData.timeline = {
    eraName: "万历",
    startGregorianYear: 1573,
    maxYear: 10,
    meritLabel: "新政威望",
    seasonLabel: "时令",
    phases: [
      { officeId: "hanlin", startYear: 1, endYear: 2, name: "辅政初定" },
      { officeId: "county", startYear: 3, endYear: 7, name: "新政推行" },
      { officeId: "censor", startYear: 8, endYear: 10, name: "权势晚期" }
    ]
  };

  GameData.seasons = ["春", "夏", "秋", "冬"];

  GameData.offices = [
    {
      id: "hanlin",
      name: "辅政初定",
      rankName: "内阁首辅·帝师",
      years: "万历元-二年",
      minYear: 1,
      promotionMerit: null,
      nextOfficeId: null,
      goal: "稳住幼主、太后与内廷同盟，压住高拱余波，取得新政开局。",
      tags: ["首辅", "帝师", "内阁"],
      handLimit: 5,
      energy: 5,
      unlockTags: ["首辅", "经筵", "票拟", "考成", "内廷", "人情"],
      exams: ["帝心稳固", "内廷协力", "阁臣归附", "言路风声"]
    },
    {
      id: "county",
      name: "新政推行",
      rankName: "内阁首辅·综核名实",
      years: "万历三-七年",
      minYear: 3,
      promotionMerit: null,
      nextOfficeId: null,
      goal: "以考成法、清丈田亩、一条鞭法、治河与边防压出实效。",
      tags: ["考成", "清丈", "财赋"],
      handLimit: 6,
      energy: 5,
      unlockTags: ["考成", "财赋", "清丈", "河工", "边防", "部院"],
      exams: ["考成推行", "财赋充实", "河工边防", "地方阻力", "部院执行"]
    },
    {
      id: "censor",
      name: "权势晚期",
      rankName: "内阁首辅·新政主事",
      years: "万历八-十年",
      minYear: 8,
      promotionMerit: null,
      nextOfficeId: null,
      goal: "在帝心渐变、夺情旧议、言官反扑和家门牵连中保住新政身后评价。",
      tags: ["晚局", "清算", "言路"],
      handLimit: 6,
      energy: 5,
      unlockTags: ["晚局", "言路", "权谋", "身后", "帝心", "家门"],
      exams: ["帝心余温", "言路压力", "家门牵连", "身后清算", "新政遗绪"]
    }
  ];

  GameData.people = [
    { id: "emperor", name: "万历帝", keys: ["trust", "suspicion"], label: "君臣" },
    { id: "mentor", name: "内廷", keys: ["closeness", "debt"], label: "太后与司礼监" },
    { id: "peers", name: "内阁同僚", keys: ["closeness", "resentment"], label: "阁臣" },
    { id: "gentry", name: "地方士绅", keys: ["closeness", "resentment"], label: "清丈" },
    { id: "clerks", name: "部院执行", keys: ["fear", "resentment"], label: "六部都察" },
    { id: "superior", name: "家门", keys: ["trust", "debt"], label: "子弟亲属" },
    { id: "rival", name: "政敌言官", keys: ["fear", "resentment"], label: "言路" },
    { id: "scholars", name: "士林清议", keys: ["closeness", "resentment"], label: "公论" }
  ];

  GameData.npcs = [
    {
      id: "shen_ruhui",
      name: "李太后",
      role: "皇太后",
      group: "mentor",
      officeScope: ["hanlin", "county", "censor"],
      traits: ["内廷", "护主", "倚重首辅"],
      agenda: "要幼主成器，也要首辅替宫中稳住天下。",
      bio: "李太后是万历初年宫中最重的一只手。穆宗崩后，十岁的朱翊钧登基，她倚张居正为帝师，又借冯保整肃内廷，使幼主读书、听政皆不敢废弛。\n她信任张居正，并非只因私情，而是因为她需要有人把先帝遗诏落到制度上。张居正若能让皇帝有学、有畏、有政绩，她便会给首辅以宫中背书；若新政引来众怒，宫中也会先问首辅是否把幼主推到太亮处。\n她的支持是万历新政最早的屋檐，也是日后政敌最爱指认的内廷根脚。",
      trigger: { stat: "debt", min: 4 },
      initial: { bond: 3, trust: 4 }
    },
    {
      id: "gu_yuanheng",
      name: "冯保",
      role: "司礼监太监",
      group: "mentor",
      officeScope: ["hanlin", "county", "censor"],
      traits: ["内廷", "消息", "权势"],
      agenda: "与首辅互为臂助，也要保住司礼监的位置。",
      bio: "冯保掌司礼监，万历初与张居正结成关键同盟。高拱去位、幼主受教、内廷与外廷协调，处处都有他的影子。\n他能把宫门里的风声提前送到内阁，也能让票拟与批红之间少许多暗耗。只是内廷之力越好用，外廷越容易说张居正倚宦官立威。\n他对张居正的帮助近乎不可替代，但这种帮助从一开始就带着身后清算的墨痕。",
      trigger: { stat: "bond", min: 4 },
      initial: { bond: 3, trust: 3 }
    },
    {
      id: "ye_shenyan",
      name: "申时行",
      role: "阁臣",
      group: "peers",
      officeScope: ["hanlin", "county", "censor"],
      traits: ["内阁", "调和", "谨慎"],
      agenda: "替首辅缓和锋芒，也为将来内阁留余地。",
      bio: "申时行入阁较晚，性情温和，长于在峻法与人情之间留缓冲。他尊张居正之才，却未必赞同每一处急切。\n在新政推进时，他可以成为部院与言路之间的缓冲，也可以在风向变动后成为另一种官场存续之道的代表。\n他不是张居正最锋利的刀，却可能是最能看见刀口会割向何处的人。",
      trigger: { stat: "bond", min: 5 },
      initial: { bond: 1, trust: 2 }
    },
    {
      id: "wei_chengbi",
      name: "张四维",
      role: "阁臣",
      group: "peers",
      officeScope: ["hanlin", "county", "censor"],
      traits: ["内阁", "观望", "自保"],
      agenda: "在首辅权势下保存自己，也等风向改变。",
      bio: "张四维是张居正晚年内阁中的重要同僚。张居正当权时，他多能顺从大局；张居正死后，他又迅速成为清算旧政的关键人物之一。\n他并不总是正面相争，更多时候是观察、衡量、等待。首辅强时，他知道如何让自己显得可用；首辅势衰，他也知道如何让自己显得从未太近。\n与他相处，最难的是分辨顺从和蓄势之间的边界。",
      trigger: { stat: "resentment", min: 5 },
      initial: { resentment: 1, trust: 1 }
    },
    {
      id: "zhao_tingzan",
      name: "王国光",
      role: "户部尚书",
      group: "clerks",
      officeScope: ["county", "censor"],
      traits: ["户部", "财赋", "执行"],
      agenda: "要财赋有数，也要首辅承担催科之怨。",
      bio: "王国光主户部，是张居正财政新政的重要执行者之一。清丈田亩、整顿钱粮、一条鞭法的推进，都需要户部把章程变成账册。\n他明白国用匮乏，也明白地方士绅不会轻易吐出隐田。若首辅给他足够权威，他能把财赋做出数字；若首辅失去帝心，户部账册也会变成众矢之的。\n财政成效越明显，催科与扰民之名也越难完全洗去。",
      trigger: { stat: "trust", min: 6 },
      initial: { trust: 2, bond: 1 }
    },
    {
      id: "lin_boheng",
      name: "潘季驯",
      role: "河道总督",
      group: "clerks",
      officeScope: ["county", "censor"],
      traits: ["河工", "能臣", "工程"],
      agenda: "要银、要权、要首辅替河工挡住非议。",
      bio: "潘季驯以治河名世，主张束水攻沙，整顿黄河与漕运。河工耗银巨大，成败却关系漕粮、民生和朝廷命脉。\n张居正重用潘季驯，是新政务实一面的体现：不只在纸上考成，也要让堤岸、漕路和民田看见效果。\n河工若成，首辅得政绩；河工若败，银两、民怨和攻讦会一并涌来。",
      trigger: { stat: "debt", min: 3 },
      initial: { bond: 1, trust: 2 }
    },
    {
      id: "cao_heng",
      name: "戚继光",
      role: "蓟镇总兵",
      group: "clerks",
      officeScope: ["county", "censor"],
      traits: ["边防", "武臣", "练兵"],
      agenda: "要边饷不断，也要首辅相信武臣可用。",
      bio: "戚继光晚年镇蓟，倚张居正支持整军练兵，北方边防因而大稳。武臣得首辅倚重，既是国家之幸，也是朝局里一条容易被攻讦的线。\n他需要饷银、军器和不被文臣随意掣肘的空间；张居正需要边镇安稳来证明新政不只是内阁文字。\n张居正死后，戚继光很快失去庇护，这条边防线也成为身后清算的回声之一。",
      trigger: { stat: "resentment", min: 4 },
      initial: { trust: 2, bond: 2 }
    },
    {
      id: "cheng_jie",
      name: "张敬修",
      role: "长子",
      group: "superior",
      officeScope: ["county", "censor"],
      traits: ["家门", "子弟", "牵连"],
      agenda: "借父亲权势求稳，也可能让家门成为政敌入口。",
      bio: "张敬修是张居正长子。首辅家门在新政中并非局外：亲族、门生、馈赠、科第与宅第，都会在权势盛时被放大，也会在身后清算时被重新命名。\n对张居正而言，家门既是私情，也是政治风险。越要证明自己综核名实、不徇私门，越要处理家门在人情场中的每一次伸手。\n张敬修的存在提醒玩家：新政不只写在六部，也会写到家宅门楣上。",
      trigger: { stat: "debt", min: 4 },
      initial: { bond: 2, trust: 1 }
    },
    {
      id: "jinghe_emperor",
      name: "朱翊钧",
      role: "万历皇帝",
      group: "emperor",
      officeScope: ["hanlin", "county", "censor"],
      traits: ["幼主", "受教", "渐疑"],
      agenda: "要帝师教他为君，也终会想摆脱帝师的影子。",
      bio: "朱翊钧十岁即位，是为万历帝。万历初年，他在李太后、冯保与张居正的严格约束下读书听政，朝政因而得以由首辅强力推动。\n年少时的信任并不等于成年后的顺从。张居正教得越严、权越重，皇帝越可能在心里把新政功绩和被管束的记忆缠在一起。\n万历帝是张居正新政的根基，也是新政身后命运的最终裁断者。",
      trigger: { stat: "trust", min: 7 },
      initial: { trust: 4 }
    },
    {
      id: "feng_jin",
      name: "高拱",
      role: "前首辅",
      group: "rival",
      officeScope: ["hanlin"],
      traits: ["旧相", "余党", "攻讦"],
      agenda: "即便去位，也要让人记得新首辅得位不清。",
      bio: "高拱是隆庆末年的重臣。万历初，围绕司礼监冯保与幼主辅政，高拱很快被逐出中枢，张居正由此稳居首辅。\n高拱本人虽去，旧部与旧议却未散。政敌最容易从这里说起：张居正是不是借内廷去旧相？新政是不是从一桩权力清洗开始？\n处理高拱余波，决定张居正开局是被看作顾命大臣，还是被看作权力胜者。",
      trigger: { stat: "resentment", min: 3 },
      initial: { resentment: 3 }
    },
    {
      id: "tao_wendao",
      name: "吴中行",
      role: "言官",
      group: "scholars",
      officeScope: ["censor"],
      traits: ["言路", "夺情", "刚直"],
      agenda: "以夺情为名挑战首辅权势。",
      bio: "万历五年，张居正父丧，朝廷夺情留任。吴中行等言官上疏反对，遭廷杖贬斥，夺情由此成为张居正一生最深的争议之一。\n吴中行代表的是士林名节的锋刃：他们未必能阻止首辅执政，却能把首辅最强的一面写成最刺眼的罪名。\n新政越需要张居正留任，名教越要求张居正归丧；这道裂缝不会随廷杖消失。",
      trigger: { stat: "bond", min: 5 },
      initial: { resentment: 2, trust: 1 }
    },
    {
      id: "yan_shao",
      name: "邹元标",
      role: "言官",
      group: "rival",
      officeScope: ["censor"],
      traits: ["清议", "直谏", "反噬"],
      agenda: "把首辅的权势写成可被后世审判的文字。",
      bio: "邹元标以直节闻名，曾因批评张居正夺情而受贬。对张居正而言，他这样的言官并不掌六部，也不统兵饷，却能把一时政治争执变成身后评价。\n他的力量在于不肯退让。廷杖可以压住上疏，却不能压住士林传抄；贬谪可以让人离开京城，却让名字在公论里更响。\n若张居正只把他视作麻烦，便会低估清议在身后清算中的耐心。",
      trigger: { stat: "resentment", min: 5 },
      initial: { resentment: 2 }
    }
  ];

  var npcBioSupplements = {
    shen_ruhui: [
      "李太后的支持并不等于无限纵容。她最在意的是万历帝能否成器，若首辅的权势让皇帝只学会畏惧而非治理，宫中信任也会慢慢转冷。"
    ],
    gu_yuanheng: [
      "冯保与张居正彼此成就，也彼此拖累。政敌日后每提内廷二字，都会把司礼监与首辅的名字放在同一行里。"
    ],
    ye_shenyan: [
      "申时行的谨慎能缓冲新政锋芒，也会让强硬派觉得他不够用力。越到晚局，他的调和越显得像另一条后路。"
    ],
    wei_chengbi: [
      "张四维的危险不在当面冲突，而在风向转后知道该把哪些旧事重新摆上案头。"
    ],
    zhao_tingzan: [
      "户部数字是新政成效最直接的证明，也是扰民、聚敛、严催诸名最容易落脚的地方。"
    ],
    lin_boheng: [
      "河工成败常比奏疏更沉默，也更难伪装。堤岸若稳，反对者也不得不承认实绩。"
    ],
    cao_heng: [
      "戚继光的边镇安稳需要首辅庇护。张居正一倒，武臣失势的速度会反过来证明他当年倚靠有多深。"
    ],
    cheng_jie: [
      "家门不是朝局之外的私事。越是首辅之家，越容易在身后被翻成公案。"
    ],
    jinghe_emperor: [
      "万历帝对张居正的感情混杂着敬、畏、依赖和积怨。新政能否身后保全，最后仍要过皇帝这一关。"
    ],
    feng_jin: [
      "高拱退场后仍像一段未写完的序。张居正的开局越成功，越有人回头追问这序是否清白。"
    ],
    tao_wendao: [
      "吴中行之争让夺情从政务问题变成名教问题。张居正可以赢廷议，却很难让后世不再追问。"
    ],
    yan_shao: [
      "邹元标让玩家看见言路的另一种韧性：它可以一时被压下，却常在身后重新抬头。"
    ]
  };

  GameData.npcs.forEach(function (def) {
    var supplement = npcBioSupplements[def.id];
    if (supplement && supplement.length) {
      def.bio = [def.bio].concat(supplement).filter(Boolean).join("\n");
    }
  });
})();
