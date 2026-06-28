(function () {
  window.GameData = window.GameData || {};

  function card(id, name, type, domain, tags, cost, effect, desc) {
    return { id, name, type, domain, tags, cost: cost || {}, effect: effect || {}, desc };
  }

  GameData.cards = [
    card("memorial_direct", "上疏直谏", "奏疏", "才学", ["清流", "奏疏", "近君", "翰林"], { energy: 1, pressure: 1 }, { tracks: { "上意不明": -3, "清议沸腾": -1 }, world: { emperorTrust: -1, scholarOpinion: 2 }, tags: { 清流: 1 } }, "以直言求上意，清名见长，但容易触怒天颜。"),
    card("careful_memorial", "委婉陈情", "奏疏", "口才", ["圆滑", "奏疏", "近君", "翰林"], { energy: 1 }, { tracks: { "上意不明": -2, "派系阻挠": -1 }, world: { emperorTrust: 1 }, tags: { 圆滑: 1 } }, "避锋芒而陈利害，慢些，却更稳。"),
    card("academy_lecture", "公开讲学", "清议", "才学", ["清流", "才学", "清议", "翰林"], { energy: 1 }, { tracks: { "清议沸腾": -3, "文名不足": -2 }, fame: { clean: 1, literary: 2 }, world: { scholarOpinion: 2 }, tags: { 清流: 1 } }, "把主张讲给士林听，得名，也会让中枢看见你。"),
    card("write_edict", "代拟诏书", "公文", "才学", ["才学", "近君", "翰林"], { energy: 1 }, { tracks: { "文辞未备": -4, "上意不明": -1 }, fame: { literary: 1 }, tags: { 能吏: 1 } }, "以文辞整理皇命，既显才学，也靠近权力。"),
    card("visit_mentor", "拜访座师", "人情", "人情", ["人情", "师门", "翰林"], { energy: 1 }, { tracks: { "派系阻挠": -2, "举荐不足": -3 }, relations: { mentor: { closeness: 2, debt: 1 } }, resources: { favor: 1 }, tags: { 圆滑: 1 } }, "请座师说一句话，往往胜过十篇文章。"),
    card("peer_letter", "托付同年", "人情", "人情", ["人情", "同年", "翰林"], { energy: 1, favor: 1 }, { tracks: { "流言滋生": -2, "举荐不足": -2, "证据不足": -1, "案卷迟滞": -2 }, relations: { peers: { closeness: 2, debt: 1 } }, tags: { 圆滑: 1 } }, "同榜之谊可以救急，也会留下人情账。"),
    card("peer_mediation", "同年转圜", "人情", "口才", ["圆滑", "人情", "同年", "翰林"], { energy: 1 }, { tracks: { "政敌反扑": -3, "流言滋生": -2, "举荐不足": -1 }, relations: { peers: { closeness: 1, debt: 1 }, rival: { resentment: -1 } }, tags: { 圆滑: 1 } }, "让同年先替你递话，把明面上的锋芒压回暗处。"),
    card("refuse_gift", "拒收陋规", "操守", "操守", ["清流", "地方", "操守"], { energy: 1, money: 1 }, { tracks: { "贪墨诱因": -3 }, fame: { clean: 2 }, world: { scholarOpinion: 1 }, relations: { gentry: { resentment: 1 } }, tags: { 清流: 1 } }, "守住手，代价是少了许多好办事的路。"),
    card("court_debate", "当廷争辩", "清议", "口才", ["清流", "朝廷", "奏疏"], { energy: 2, pressure: 1 }, { tracks: { "清议沸腾": -3, "派系阻挠": -2 }, fame: { clean: 1, power: 1 }, relations: { rival: { resentment: 2 } }, tags: { 清流: 1 } }, "把话说在明处，胜负都不会悄无声息。"),
    card("archive_search", "检索旧档", "法度", "政务", ["法度", "证据", "朝廷"], { energy: 1 }, { tracks: { "证据不足": -3, "案卷迟滞": -2 }, tags: { 能吏: 1 } }, "旧纸堆里常有新刀锋。"),
    card("seal_document", "官样文章", "公文", "政务", ["政务", "朝廷"], { energy: 1 }, { tracks: { "流程迟滞": -3, "证据不足": -1, "上意不明": -1 }, world: { courtPressure: -1 }, tags: { 能吏: 1 } }, "不动声色地把事情推过流程。"),

    card("survey_fields", "清丈田亩", "政务", "政务", ["能吏", "财政", "地方", "知县"], { energy: 2 }, { tracks: { "钱粮缺口": -3, "士绅掣肘": 1 }, world: { fiscalHealth: 2, publicMood: -1 }, relations: { gentry: { resentment: 2 } }, tags: { 能吏: 1 } }, "把隐田摊到阳光下，账面会好看，地方不会高兴。"),
    card("open_granary", "开仓赈济", "政务", "政务", ["仁政", "地方", "知县"], { energy: 1, money: 1 }, { tracks: { "民怨积累": -4, "灾情蔓延": -3, "钱粮缺口": 1 }, world: { publicMood: 3, fiscalHealth: -1 }, tags: { 仁政: 1 } }, "先救人，再想账。"),
    card("audit_accounts", "查封账册", "法度", "法度", ["法度", "证据", "地方", "知县"], { energy: 1 }, { tracks: { "证据不足": -4, "胥吏欺瞒": -2 }, relations: { clerks: { resentment: 2, fear: 1 } }, tags: { 能吏: 1 } }, "账册一封，许多人就睡不安稳。"),
    card("banquet_gentry", "宴请乡绅", "人情", "人情", ["人情", "地方", "知县"], { energy: 1 }, { tracks: { "士绅掣肘": -3, "钱粮缺口": -1 }, resources: { money: 1, favor: -1 }, fame: { clean: -1 }, relations: { gentry: { closeness: 2, debt: 1 } }, tags: { 圆滑: 1 } }, "席间一句话，能换来数日通融。"),
    card("strict_interrogation", "严刑催供", "法度", "法度", ["酷吏", "法度", "地方"], { energy: 1, pressure: 1 }, { tracks: { "证据不足": -4, "胥吏欺瞒": -2 }, world: { publicMood: -2 }, fame: { cruel: 2 }, tags: { 酷吏: 1 } }, "快，但每一声惨叫都会进史笔。"),
    card("borrow_treasury", "借拨库银", "财政", "财政", ["财政", "能吏", "地方"], { energy: 1 }, { tracks: { "钱粮缺口": -4, "灾情蔓延": -1 }, world: { fiscalHealth: -2 }, resources: { money: 1 }, tags: { 能吏: 1 } }, "拆东墙补西墙，至少眼前的墙不倒。"),
    card("report_truth", "上报实情", "奏疏", "操守", ["清流", "地方", "奏疏"], { energy: 1 }, { tracks: { "期限逼近": -4, "上司追责": 1 }, world: { emperorTrust: 1 }, fame: { clean: 1, competence: -1 }, tags: { 清流: 1 } }, "把麻烦交给上面，也把自己摆到明处。"),
    card("conceal_deficit_action", "私下补账", "污点", "财政", ["贪腐", "污点", "地方"], { energy: 1, money: 1 }, { tracks: { "钱粮缺口": -5, "期限逼近": -2 }, addStain: "conceal_deficit", fame: { clean: -2, corruption: 2 }, tags: { 贪腐: 1 } }, "账平了，亏心也入账了。"),
    card("repair_waterworks", "兴修水利", "政务", "政务", ["仁政", "工程", "地方", "知县"], { energy: 2, money: 1 }, { tracks: { "灾情蔓延": -4, "民怨积累": -2 }, world: { publicMood: 2, fiscalHealth: -1 }, fame: { competence: 1 }, tags: { 仁政: 1, 能吏: 1 } }, "费钱费力，但能让来年的灾少一些。"),
    card("pacify_lawsuit", "平反冤狱", "法度", "操守", ["仁政", "法度", "地方"], { energy: 2 }, { tracks: { "讼案积压": -4, "民怨积累": -2 }, fame: { clean: 1 }, relations: { clerks: { resentment: 1 } }, tags: { 仁政: 1 } }, "翻旧案，是替百姓伸冤，也是让旧人记恨。"),

    card("impeach_unlawful", "弹劾不法", "弹劾", "法度", ["清流", "御史", "法度", "朝廷"], { energy: 1, pressure: 1 }, { tracks: { "证据不足": -2, "派系阻挠": -3 }, fame: { clean: 1, power: 1 }, relations: { rival: { resentment: 2 } }, tags: { 清流: 1 } }, "御史的笔，是台上的刀。"),
    card("secret_memorial", "密折告发", "权谋", "权谋", ["权谋", "御史", "近君", "污点"], { energy: 1, pressure: 1 }, { tracks: { "派系阻挠": -4, "上意不明": -2 }, world: { emperorTrust: 2, scholarOpinion: -2 }, fame: { power: 2, clean: -1 }, tags: { 权谋: 1 } }, "绕开众目，直入御前。"),
    card("withhold_dossier", "扣留案卷", "权谋", "权谋", ["权谋", "把柄", "御史"], { energy: 1 }, { tracks: { "证据不足": -2, "政敌反扑": -3 }, relations: { rival: { fear: 2 } }, addStain: "withheld_file", tags: { 权谋: 1 } }, "案卷不只证明事实，也证明谁该害怕。"),
    card("plant_protege", "安插门生", "权谋", "人情", ["权谋", "人情", "朝廷"], { energy: 1, favor: 1 }, { tracks: { "流程迟滞": -2, "派系阻挠": -2 }, fame: { power: 2, clean: -1 }, relations: { peers: { debt: 1 } }, tags: { 权谋: 1 } }, "把人放在关键处，事情就会自己转向。"),
    card("divide_faction", "离间朋党", "权谋", "权谋", ["权谋", "朝廷", "御史"], { energy: 2, pressure: 1 }, { tracks: { "朋党反扑": -4, "派系阻挠": -3 }, world: { factionHeat: -2 }, fame: { power: 1, cruel: 1 }, tags: { 权谋: 1 } }, "让他们互相猜疑，比亲自出手省力。"),
    card("public_petition", "士林联署", "清议", "才学", ["清流", "清议", "御史"], { energy: 2 }, { tracks: { "清议沸腾": -4, "上意不明": -1 }, world: { scholarOpinion: 3, emperorTrust: -1 }, fame: { clean: 2 }, tags: { 清流: 1 } }, "让天下读书人一起签名，声音会很大，也很刺耳。"),
    card("cross_examine", "廷辩质证", "弹劾", "口才", ["法度", "御史", "朝廷"], { energy: 2 }, { tracks: { "证据不足": -3, "政敌反扑": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "当面问到对方露怯，是最干净的胜利。"),
    card("seek_inner_tip", "密访内侍", "权谋", "权谋", ["权谋", "近君", "朝廷"], { energy: 1, money: 1 }, { tracks: { "上意不明": -4, "期限逼近": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, addStain: "inner_palace_contact", tags: { 权谋: 1 } }, "宫门里的风，比朝堂上的话来得早。"),
    card("resign_for_principle", "辞官明志", "清议", "操守", ["清流", "退隐", "朝廷"], { energy: 2 }, { tracks: { "清议沸腾": -5, "派系阻挠": -1 }, fame: { clean: 3, power: -2 }, resources: { pressure: -3 }, tags: { 清流: 1 } }, "有时退一步，不是输，是把输赢交给后世。"),
    card("share_credit", "分功于众", "人情", "口才", ["圆滑", "朝廷", "人情"], { energy: 1 }, { tracks: { "派系阻挠": -2, "政敌反扑": -2 }, fame: { competence: -1 }, relations: { superior: { trust: 1 }, peers: { closeness: 1 } }, tags: { 圆滑: 1 } }, "功劳分出去，责任也分出去。"),

    card("family_support", "族中资助", "家族", "家族", ["家族", "资源"], { energy: 0 }, { resources: { money: 2 }, tracks: { "钱粮缺口": -1 }, addStain: "family_obligation", tags: { 圆滑: 1 } }, "家中伸手相助，族中也会记得这笔账。"),
    card("marriage_plea", "姻亲求情", "家族", "人情", ["家族", "人情"], { energy: 1 }, { tracks: { "上司追责": -2, "派系阻挠": -1 }, relations: { superior: { trust: 1 }, peers: { debt: 1 } }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, "姻亲的话能软化许多官样铁面。"),
    card("hire_adviser", "精明幕友", "人物", "政务", ["人脉", "政务", "地方"], { money: 1 }, { buff: { domain: "政务", amount: 1 }, tags: { 能吏: 1 } }, "幕友会帮你把琐事算清楚。"),
    card("quiet_compensation", "暗中补偿", "人情", "人情", ["圆滑", "朝廷", "地方"], { money: 1 }, { tracks: { "民怨积累": -2, "政敌反扑": -1 }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, "有些道歉不能写进公文。"),
    card("strict_quota", "严行考成", "政务", "政务", ["能吏", "朝廷", "政策"], { energy: 2 }, { tracks: { "流程迟滞": -4, "期限逼近": -2 }, world: { courtPressure: -1, publicMood: -1 }, fame: { competence: 2 }, tags: { 能吏: 1 } }, "让所有人按时交卷，也让所有人恨你。"),
    card("delay_deliberation", "延议再定", "公文", "口才", ["圆滑", "朝廷"], { energy: 1 }, { tracks: { "期限逼近": 2, "派系阻挠": -3, "上意不明": -1 }, world: { factionHeat: -1 }, tags: { 圆滑: 1 } }, "拖延不是无为，是等刀离开脖颈。"),
    card("commercial_tax", "商税加派", "财政", "财政", ["财政", "能吏"], { energy: 1 }, { tracks: { "钱粮缺口": -3 }, world: { fiscalHealth: 2, publicMood: -1, scholarOpinion: -1 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "从活水处取钱，水也会泛浑。"),
    card("comfort_people", "百姓请命", "清议", "口才", ["仁政", "地方"], { energy: 1 }, { tracks: { "民怨积累": -3, "上司追责": 1 }, world: { publicMood: 2 }, fame: { clean: 1 }, tags: { 仁政: 1 } }, "站在百姓一边，有时就站到了上司对面。"),
    card("catch_bandits", "缉捕盗匪", "法度", "政务", ["法度", "地方"], { energy: 1 }, { tracks: { "治安崩坏": -4, "民怨积累": -1 }, relations: { clerks: { fear: 1 } }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "治安先定，人心才有地方安放。"),
    card("medical_rest", "静养调息", "休养", "体魄", ["休养"], { energy: 0 }, { resources: { pressure: -4 }, tracks: { "期限逼近": 1 }, tags: { 恬退: 1 } }, "把身体从公文堆里暂时抢回来。"),

    card("frugal_house", "裁撤冗费", "财政", "财政", ["财政", "能吏", "政策"], { energy: 2 }, { tracks: { "钱粮缺口": -3, "流程迟滞": -1, "派系阻挠": 1 }, world: { fiscalHealth: 2 }, tags: { 能吏: 1 } }, "省下来的银子，原本都在别人碗里。"),
    card("ritual_poem", "诗文传名", "清议", "才学", ["清流", "才学", "翰林"], { energy: 1 }, { tracks: { "文名不足": -4, "清议沸腾": -1 }, fame: { literary: 2, clean: 1 }, tags: { 清流: 1 } }, "一篇文章先于政绩抵达人心。"),
    card("educate_heir", "讲读储君", "清议", "才学", ["近君", "翰林"], { energy: 2 }, { tracks: { "上意不明": -2, "文辞未备": -2 }, world: { emperorTrust: 2 }, fame: { literary: 1 }, tags: { 能吏: 1 } }, "近在储宫，话要讲给未来听。"),
    card("smooth_transfer", "两边转圜", "人情", "口才", ["圆滑", "人情", "朝廷"], { energy: 1, favor: 1 }, { tracks: { "派系阻挠": -3, "朋党反扑": -1 }, relations: { rival: { resentment: -1 }, peers: { closeness: 1 } }, tags: { 圆滑: 1 } }, "让每一边都觉得还有台阶。"),
    card("evidence_chain", "坐实证链", "法度", "法度", ["法度", "证据", "御史"], { energy: 2 }, { tracks: { "证据不足": -5 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "证据一环扣一环，话就少了。"),
    card("humble_apology", "具疏请罪", "奏疏", "口才", ["圆滑", "奏疏"], { energy: 1 }, { tracks: { "上司追责": -3, "上意不明": -1 }, world: { emperorTrust: 1 }, fame: { power: -1 }, tags: { 圆滑: 1 } }, "先把姿态放低，才有余地把事翻回来。"),
    card("protect_subordinate", "保全属官", "人情", "操守", ["仁政", "人情"], { energy: 1, pressure: 1 }, { tracks: { "胥吏欺瞒": 1, "上司追责": -2 }, relations: { clerks: { resentment: -2, closeness: 1 } }, fame: { clean: 1 }, tags: { 仁政: 1 } }, "不把所有责任推给下面，会有人记一辈子。"),
    card("scapegoat_clerk", "推出胥吏", "权谋", "权谋", ["权谋", "酷吏", "地方"], { energy: 1 }, { tracks: { "上司追责": -4, "证据不足": -1 }, relations: { clerks: { resentment: 3 } }, fame: { cruel: 1, clean: -1 }, tags: { 权谋: 1, 酷吏: 1 } }, "找一个能承受罪名的人，事情就容易结束。"),
    card("public_works", "修桥铺路", "政务", "政务", ["仁政", "工程", "地方"], { energy: 2, money: 1 }, { tracks: { "民怨积累": -2, "治安崩坏": -1, "灾情蔓延": -2 }, world: { publicMood: 2 }, tags: { 仁政: 1 } }, "路通了，怨气也散些。"),
    card("night_reading", "夜读案牍", "政务", "体魄", ["能吏"], { energy: 1, pressure: 1 }, { tracks: { "案卷迟滞": -4, "流程迟滞": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "把白日不肯动的事，拖到夜里处理。"),
    card("copy_classics", "抄录经义", "才学", "才学", ["才学", "翰林", "清流"], { energy: 1 }, { tracks: { "文名不足": -3, "文辞未备": -2 }, fame: { literary: 1 }, tags: { 清流: 1 } }, "旧学不是捷径，却能把根基扎深。"),
    card("private_warning", "私下规劝", "人情", "口才", ["圆滑", "人情", "翰林"], { energy: 1, favor: 1 }, { tracks: { "流言滋生": -3, "派系阻挠": -1 }, relations: { peers: { resentment: -1 }, mentor: { closeness: 1 } }, tags: { 圆滑: 1 } }, "把话留在屋里，给彼此留些脸面。"),
    card("seal_grain", "封仓验粮", "法度", "政务", ["法度", "财政", "知县"], { energy: 1 }, { tracks: { "钱粮缺口": -2, "证据不足": -2, "胥吏欺瞒": -1 }, relations: { clerks: { resentment: 1 } }, tags: { 能吏: 1 } }, "粮仓封条一贴，谁也不能再说只是误会。"),
    card("village_covenant", "整立乡约", "政务", "口才", ["仁政", "地方", "人情"], { energy: 1 }, { tracks: { "治安崩坏": -2, "民怨积累": -2, "士绅掣肘": -1 }, world: { publicMood: 1 }, tags: { 仁政: 1 } }, "借地方规约约束地方，温和，却见效慢。"),
    card("salt_levy_audit", "核盐课账", "财政", "财政", ["财政", "法度", "知县"], { energy: 2 }, { tracks: { "钱粮缺口": -3, "胥吏欺瞒": -2 }, world: { fiscalHealth: 1 }, relations: { gentry: { resentment: 1 } }, tags: { 能吏: 1 } }, "盐课里藏着银子，也藏着许多人的活路。"),
    card("relief_register", "编造赈册", "污点", "财政", ["贪腐", "污点", "地方"], { energy: 1 }, { tracks: { "灾情蔓延": -3, "钱粮缺口": -2 }, addStain: "bribe_custom", fame: { corruption: 2, clean: -1 }, tags: { 贪腐: 1 } }, "账面上救了很多人，现实里救了你的考成。"),
    card("wind_hearsay", "风闻言事", "弹劾", "口才", ["御史", "清流", "朝廷"], { energy: 1, pressure: 1 }, { tracks: { "清议沸腾": -2, "派系阻挠": -2, "证据不足": 1 }, world: { scholarOpinion: 1 }, tags: { 清流: 1 } }, "御史可凭风闻，代价是风也会吹回自己身上。"),
    card("summon_witness", "传唤证人", "法度", "法度", ["御史", "证据", "法度"], { energy: 1, favor: 1 }, { tracks: { "证据不足": -4, "政敌反扑": 1 }, relations: { rival: { resentment: 1 } }, tags: { 能吏: 1 } }, "让沉默的人走到堂前，局势就变了。"),
    card("imperial_mood", "揣摩圣意", "权谋", "权谋", ["御史", "近君", "权谋"], { energy: 1 }, { tracks: { "上意不明": -3, "派系阻挠": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, "并非每一句话都写在谕旨里。"),
    card("burn_private_letter", "焚毁私札", "权谋", "权谋", ["权谋", "污点", "朝廷"], { energy: 1, pressure: 1 }, { tracks: { "政敌反扑": -3, "证据不足": -1 }, fame: { clean: -1, power: 1 }, addStain: "withheld_file", tags: { 权谋: 1 } }, "纸灰不会说话，但纸灰本身也可疑。"),

    card("sleepless", "夜不能寐", "心病", "压力", ["心病"], { energy: 1 }, { resources: { pressure: 1 }, dead: true }, "心病牌。抽到时占据手牌，打出只能稍作整理。"),
    card("fear_purge", "恐惧清算", "心病", "压力", ["心病"], { energy: 1 }, { resources: { pressure: 2 }, world: { emperorTrust: -1 }, dead: true }, "心病牌。越接近权力，越怕有一日轮到自己。"),
    card("guilty_conscience", "良心不安", "心病", "压力", ["心病"], { energy: 1 }, { resources: { pressure: 1 }, fame: { clean: 1 }, dead: true }, "心病牌。旧事会在夜里来问。"),
    card("burnout", "倦怠成疾", "心病", "压力", ["心病"], { energy: 2 }, { resources: { pressure: -1 }, dead: true }, "心病牌。处理它会消耗宝贵精力。"),
    card("conceal_deficit", "隐匿亏空", "污点", "财政", ["污点", "贪腐"], { energy: 1 }, { resources: { pressure: 1 }, world: { fiscalHealth: -1 }, dead: true }, "污点牌。曾经遮掩的亏空，迟早会在账册里抬头。"),
    card("withheld_file", "扣案留柄", "污点", "权谋", ["污点", "权谋"], { energy: 1 }, { resources: { pressure: 1 }, fame: { power: 1, clean: -1 }, dead: true }, "污点牌。把柄在手，也会扎手。"),
    card("inner_palace_contact", "内外交结", "污点", "权谋", ["污点", "近君"], { energy: 1 }, { world: { scholarOpinion: -1 }, resources: { pressure: 1 }, dead: true }, "污点牌。消息来得太快，本身就是罪名。"),
    card("family_obligation", "家族牵连", "污点", "家族", ["污点", "家族"], { energy: 1 }, { resources: { money: -1, pressure: 1 }, dead: true }, "污点牌。族人的请求不会只来一次。"),
    card("bribe_custom", "收受冰敬", "污点", "财政", ["污点", "贪腐"], { energy: 0 }, { resources: { money: 1, pressure: 1 }, fame: { corruption: 1, clean: -1 }, dead: true }, "污点牌。小钱最容易养成大习惯。"),
    card("protege_scandal", "纵容门生", "污点", "人情", ["污点", "朋党"], { energy: 1 }, { tracks: { "政敌反扑": 1 }, fame: { corruption: 1 }, dead: true }, "污点牌。门生的错，常写到座主名下。"),

    card("public_repute", "清议护身", "清议", "才学", ["清流", "清议", "构筑"], { energy: 1 }, { tracks: { "清议沸腾": -3, "流言滋生": -2, "上意不明": -1 }, resources: { pressure: -1 }, tags: { 清流: 1 } }, "把名声化成护身符。清流路线用它压住流言与清议余波。"),
    card("chain_memorial", "连章追参", "弹劾", "法度", ["清流", "御史", "连招", "构筑"], { energy: 1, pressure: 1 }, { tracks: { "证据不足": -2, "派系阻挠": -2 }, fame: { clean: 1 }, tags: { 清流: 1 } }, "一章不够，就连章追问。若前面已经造势，弹劾会更稳。"),
    card("case_precedent", "成例压案", "公文", "政务", ["能吏", "政务", "构筑"], { energy: 1 }, { tracks: { "流程迟滞": -4, "期限逼近": -2, "上司追责": -1 }, world: { courtPressure: -1 }, tags: { 能吏: 1 } }, "以成例压住争执，适合能吏路线稳定推进公文。"),
    card("joint_review", "部院会审", "法度", "法度", ["能吏", "证据", "御史", "构筑"], { energy: 2, favor: 1 }, { tracks: { "证据不足": -3, "朋党反扑": -2, "派系阻挠": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "把案子拖进多人会审，慢而重，能压住证据与朋党压力。"),
    card("turn_reaction", "借势反咬", "权谋", "权谋", ["权谋", "反制", "构筑"], { energy: 1, pressure: 1 }, { tracks: { "政敌反扑": -4, "朋党反扑": -2, "流言滋生": -1 }, fame: { power: 1, clean: -1 }, tags: { 权谋: 1 } }, "等对方露头，再把暗流导回去。权谋路线处理反扑的核心牌。"),
    card("watch_in_silence", "留中观察", "权谋", "口才", ["权谋", "近君", "构筑"], { energy: 1 }, { tracks: { "上意不明": -3, "期限逼近": 1, "派系阻挠": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, "暂不明发，先看风向。能稳住上意，但会拖慢节奏。"),
    card("people_register", "民册实录", "政务", "政务", ["仁政", "地方", "构筑"], { energy: 1 }, { tracks: { "民怨积累": -3, "灾情蔓延": -2, "钱粮缺口": -1 }, world: { publicMood: 1 }, tags: { 仁政: 1 } }, "把灾民、诉民与粮册记实，仁政路线有了更可靠的抓手。"),
    card("quiet_broker", "暗室调停", "人情", "人情", ["圆滑", "人情", "构筑"], { energy: 1, favor: 1 }, { tracks: { "派系阻挠": -3, "政敌反扑": -2, "流言滋生": -1 }, relations: { rival: { resentment: -1 }, peers: { closeness: 1 } }, tags: { 圆滑: 1 } }, "不在堂上争输赢，只在门内留台阶。"),

    card("npc_mentor_letter", "座师荐札", "人情", "人情", ["NPC", "师门", "举荐"], { energy: 0, favor: 1 }, { tracks: { "举荐不足": -4, "派系阻挠": -2, "上司追责": -1 }, relations: { mentor: { debt: 1, closeness: 1 } }, resources: { pressure: 1 }, tags: { 圆滑: 1 } }, "沈如晦亲笔一札，能替你开门，也会把师门账写得更深。"),
    card("npc_peer_alliance", "同年同盟", "人情", "口才", ["NPC", "同年", "人情"], { energy: 1 }, { tracks: { "流言滋生": -3, "派系阻挠": -2, "清议沸腾": -1 }, relations: { peers: { debt: 1, closeness: 1 } }, tags: { 圆滑: 1 } }, "顾元衡肯替你奔走，但同年之义从来不是白来的。"),
    card("npc_adviser_plan", "幕友筹策", "人物", "政务", ["NPC", "幕友", "能吏"], { energy: 1 }, { tracks: { "流程迟滞": -3, "案卷迟滞": -3, "期限逼近": -1 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "程介把乱麻拆成三步，代价是你得信他的冷算。"),
    card("npc_palace_whisper", "宫门风声", "权谋", "权谋", ["NPC", "近君", "权谋"], { energy: 1, pressure: 1 }, { tracks: { "上意不明": -5, "期限逼近": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, "冯谨递来的半句话，比一整封公文更早到达危险。"),
    card("npc_academy_voice", "山长清议", "清议", "才学", ["NPC", "士林", "清流"], { energy: 1, pressure: 1 }, { tracks: { "清议沸腾": -4, "流言滋生": -2, "派系阻挠": -1 }, world: { scholarOpinion: 2, emperorTrust: -1 }, fame: { clean: 1 }, tags: { 清流: 1 } }, "陶闻道一声轻咳，书院里便有人替你把话说满。"),
    card("npc_clerk_eyes", "胥吏耳目", "人情", "政务", ["NPC", "胥吏", "案牍"], { energy: 0, favor: 1 }, { tracks: { "胥吏欺瞒": -4, "案卷迟滞": -2, "证据不足": -1 }, relations: { clerks: { debt: 1, resentment: -1 } }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, "曹衡的人在柜房里多看一眼，许多假账便藏不住。"),
    card("npc_gentry_grain", "士绅粮券", "财政", "人情", ["NPC", "士绅", "财政"], { energy: 1 }, { tracks: { "钱粮缺口": -4, "民怨积累": -1, "士绅掣肘": -1 }, resources: { money: 1 }, relations: { gentry: { debt: 1, closeness: 1 } }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, "林伯珩让粮车先到县仓，也让你欠了地方一张看不见的券。"),
    card("npc_power_path", "权臣门路", "权谋", "权谋", ["NPC", "权臣", "污点"], { energy: 1, pressure: 1 }, { tracks: { "朋党反扑": -4, "派系阻挠": -2, "政敌反扑": -1 }, fame: { power: 2, clean: -2 }, addStain: "protege_scandal", tags: { 权谋: 1 } }, "严绍的门路宽得像大道，只是路旁每一步都有人记账。")
  ];

  GameData.contacts = [
    { id: "mentor", name: "座师", desc: "升迁和追责时可提供缓冲，但会制造师门人情债。", effect: "举荐 +，人情债 +" },
    { id: "peer_friend", name: "同年好友", desc: "可化解一次小型弹劾，代价是未来要回护同年。", effect: "政敌反扑 -" },
    { id: "adviser", name: "精明幕友", desc: "政务类卡牌偶尔额外降低阻力。", effect: "政务 +1" },
    { id: "qingliu_leader", name: "清流领袖", desc: "清议牌效果更强，使用污点牌时压力更大。", effect: "清流 +，污点压力 +" },
    { id: "inner_servant", name: "内侍线人", desc: "朝廷事件中更易看清上意，但士林评价更敏感。", effect: "上意 -，清名风险 +" },
    { id: "local_clan", name: "地方大族", desc: "钱粮牌更有效，改革阻力也更高。", effect: "钱粮 +，士绅阻力 +" },
    { id: "old_clerk", name: "老成书吏", desc: "案卷与流程事件更容易处理。", effect: "案卷 -" },
    { id: "border_general", name: "边将故交", desc: "御史阶段遇边务事件时可获得额外支持。", effect: "边患 -" },
    { id: "family_uncle", name: "族叔", desc: "可提供银两，但会带来家族牵连。", effect: "银两 +" },
    { id: "hermit_teacher", name: "山林先生", desc: "压力高时提供退路，结局更容易保全名节。", effect: "压力 -" }
  ];

  var cardModes = {
    memorial_direct: [
      { id: "imperial", name: "直陈上意", desc: "重点压低上意不明。", effect: { tracks: { "上意不明": -4 }, world: { emperorTrust: -1 }, tags: { 清流: 1 } }, setFlags: { direct_advice: 1 }, reactionRisk: 1 },
      { id: "scholars", name: "借清议入奏", desc: "争取士林，但更刺眼。", effect: { tracks: { "清议沸腾": -3, "上意不明": -1 }, world: { scholarOpinion: 2, emperorTrust: -1 }, fame: { clean: 1 }, tags: { 清流: 1 } }, setFlags: { public_mandate: 1 }, reactionRisk: 1 }
    ],
    careful_memorial: [
      { id: "safe", name: "委婉试探", desc: "稳妥看清上意。", effect: { tracks: { "上意不明": -2, "派系阻挠": -1 }, world: { emperorTrust: 1 }, tags: { 圆滑: 1 } }, setFlags: { careful_tone: 1 } },
      { id: "delay", name: "缓议留白", desc: "降低派系阻力，但期限更紧。", effect: { tracks: { "派系阻挠": -3, "期限逼近": 1 }, world: { factionHeat: -1 }, tags: { 圆滑: 1 } }, setFlags: { room_to_turn: 1 } }
    ],
    archive_search: [
      { id: "evidence", name: "翻旧档取证", desc: "建立证据前置。", effect: { tracks: { "证据不足": -3, "案卷迟滞": -2 }, tags: { 能吏: 1 } }, setFlags: { records_found: 1 } },
      { id: "procedure", name: "查流程漏洞", desc: "压流程与派系阻力。", effect: { tracks: { "流程迟滞": -3, "派系阻挠": -1 }, tags: { 能吏: 1 } }, setFlags: { procedure_gap: 1 } }
    ],
    audit_accounts: [
      { id: "seal", name: "封账取证", desc: "强取证据，胥吏怨恨上升。", effect: { tracks: { "证据不足": -4 }, relations: { clerks: { resentment: 2, fear: 1 } }, tags: { 能吏: 1 } }, bonusIf: [{ flag: "records_found", effect: { tracks: { "证据不足": -2 } }, text: "旧档对上账册，证据更实。" }], setFlags: { accounts_sealed: 1 }, reactionRisk: 1 },
      { id: "clerks", name: "追问胥吏", desc: "压胥吏欺瞒，取证较慢。", effect: { tracks: { "胥吏欺瞒": -4, "证据不足": -1 }, relations: { clerks: { resentment: 1, fear: 1 } }, tags: { 能吏: 1 } }, setFlags: { clerks_pressed: 1 } }
    ],
    banquet_gentry: [
      { id: "calm", name: "缓和士绅", desc: "降低地方阻力，留下人情债。", effect: { tracks: { "士绅掣肘": -4 }, relations: { gentry: { closeness: 2, debt: 1 } }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, setFlags: { gentry_softened: 1 } },
      { id: "fund", name: "筹措银两", desc: "换银两并小压钱粮，清名受损。", effect: { tracks: { "钱粮缺口": -2 }, resources: { money: 2, favor: -1 }, fame: { clean: -1 }, relations: { gentry: { debt: 1 } }, tags: { 圆滑: 1 } }, setFlags: { gentry_bargain: 1 }, reactionRisk: 1 }
    ],
    survey_fields: [
      { id: "strict", name: "严格丈量", desc: "财政效果强，激怒士绅。", effect: { tracks: { "钱粮缺口": -4, "士绅掣肘": 1 }, world: { fiscalHealth: 2, publicMood: -1 }, relations: { gentry: { resentment: 2 } }, tags: { 能吏: 1 } }, bonusIf: [{ flag: "gentry_softened", effect: { tracks: { "士绅掣肘": -2 } }, text: "宴席余温尚在，反弹被压低。" }], reactionRisk: 1 },
      { id: "gradual", name: "渐进清丈", desc: "效果较慢，民怨较低。", effect: { tracks: { "钱粮缺口": -2, "士绅掣肘": -1 }, world: { fiscalHealth: 1 }, tags: { 能吏: 1 } }, setFlags: { gradual_reform: 1 } }
    ],
    open_granary: [
      { id: "relief", name: "开仓急赈", desc: "强救灾，财政吃紧。", effect: { tracks: { "民怨积累": -4, "灾情蔓延": -3, "钱粮缺口": 1 }, world: { publicMood: 3, fiscalHealth: -1 }, tags: { 仁政: 1 } }, reactionRisk: 1 },
      { id: "register", name: "按册赈济", desc: "慢些，但不太伤钱粮。", effect: { tracks: { "灾情蔓延": -2, "民怨积累": -2 }, world: { publicMood: 1 }, tags: { 仁政: 1 } }, bonusIf: [{ flag: "accounts_sealed", effect: { tracks: { "钱粮缺口": -1 } }, text: "账册已清，赈济更有章法。" }] }
    ],
    strict_interrogation: [
      { id: "fast", name: "严刑速断", desc: "快速压证据与胥吏，酷名上升。", effect: { tracks: { "证据不足": -4, "胥吏欺瞒": -2 }, world: { publicMood: -2 }, fame: { cruel: 2 }, tags: { 酷吏: 1 } }, reactionRisk: 2 },
      { id: "scare", name: "示威逼供", desc: "压胥吏和期限，取证较弱。", effect: { tracks: { "胥吏欺瞒": -4, "期限逼近": -1 }, fame: { cruel: 1 }, tags: { 酷吏: 1 } }, reactionRisk: 1 }
    ],
    conceal_deficit_action: [
      { id: "cover", name: "遮掩过关", desc: "强压钱粮和期限，加入亏空污点。", effect: { tracks: { "钱粮缺口": -5, "期限逼近": -2 }, addStain: "conceal_deficit", fame: { clean: -2, corruption: 2 }, tags: { 贪腐: 1 } }, setFlags: { hidden_deficit: 1 }, reactionRisk: 2 },
      { id: "private_money", name: "自掏补账", desc: "花银两少留污点，但压力更高。", cost: { money: 2, energy: 1 }, effect: { tracks: { "钱粮缺口": -4 }, resources: { pressure: 2 }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, setFlags: { private_cover: 1 } }
    ],
    impeach_unlawful: [
      { id: "clean_case", name: "据证弹劾", desc: "证据越足越稳。", effect: { tracks: { "证据不足": -2, "派系阻挠": -3 }, fame: { clean: 1, power: 1 }, relations: { rival: { resentment: 2 } }, tags: { 清流: 1 } }, bonusIf: [{ flag: "records_found", effect: { tracks: { "证据不足": -3 } }, text: "旧档撑住弹章，证据骤然扎实。" }], reactionRisk: 1 },
      { id: "moral_attack", name: "清议施压", desc: "借舆论打派系，但证据压力不减。", effect: { tracks: { "清议沸腾": -3, "派系阻挠": -2, "证据不足": 1 }, world: { scholarOpinion: 2 }, fame: { clean: 1 }, tags: { 清流: 1 } }, setFlags: { public_mandate: 1 }, reactionRisk: 1 }
    ],
    secret_memorial: [
      { id: "direct_secret", name: "密折直达", desc: "压派系和上意，损士林。", effect: { tracks: { "派系阻挠": -4, "上意不明": -2 }, world: { emperorTrust: 2, scholarOpinion: -2 }, fame: { power: 2, clean: -1 }, tags: { 权谋: 1 } }, setFlags: { secret_channel: 1 }, reactionRisk: 2 },
      { id: "controlled_leak", name: "暗放风声", desc: "压政敌反扑，并制造权名。", effect: { tracks: { "政敌反扑": -3, "朋党反扑": -2 }, fame: { power: 1 }, tags: { 权谋: 1 } }, setFlags: { rumor_control: 1 }, reactionRisk: 1 }
    ],
    seek_inner_tip: [
      { id: "read_mood", name: "探问上意", desc: "建立窥见上意前置。", effect: { tracks: { "上意不明": -4, "期限逼近": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, setFlags: { imperial_mood_known: 1 }, reactionRisk: 1 },
      { id: "buy_secret", name: "买取宫闻", desc: "更强但加入内廷污点。", effect: { tracks: { "上意不明": -5 }, addStain: "inner_palace_contact", world: { scholarOpinion: -1 }, tags: { 权谋: 1 } }, setFlags: { imperial_mood_known: 1 }, reactionRisk: 2 }
    ],
    cross_examine: [
      { id: "question", name: "当堂质问", desc: "压证据和反扑。", effect: { tracks: { "证据不足": -3, "政敌反扑": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, bonusIf: [{ flag: "records_found", effect: { tracks: { "证据不足": -2 } }, text: "旧档在手，质问直抵要害。" }] },
      { id: "trap", name: "设问诱供", desc: "压政敌反扑，但会树怨。", effect: { tracks: { "政敌反扑": -4, "朋党反扑": -1 }, relations: { rival: { resentment: 1 } }, tags: { 权谋: 1 } }, reactionRisk: 1 }
    ],
    report_truth: [
      { id: "plain", name: "据实上报", desc: "重置期限，能名受疑。", effect: { tracks: { "期限逼近": -4, "上司追责": 1 }, world: { emperorTrust: 1 }, fame: { clean: 1, competence: -1 }, tags: { 清流: 1 } } },
      { id: "ask_help", name: "请旨援手", desc: "压上意和钱粮，代价是权名下降。", effect: { tracks: { "上意不明": -2, "钱粮缺口": -2 }, fame: { power: -1 }, relations: { superior: { trust: -1 } }, tags: { 清流: 1 } }, bonusIf: [{ flag: "careful_tone", effect: { tracks: { "上司追责": -2 } }, text: "前文语气留有余地，上司较难发作。" }] }
    ],
    public_petition: [
      { id: "petition", name: "士林联署", desc: "强拉士林，伤皇帝信任。", effect: { tracks: { "清议沸腾": -4, "上意不明": -1 }, world: { scholarOpinion: 3, emperorTrust: -1 }, fame: { clean: 2 }, tags: { 清流: 1 } }, reactionRisk: 1 },
      { id: "lecture", name: "讲学蓄势", desc: "较慢，但建立舆论前置。", effect: { tracks: { "清议沸腾": -2, "派系阻挠": -1 }, world: { scholarOpinion: 1 }, tags: { 清流: 1 } }, setFlags: { public_mandate: 1 } }
    ],
    delay_deliberation: [
      { id: "delay", name: "延议再定", desc: "降派系阻力，但期限更近。", effect: { tracks: { "期限逼近": 2, "派系阻挠": -3, "上意不明": -1 }, world: { factionHeat: -1 }, tags: { 圆滑: 1 } } },
      { id: "cool", name: "冷处理", desc: "缓和清议和反扑。", effect: { tracks: { "清议沸腾": -2, "政敌反扑": -2, "期限逼近": 1 }, world: { factionHeat: -1 }, tags: { 圆滑: 1 } }, setFlags: { cooled_down: 1 } }
    ],
    share_credit: [
      { id: "share", name: "分功于众", desc: "缓和派系和政敌，能名下降。", effect: { tracks: { "派系阻挠": -2, "政敌反扑": -2 }, fame: { competence: -1 }, relations: { superior: { trust: 1 }, peers: { closeness: 1 } }, tags: { 圆滑: 1 } } },
      { id: "shield", name: "分责于众", desc: "压上司追责和流程。", effect: { tracks: { "上司追责": -3, "流程迟滞": -1 }, relations: { superior: { trust: 1 }, peers: { resentment: 1 } }, tags: { 圆滑: 1 } } }
    ],
    withhold_dossier: [
      { id: "leverage", name: "扣案留柄", desc: "压政敌反扑，加入污点。", effect: { tracks: { "证据不足": -2, "政敌反扑": -3 }, relations: { rival: { fear: 2 } }, addStain: "withheld_file", tags: { 权谋: 1 } }, setFlags: { leverage_taken: 1 }, reactionRisk: 2 },
      { id: "reserve", name: "留中不发", desc: "暂压派系，少留痕迹。", effect: { tracks: { "派系阻挠": -2, "朋党反扑": -2 }, relations: { rival: { fear: 1 } }, tags: { 权谋: 1 } }, setFlags: { leverage_taken: 1 }, reactionRisk: 1 }
    ],
    evidence_chain: [
      { id: "chain", name: "坐实证链", desc: "纯粹压证据。", effect: { tracks: { "证据不足": -5 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, bonusIf: [{ flag: "records_found", effect: { tracks: { "证据不足": -2 } }, text: "旧档补上证链缺口。" }] },
      { id: "public_file", name: "公开案卷", desc: "压证据和清议，但刺激反扑。", effect: { tracks: { "证据不足": -3, "清议沸腾": -2, "政敌反扑": 1 }, fame: { clean: 1 }, tags: { 清流: 1 } }, reactionRisk: 1 }
    ],
    humble_apology: [
      { id: "apology", name: "具疏请罪", desc: "压追责与上意。", effect: { tracks: { "上司追责": -3, "上意不明": -1 }, world: { emperorTrust: 1 }, fame: { power: -1 }, tags: { 圆滑: 1 } } },
      { id: "self_blame", name: "引咎自保", desc: "大幅降追责，损能名。", effect: { tracks: { "上司追责": -4, "政敌反扑": -1 }, fame: { competence: -1, clean: 1 }, resources: { pressure: 1 }, tags: { 圆滑: 1 } } }
    ],
    burn_private_letter: [
      { id: "burn", name: "焚毁私札", desc: "压反扑，留下扣案污点。", effect: { tracks: { "政敌反扑": -3, "证据不足": -1 }, fame: { clean: -1, power: 1 }, addStain: "withheld_file", tags: { 权谋: 1 } }, reactionRisk: 2 },
      { id: "redact", name: "删改留底", desc: "压反扑较弱，但保留证据前置。", effect: { tracks: { "政敌反扑": -2 }, fame: { power: 1 }, tags: { 权谋: 1 } }, setFlags: { records_found: 1 }, reactionRisk: 1 }
    ],
    public_repute: [
      { id: "protect", name: "以名护身", desc: "压清议与流言，降低压力。", effect: { tracks: { "清议沸腾": -3, "流言滋生": -2, "上意不明": -1 }, resources: { pressure: -1 }, tags: { 清流: 1 } }, setFlags: { public_mandate: 1 } },
      { id: "summon_voice", name: "召士林声援", desc: "压派系，但更刺眼。", effect: { tracks: { "派系阻挠": -3, "清议沸腾": -1 }, world: { scholarOpinion: 1, emperorTrust: -1 }, fame: { clean: 1 }, tags: { 清流: 1 } }, setFlags: { public_mandate: 1 }, reactionRisk: 1 }
    ],
    chain_memorial: [
      { id: "follow", name: "连章追参", desc: "若已借清议造势，证据效果增强。", effect: { tracks: { "证据不足": -2, "派系阻挠": -2 }, fame: { clean: 1 }, tags: { 清流: 1 } }, bonusIf: [{ flag: "public_mandate", effect: { tracks: { "证据不足": -2, "清议沸腾": -1 } }, text: "士林声势撑住弹章。" }], reactionRisk: 1 },
      { id: "hold_line", name: "守法不退", desc: "压朋党与政敌反扑，少取证。", effect: { tracks: { "朋党反扑": -2, "政敌反扑": -2, "证据不足": -1 }, fame: { clean: 1 }, tags: { 清流: 1 } } }
    ],
    case_precedent: [
      { id: "precedent", name: "援引成例", desc: "稳定压流程与期限。", effect: { tracks: { "流程迟滞": -4, "期限逼近": -2, "上司追责": -1 }, world: { courtPressure: -1 }, tags: { 能吏: 1 } }, setFlags: { procedure_gap: 1 } },
      { id: "deadline", name: "限期批转", desc: "更快，但朝局压力上升。", effect: { tracks: { "期限逼近": -4, "流程迟滞": -2 }, world: { courtPressure: 1 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, reactionRisk: 1 }
    ],
    joint_review: [
      { id: "joint", name: "会审取证", desc: "重压证据与朋党反扑。", effect: { tracks: { "证据不足": -3, "朋党反扑": -2, "派系阻挠": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, bonusIf: [{ flag: "records_found", effect: { tracks: { "证据不足": -2 } }, text: "旧档进入会审，证据更完整。" }] },
      { id: "ministry", name: "借部院名义", desc: "压派系和上司追责。", effect: { tracks: { "派系阻挠": -3, "上司追责": -2, "流程迟滞": -1 }, tags: { 能吏: 1 } } }
    ],
    turn_reaction: [
      { id: "counter", name: "借势反咬", desc: "强压政敌和朋党反扑。", effect: { tracks: { "政敌反扑": -4, "朋党反扑": -2, "流言滋生": -1 }, fame: { power: 1, clean: -1 }, tags: { 权谋: 1 } }, bonusIf: [{ flag: "leverage_taken", effect: { tracks: { "政敌反扑": -2 } }, text: "把柄在手，反咬更狠。" }], reactionRisk: 1 },
      { id: "misdirect", name: "移祸别支", desc: "降低威胁来源，但留下权名。", effect: { tracks: { "派系阻挠": -2, "朋党反扑": -3 }, fame: { power: 1 }, tags: { 权谋: 1 } }, setFlags: { rumor_control: 1 }, reactionRisk: 1 }
    ],
    watch_in_silence: [
      { id: "watch", name: "留中观察", desc: "看清上意，期限略紧。", effect: { tracks: { "上意不明": -3, "期限逼近": 1, "派系阻挠": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, setFlags: { imperial_mood_known: 1 } },
      { id: "signal", name: "暗递风声", desc: "压上意与政敌，风险较高。", effect: { tracks: { "上意不明": -2, "政敌反扑": -2 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, setFlags: { secret_channel: 1 }, reactionRisk: 1 }
    ]
  };

  GameData.cards.forEach(function (card) {
    if (cardModes[card.id]) card.modes = cardModes[card.id];
    if (["secret_memorial", "withhold_dossier", "divide_faction", "relief_register", "burn_private_letter"].indexOf(card.id) >= 0) {
      card.reactionRisk = Math.max(card.reactionRisk || 0, 1);
    }
  });
})();
