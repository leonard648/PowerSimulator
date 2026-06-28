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
      bio: "沈如晦少时以经义入仕，历两朝馆阁，最懂清贵衙门里一字一句的分量。旁人看他温吞，其实他记人极准，谁肯替师门跑腿，谁在风口退半步，他都记在心里。\n他早年也曾被朋党牵累，靠着一封封替人改过的奏稿慢慢站稳，所以最看重“门生”二字。得他照拂，吏部、礼部的许多门槛会低一些；欠他太多，往后你的清名也会被写进师门账册。\n他对你有提携之恩，却不愿白白提携。每一次荐札、每一次请托，都像在你仕途边上添一道细线，线不重，攒多了便成绳。",
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
      bio: "顾元衡与你同榜入仕，少年得意，嘴快心热，常在酒席上替同年出头。初入馆阁时，他比你更会交游，也更容易把一句玩笑说成半桩风波。\n他家中根基不厚，仕途全靠同年互相托举，因此极重情义，也极怕被人先弃。你救他一次，他会记得很久；你迟疑一次，他也会记得很久。\n他的麻烦常来得急，像夜雨打窗。帮他，未必有大功；不帮，同年圈子里会慢慢多出几句冷话。",
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
      bio: "叶慎言出身书香旧族，自幼在书院中长大，文章锋利，名声也锋利。他相信朝廷仍有公论可凭，所以最厌恶含糊与遮掩。\n在馆阁中，他常为一个字争到夜深。有人敬他刚直，有人嫌他不识时务。他不爱结党，却天然会被清流推到前面。\n他看你时，总像在看一篇尚未定稿的文章。若你肯站直，他会替你扬名；若你退得太圆，他的失望也会变成士林里的轻声评语。",
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
      bio: "魏承弼也是清贵出身，却比大多数馆阁官更早懂得阴影的用处。他不急着参人，也不急着结怨，只喜欢把别人的错处悄悄收好。\n他与你同在文墨之地，表面客气，往来有礼，私下却常把你的名字放进旧稿边角。哪一日风向合适，那些边角便会变成证据。\n他最怕你无懈可击，也最愿意等你疲惫。与他周旋，不在一时胜负，而在别让他替你写下第二个版本的人生。",
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
      bio: "赵廷瓒从州县一路升上来，半生都在钱粮、刑名、考成里打滚。他不信漂亮文章，只信账册上的红黑与限期前的批结。\n做他的下属，最怕不是被骂，而是被他沉默地记上一笔。他给你的札子往往不长，却句句有钩：要结果，也要有人担责。\n若你能替他压住地方乱局，他会赏识你的能办事；若你拖累府台考成，他会比政敌更早把你推到前面挡火。",
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
      bio: "林伯珩是地方大姓的领袖，家中粮仓、族学、义庄都有他的影子。百姓称他林老爷，县衙称他乡绅，真正办事时两边都要看他的脸色。\n他不轻易顶撞官府，也从不白白配合官府。粮车早到或晚到，账册清楚或含糊，往往只差他席间一句话。\n他愿与你交易，是因为新官还有可塑之处。收他的方便，地方会暂时顺手；欠他的情，日后清丈、税粮、诉讼都会多一层看不见的价码。",
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
      bio: "曹衡在县衙做了三十年书吏，见过的知县比许多人见过的上司还多。堂上换了多少官，柜房里的钥匙仍常从他手里过。\n他知道哪本账不能立刻翻，哪张状纸背后有人，哪名差役嘴里藏着半句真话。新官若只靠威风压他，往往会发现整个县衙忽然变得迟钝。\n但曹衡也不是铁板一块。他怕失势，怕清算，也怕多年经营一朝成空。给他台阶，他可能交出旧簿；逼他太急，他会让所有门都关得严丝合缝。",
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
      bio: "程介年轻时也曾想入仕，数次落第后做了幕友。读书人的傲气还在，只是被账册、讼状和地方人情磨得更冷。\n他写公文不显山露水，算利害却极准。许多时候，他不会告诉你哪条路是正道，只会把三条路的代价一一摆到灯下。\n他投在你幕中，既是谋生，也是想借你的官身做一番未竟之事。信他，可以少走弯路；太信他，也可能让你的官声染上幕友的冷算。",
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
      bio: "景和帝少时即位，见过太多臣子用忠直、清议、祖制来逼宫中表态。他不常显怒，却极擅长把人的名字记在心里。\n他喜欢直臣，却不喜欢不知分寸的直臣；他厌恶朋党，却又离不开朋党替朝廷运转。每一次御前私问，问的都不只是政事，更是臣子站在哪里。\n若你能让他觉得可用而不危险，近君之路会短许多；若你让他觉得名声太响、根脚太深，恩宠也会变成审视。",
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
      bio: "冯谨在宫门内外走动多年，官阶不高，消息却常比六部文书先到半日。他说话轻，脚步也轻，像从不留下痕迹。\n他最懂什么话该说成偶然，什么消息该卖给值得卖的人。与他交好，能提前避开宫中的风向；与他牵连太深，也容易被人说成内外交结。\n他对你并无天然好恶，只看你是否值得下注。一次递话，可能救你一桩事；多次递话，便会让你的名字沾上宫门里的阴影。",
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
      bio: "陶闻道掌书院多年，门下士子遍布州县。他本人不在朝堂，却能让朝堂上的人听见山门外的声音。\n他重名节，也重声势。对他而言，清议不是闲谈，而是一种能逼迫官府低头的刀。刀若用得稳，可以斩开权贵的遮掩；用得太急，也会割伤执刀之人。\n他愿意推你，是看中你还有几分可成的清名。若你畏缩，他会失望；若你莽撞，他又会让你承担清议过火后的反噬。",
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
      bio: "严绍出入中枢多年，门生故吏遍在六部，名帖递到哪里，哪里便会有人替他先开一扇门。他很少亲自逼人，因为许多事不必他说第二遍。\n他看重能办事的人，也喜欢把能办事的人变成自己的人。旧案、升迁、调任、弹劾，在他手里都可以成为筹码。\n与严绍相近，难处会少很多，污点也会多得悄无声息。拒他，未必立刻遭祸；接他，往后每一步都要想清楚脚下是不是自己的路。",
      trigger: { stat: "resentment", min: 5 },
      initial: { resentment: 1, trust: 1 }
    }
  ];
})();
