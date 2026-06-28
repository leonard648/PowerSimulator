(function () {
  window.GameData = window.GameData || {};

  GameData.seasons = ["春", "夏", "秋", "冬"];

  GameData.offices = [
    {
      id: "hanlin",
      name: "翰林",
      rankName: "翰林编修",
      years: "1-4",
      promotionMerit: 28,
      nextOfficeId: "county",
      goal: "建立文名、近君关系与士林声望",
      tags: ["翰林", "近君", "清议"],
      handLimit: 5,
      energy: 4,
      unlockTags: ["翰林", "清流", "才学", "奏疏", "人情"],
      exams: ["文名", "士林评价", "皇帝信任", "派系风险"]
    },
    {
      id: "county",
      name: "知县",
      rankName: "七品知县",
      years: "5-8",
      promotionMerit: 64,
      nextOfficeId: "censor",
      goal: "在钱粮、讼案、灾荒和士绅之间完成治理",
      tags: ["知县", "地方", "政务"],
      handLimit: 5,
      energy: 5,
      unlockTags: ["知县", "地方", "政务", "财政", "法度", "仁政"],
      exams: ["钱粮完成", "讼案积压", "治安稳定", "民心", "上司评价"]
    },
    {
      id: "censor",
      name: "御史",
      rankName: "监察御史",
      years: "9-12",
      promotionMerit: null,
      nextOfficeId: null,
      goal: "用证据、弹劾与清议在朝局中立身",
      tags: ["御史", "监察", "朝廷"],
      handLimit: 6,
      energy: 5,
      unlockTags: ["御史", "法度", "清流", "权谋", "奏疏", "朝廷"],
      exams: ["弹劾命中", "证据可信", "清议支持", "政敌数量", "皇帝容忍"]
    }
  ];

  GameData.people = [
    { id: "emperor", name: "皇帝", keys: ["trust", "suspicion"], label: "君臣" },
    { id: "mentor", name: "座师", keys: ["closeness", "debt"], label: "师门" },
    { id: "peers", name: "同年", keys: ["closeness", "resentment"], label: "同榜" },
    { id: "gentry", name: "地方士绅", keys: ["closeness", "resentment"], label: "地方" },
    { id: "clerks", name: "胥吏", keys: ["fear", "resentment"], label: "属吏" },
    { id: "superior", name: "上司", keys: ["trust", "debt"], label: "考成" },
    { id: "rival", name: "政敌", keys: ["fear", "resentment"], label: "朝争" },
    { id: "scholars", name: "士林", keys: ["closeness", "resentment"], label: "清议" }
  ];

  GameData.npcs = [
    {
      id: "shen_ruhui",
      name: "沈如晦",
      role: "座师",
      group: "mentor",
      officeScope: ["hanlin", "censor"],
      traits: ["师门", "稳重", "护短"],
      agenda: "替门生铺路，也替师门收束人情。",
      bio: "两朝老翰林，话不多，却能让一封荐札在吏部多停半日。",
      trigger: { stat: "debt", min: 4 },
      initial: { bond: 2, trust: 3 }
    },
    {
      id: "gu_yuanheng",
      name: "顾元衡",
      role: "同年",
      group: "peers",
      officeScope: ["hanlin", "censor"],
      traits: ["同榜", "急躁", "义气"],
      agenda: "求同年互保，也怕自己先被弹劾。",
      bio: "与你同榜入仕，酒席上最肯替你说话，案头上也最容易给你添麻烦。",
      trigger: { stat: "debt", min: 3 },
      initial: { bond: 2, trust: 2 }
    },
    {
      id: "ye_shenyan",
      name: "叶慎言",
      role: "清流同僚",
      group: "scholars",
      officeScope: ["hanlin", "censor"],
      traits: ["清流", "刚直", "惜名"],
      agenda: "逼你把话说到明处。",
      bio: "馆阁中最爱争一字轻重的人，清名极重，也极不肯替谁留台阶。",
      trigger: { stat: "bond", min: 5 },
      initial: { bond: 1, trust: 2 }
    },
    {
      id: "wei_chengbi",
      name: "魏承弼",
      role: "政敌",
      group: "rival",
      officeScope: ["hanlin", "censor"],
      traits: ["朝争", "阴忍", "记仇"],
      agenda: "等你露出一句失言或一处旧痕。",
      bio: "同在清贵之地，却总把你的名字放在奏稿边角，像随手记下。",
      trigger: { stat: "resentment", min: 5 },
      initial: { resentment: 2 }
    },
    {
      id: "zhao_tingzan",
      name: "赵廷瓒",
      role: "上司",
      group: "superior",
      officeScope: ["county"],
      traits: ["考成", "严苛", "务实"],
      agenda: "要钱粮、要案结，也要你别把麻烦送到他案头。",
      bio: "府台大人只看考成红黑，夸奖很少，催札极准。",
      trigger: { stat: "trust", min: 6 },
      initial: { trust: 2 }
    },
    {
      id: "lin_boheng",
      name: "林伯珩",
      role: "士绅领袖",
      group: "gentry",
      officeScope: ["county"],
      traits: ["地方", "粮户", "圆滑"],
      agenda: "让县衙承认地方规矩，也让自家田契安稳。",
      bio: "乡里称他林老爷，县里人人知道他一句话能让粮车早到，也能晚到。",
      trigger: { stat: "debt", min: 3 },
      initial: { bond: 1, trust: 1 }
    },
    {
      id: "cao_heng",
      name: "曹衡",
      role: "胥吏头目",
      group: "clerks",
      officeScope: ["county"],
      traits: ["案牍", "老猾", "地头"],
      agenda: "让新官知道，公文离不开旧吏。",
      bio: "三十年书吏，县衙每一只木柜哪块板松，他都比典史清楚。",
      trigger: { stat: "resentment", min: 4 },
      initial: { trust: 1, resentment: 1 }
    },
    {
      id: "cheng_jie",
      name: "程介",
      role: "幕友",
      group: "superior",
      officeScope: ["county"],
      traits: ["幕友", "算计", "能吏"],
      agenda: "把难事算成可办的账，也替自己谋一条出路。",
      bio: "落第举人，笔比刀软，账比刀利，是少数敢在夜里劝你慢一点的人。",
      trigger: { stat: "bond", min: 4 },
      initial: { bond: 2, trust: 2 }
    },
    {
      id: "jinghe_emperor",
      name: "景和帝",
      role: "皇帝",
      group: "emperor",
      officeScope: ["hanlin", "censor"],
      traits: ["近君", "多疑", "好名"],
      agenda: "要直臣，也要直臣知道分寸。",
      bio: "御座之后的人不常动怒，只常记住谁让他不得不动怒。",
      trigger: { stat: "trust", min: 7 },
      initial: { trust: 3 }
    },
    {
      id: "feng_jin",
      name: "冯谨",
      role: "内侍",
      group: "emperor",
      officeScope: ["censor"],
      traits: ["宫门", "消息", "权谋"],
      agenda: "把宫中风声卖给值得卖的人。",
      bio: "他说话总像偶然提起，但偶然二字从不会白给。",
      trigger: { stat: "debt", min: 3 },
      initial: { trust: 1 }
    },
    {
      id: "tao_wendao",
      name: "陶闻道",
      role: "士林山长",
      group: "scholars",
      officeScope: ["censor"],
      traits: ["士林", "清议", "山长"],
      agenda: "要你替公论出手，也要公论记住你。",
      bio: "讲席下有千百张嘴，陶闻道只需点头，清议便能起浪。",
      trigger: { stat: "bond", min: 5 },
      initial: { bond: 1, trust: 2 }
    },
    {
      id: "yan_shao",
      name: "严绍",
      role: "权臣",
      group: "rival",
      officeScope: ["censor"],
      traits: ["权臣", "朋党", "压迫"],
      agenda: "不是收你为门路，就是把你变成靶子。",
      bio: "门生故吏遍在六部，投来一张名帖，分量便像半道谕旨。",
      trigger: { stat: "resentment", min: 5 },
      initial: { resentment: 1, trust: 1 }
    }
  ];
})();
