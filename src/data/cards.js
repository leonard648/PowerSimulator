(function () {
  window.GameData = window.GameData || {};

  function card(id, name, type, domain, tags, cost, effect, desc) {
    return { id: id, name: name, type: type, domain: domain, tags: tags, cost: cost || {}, effect: effect || {}, desc: desc };
  }

  GameData.cards = [
    card("memorial_direct", "直陈国是", "奏疏", "经术", ["清流", "奏疏", "帝心", "首辅"], { energy: 1, pressure: 1 }, { tracks: { "帝心未定": -3, "言路沸腾": -1 }, world: { emperorTrust: -1, scholarOpinion: 2 }, tags: { 清流: 1 } }, "以直言把利害呈到君前，能得清名，也最容易刺痛帝心。"),
    card("careful_memorial", "婉陈利害", "奏疏", "口才", ["圆滑", "奏疏", "帝心", "首辅"], { energy: 1 }, { tracks: { "帝心未定": -2, "阁臣观望": -1 }, world: { emperorTrust: 1 }, tags: { 圆滑: 1 } }, "避锋芒而陈利害，慢些，却更稳。"),
    card("academy_lecture", "经筵讲读", "经筵", "经术", ["清流", "经术", "帝师", "首辅"], { energy: 1 }, { tracks: { "幼主学业": -3, "言路沸腾": -1 }, fame: { clean: 1, literary: 2 }, world: { scholarOpinion: 1 }, tags: { 清流: 1 } }, "把帝师名分落到经筵规矩上。"),
    card("write_edict", "票拟成旨", "公文", "政务", ["能吏", "票拟", "内阁"], { energy: 1 }, { tracks: { "部院迟滞": -2, "帝心未定": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "以票拟把皇命与制度接起来。"),
    card("visit_mentor", "入宫请示", "人情", "人情", ["人情", "内廷", "帝心"], { energy: 1 }, { tracks: { "帝心未定": -2, "内廷牵连": -2 }, relations: { mentor: { closeness: 2, debt: 1 }, emperor: { trust: 1 } }, resources: { favor: 1 }, tags: { 圆滑: 1 } }, "请太后与司礼监先定口风，能救急，也会留下宫中痕迹。"),
    card("peer_letter", "会商阁臣", "人情", "人情", ["人情", "内阁", "圆滑"], { energy: 1, favor: 1 }, { tracks: { "阁臣观望": -3, "部院迟滞": -1, "言路沸腾": -1 }, relations: { peers: { closeness: 2, debt: 1 } }, tags: { 圆滑: 1 } }, "让阁臣先有参与感，事后也较难置身事外。"),
    card("peer_mediation", "阁中转圜", "人情", "口才", ["圆滑", "内阁", "人情"], { energy: 1 }, { tracks: { "阁臣观望": -2, "言路沸腾": -2, "权势过盛": -1 }, relations: { peers: { closeness: 1, debt: 1 }, rival: { resentment: -1 } }, tags: { 圆滑: 1 } }, "把锋芒先放在阁议里磨一磨。"),
    card("refuse_gift", "峻拒馈遗", "操守", "操守", ["清流", "家门", "操守"], { energy: 1, money: 1 }, { tracks: { "家门牵连": -3, "身后清算": -1 }, fame: { clean: 2 }, world: { scholarOpinion: 1 }, relations: { superior: { debt: -1 } }, tags: { 清流: 1 } }, "手干净，家门路也窄些。"),
    card("court_debate", "廷议压阵", "廷议", "口才", ["清流", "朝廷", "奏疏"], { energy: 2, pressure: 1 }, { tracks: { "言路沸腾": -3, "阁臣观望": -2 }, fame: { clean: 1, power: 1 }, relations: { rival: { resentment: 2 } }, tags: { 清流: 1 } }, "把话说在明处，胜负都不会悄无声息。"),
    card("archive_search", "检核旧牍", "法度", "政务", ["法度", "证据", "内阁"], { energy: 1 }, { tracks: { "身后清算": -2, "部院迟滞": -2, "高拱余波": -1 }, tags: { 能吏: 1 } }, "旧牍里常有新局的骨架。"),
    card("seal_document", "申饬部院", "公文", "政务", ["政务", "部院", "考成"], { energy: 1 }, { tracks: { "部院迟滞": -3, "考成压力": -1, "帝心未定": -1 }, world: { courtPressure: -1 }, tags: { 能吏: 1 } }, "不动声色地把事情推回流程。"),
    card("family_support", "家门节用", "家族", "家族", ["家门", "资源"], { energy: 0 }, { resources: { money: 2 }, tracks: { "家门牵连": 1 }, addStain: "family_obligation", tags: { 圆滑: 1 } }, "家门可以支应，也会让家门入账。"),
    card("marriage_plea", "亲族通问", "家族", "人情", ["家门", "人情"], { energy: 1 }, { tracks: { "家门牵连": -2, "阁臣观望": -1 }, relations: { superior: { trust: 1, debt: 1 }, peers: { debt: 1 } }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, "私门一句话能软化许多铁面，也会被记在私门名下。"),
    card("ritual_poem", "制义立名", "经术", "经术", ["清流", "经术", "帝师"], { energy: 1 }, { tracks: { "幼主学业": -2, "言路沸腾": -1 }, fame: { literary: 2, clean: 1 }, tags: { 清流: 1 } }, "经术声望先于政绩抵达人心。"),
    card("educate_heir", "严督幼主", "经筵", "经术", ["帝心", "帝师", "近君"], { energy: 2 }, { tracks: { "幼主学业": -4, "帝心未定": -1 }, world: { emperorTrust: 2 }, fame: { literary: 1 }, tags: { 能吏: 1 } }, "把规矩立在少年皇帝日常里。"),
    card("copy_classics", "进讲经义", "经术", "经术", ["经术", "清流", "帝师"], { energy: 1 }, { tracks: { "幼主学业": -2, "帝心未定": -1 }, fame: { literary: 1 }, tags: { 清流: 1 } }, "旧学不是捷径，却能把师道根基扎深。"),
    card("private_warning", "私下戒饬", "人情", "口才", ["圆滑", "人情", "内阁"], { energy: 1, favor: 1 }, { tracks: { "言路沸腾": -2, "阁臣观望": -2 }, relations: { peers: { resentment: -1 }, mentor: { closeness: 1 } }, tags: { 圆滑: 1 } }, "把话留在屋里，给彼此留些脸面。"),
    card("medical_rest", "静养调息", "休养", "体魄", ["休养"], { energy: 0 }, { resources: { pressure: -4 }, tracks: { "身后清算": 1 }, tags: { 恬退: 1 } }, "把身体从案牍堆里暂时抢回来。"),

    card("survey_fields", "清丈田亩", "政务", "财赋", ["能吏", "财赋", "清丈"], { energy: 2 }, { tracks: { "清丈阻力": -4, "地方抵制": 1, "财赋缺口": -1 }, world: { fiscalHealth: 2, publicMood: -1 }, relations: { gentry: { resentment: 2 } }, tags: { 能吏: 1 } }, "把隐田摊到阳光下，账面会好看，地方不会高兴。"),
    card("open_granary", "宽缓催科", "政务", "仁政", ["仁政", "地方", "财赋"], { energy: 1, money: 1 }, { tracks: { "地方抵制": -3, "言路沸腾": -1, "财赋缺口": 1 }, world: { publicMood: 3, fiscalHealth: -1 }, tags: { 仁政: 1 } }, "让百姓先喘气，再谈账册。"),
    card("audit_accounts", "核户部册", "法度", "财赋", ["法度", "证据", "户部"], { energy: 1 }, { tracks: { "财赋缺口": -3, "部院迟滞": -2 }, relations: { clerks: { resentment: 1, fear: 1 } }, tags: { 能吏: 1 } }, "账册一封，许多人就睡不安稳。"),
    card("banquet_gentry", "约谈乡绅", "人情", "人情", ["圆滑", "地方", "清丈"], { energy: 1 }, { tracks: { "地方抵制": -3, "清丈阻力": -1 }, resources: { favor: -1 }, fame: { clean: -1 }, relations: { gentry: { closeness: 2, debt: 1 } }, tags: { 圆滑: 1 } }, "席间一句话，能换来几县账册暂时顺手。"),
    card("strict_interrogation", "严核逋欠", "法度", "法度", ["酷吏", "法度", "考成"], { energy: 1, pressure: 1 }, { tracks: { "清丈阻力": -3, "部院迟滞": -2 }, world: { publicMood: -2 }, fame: { cruel: 2 }, tags: { 酷吏: 1 } }, "快，但每一道催逼都会进史笔。"),
    card("borrow_treasury", "挪补国用", "财赋", "财赋", ["财赋", "能吏", "户部"], { energy: 1 }, { tracks: { "财赋缺口": -4, "河工急迫": -1 }, world: { fiscalHealth: -2 }, resources: { money: 1 }, tags: { 能吏: 1 } }, "拆东墙补西墙，至少眼前的墙不倒。"),
    card("report_truth", "据实奏报", "奏疏", "操守", ["清流", "财赋", "奏疏"], { energy: 1 }, { tracks: { "帝心未定": -2, "财赋缺口": -2, "言路沸腾": 1 }, world: { emperorTrust: 1 }, fame: { clean: 1, competence: -1 }, tags: { 清流: 1 } }, "把麻烦交给君前，也把自己摆到明处。"),
    card("conceal_deficit_action", "暗补亏额", "污点", "财赋", ["贪腐", "污点", "财赋"], { energy: 1, money: 1 }, { tracks: { "财赋缺口": -5, "身后清算": 1 }, addStain: "conceal_deficit", fame: { clean: -2, corruption: 2 }, tags: { 贪腐: 1 } }, "账平了，亏心也入账了。"),
    card("repair_waterworks", "支应河工", "政务", "河工", ["仁政", "河工", "工程"], { energy: 2, money: 1 }, { tracks: { "河工急迫": -4, "财赋缺口": 1 }, world: { publicMood: 2, fiscalHealth: -1 }, fame: { competence: 1 }, tags: { 仁政: 1, 能吏: 1 } }, "费钱费力，但能让来年水患少一些。"),
    card("pacify_lawsuit", "缓释民怨", "法度", "仁政", ["仁政", "地方", "清丈"], { energy: 2 }, { tracks: { "地方抵制": -3, "言路沸腾": -2 }, fame: { clean: 1 }, relations: { gentry: { resentment: 1 } }, tags: { 仁政: 1 } }, "替百姓留一句话，也会让大户记一笔。"),
    card("commercial_tax", "折银归并", "财赋", "财赋", ["财赋", "能吏", "一条鞭"], { energy: 1 }, { tracks: { "财赋缺口": -3, "部院迟滞": -1 }, world: { fiscalHealth: 2, publicMood: -1, scholarOpinion: -1 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "从活水处取钱，水也会泛浑。"),
    card("comfort_people", "张榜安民", "清议", "口才", ["仁政", "地方"], { energy: 1 }, { tracks: { "地方抵制": -2, "言路沸腾": -2 }, world: { publicMood: 2 }, fame: { clean: 1 }, tags: { 仁政: 1 } }, "让地方知道新政不是只要银两。"),
    card("catch_bandits", "整饬边备", "政务", "边防", ["边防", "能吏"], { energy: 1 }, { tracks: { "边镇军饷": -3, "部院迟滞": -1 }, relations: { clerks: { fear: 1 } }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "边备先稳，朝局才有余地。"),
    card("protect_subordinate", "保全能臣", "人情", "操守", ["仁政", "部院", "人情"], { energy: 1, pressure: 1 }, { tracks: { "部院迟滞": 1, "言路沸腾": -2 }, relations: { clerks: { resentment: -2, closeness: 1 } }, fame: { clean: 1 }, tags: { 仁政: 1 } }, "不把责任全推给办事的人，会有人记你一辈子。"),
    card("scapegoat_clerk", "推出属吏", "权谋", "权谋", ["权谋", "酷吏", "部院"], { energy: 1 }, { tracks: { "言路沸腾": -3, "部院迟滞": -1 }, relations: { clerks: { resentment: 3 } }, fame: { cruel: 1, clean: -1 }, tags: { 权谋: 1, 酷吏: 1 } }, "找一个能承受罪名的人，事情就容易结束。"),
    card("public_works", "修堤通漕", "政务", "河工", ["仁政", "河工", "工程"], { energy: 2, money: 1 }, { tracks: { "河工急迫": -3, "地方抵制": -1 }, world: { publicMood: 2 }, tags: { 仁政: 1 } }, "堤岸稳了，怨气也会散一些。"),
    card("night_reading", "夜核考册", "政务", "体魄", ["能吏", "考成"], { energy: 1, pressure: 1 }, { tracks: { "考成压力": -3, "部院迟滞": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "把白日不肯动的事拖到夜里处理。"),
    card("seal_grain", "封册验田", "法度", "财赋", ["法度", "财赋", "清丈"], { energy: 1 }, { tracks: { "清丈阻力": -2, "财赋缺口": -2, "地方抵制": -1 }, relations: { gentry: { resentment: 1 } }, tags: { 能吏: 1 } }, "册页一封，谁也不能再说只是误会。"),
    card("village_covenant", "乡约劝输", "政务", "口才", ["仁政", "地方", "人情"], { energy: 1 }, { tracks: { "地方抵制": -2, "言路沸腾": -1, "清丈阻力": -1 }, world: { publicMood: 1 }, tags: { 仁政: 1 } }, "借地方规约约束地方，温和，却见效慢。"),
    card("salt_levy_audit", "核盐课账", "财赋", "财赋", ["财赋", "法度", "户部"], { energy: 2 }, { tracks: { "财赋缺口": -3, "部院迟滞": -2 }, world: { fiscalHealth: 1 }, relations: { gentry: { resentment: 1 } }, tags: { 能吏: 1 } }, "盐课里藏着银子，也藏着许多人的活路。"),
    card("relief_register", "编审役册", "政务", "财赋", ["能吏", "一条鞭", "户籍"], { energy: 2 }, { tracks: { "清丈阻力": -2, "财赋缺口": -2, "部院迟滞": -1 }, world: { fiscalHealth: 1 }, tags: { 能吏: 1 } }, "役册清楚，旧弊就少了藏身处。"),
    card("hire_adviser", "延揽司务", "人物", "政务", ["人物", "部院", "能吏"], { money: 1 }, { buff: { domain: "政务", amount: 1 }, tracks: { "部院迟滞": -1 }, tags: { 能吏: 1 } }, "懂部院的人能帮你把章程落到笔尖。"),
    card("people_register", "清审黄册", "政务", "财赋", ["能吏", "户籍", "清丈"], { energy: 1 }, { tracks: { "清丈阻力": -2, "财赋缺口": -2 }, world: { fiscalHealth: 1 }, tags: { 能吏: 1 } }, "黄册不清，所有新法都无根。"),
    card("case_precedent", "援引成例", "法度", "法度", ["能吏", "成例", "考成"], { energy: 1 }, { tracks: { "部院迟滞": -3, "考成压力": -2 }, world: { courtPressure: -1 }, tags: { 能吏: 1 } }, "成例能替锋芒加一层鞘。"),

    card("impeach_unlawful", "反劾言官", "弹劾", "法度", ["清流", "言路", "法度"], { energy: 1, pressure: 1 }, { tracks: { "言路沸腾": -2, "权势过盛": 1 }, fame: { power: 1 }, relations: { rival: { resentment: 2, fear: 1 } }, tags: { 权谋: 1 } }, "言官的笔是刀，首辅也可以问刀从何来。"),
    card("secret_memorial", "密奏帝前", "权谋", "权谋", ["权谋", "帝心", "污点"], { energy: 1, pressure: 1 }, { tracks: { "帝心未定": -3, "言路沸腾": -2 }, world: { emperorTrust: 2, scholarOpinion: -2 }, fame: { power: 2, clean: -1 }, tags: { 权谋: 1 } }, "绕开众目，直入君前。"),
    card("withhold_dossier", "扣留旧案", "权谋", "权谋", ["权谋", "把柄", "清算"], { energy: 1 }, { tracks: { "身后清算": -3, "言路沸腾": -1 }, relations: { rival: { fear: 2 } }, addStain: "withheld_file", tags: { 权谋: 1 } }, "案卷不只证明事实，也证明谁该害怕。"),
    card("plant_protege", "安插门生", "权谋", "人情", ["权谋", "人情", "部院"], { energy: 1, favor: 1 }, { tracks: { "部院迟滞": -2, "阁臣观望": -2 }, fame: { power: 2, clean: -1 }, relations: { clerks: { debt: 1 } }, tags: { 权谋: 1 } }, "把人放在关键处，事情就会自己转向。"),
    card("divide_faction", "离间攻讦", "权谋", "权谋", ["权谋", "言路", "内阁"], { energy: 2, pressure: 1 }, { tracks: { "言路沸腾": -3, "阁臣观望": -2 }, world: { factionHeat: -2 }, fame: { power: 1, cruel: 1 }, tags: { 权谋: 1 } }, "让他们互相猜疑，比亲自出手省力。"),
    card("public_petition", "士林公论", "清议", "经术", ["清流", "士林", "言路"], { energy: 2 }, { tracks: { "言路沸腾": -3, "帝心未定": 1 }, world: { scholarOpinion: 3, emperorTrust: -1 }, fame: { clean: 2 }, tags: { 清流: 1 } }, "让读书人替新政说话，声音会很大，也很刺耳。"),
    card("cross_examine", "廷辩质证", "弹劾", "口才", ["法度", "朝廷", "言路"], { energy: 2 }, { tracks: { "言路沸腾": -2, "身后清算": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "当面问到对方露怯，是最干净的胜利。"),
    card("seek_inner_tip", "探问宫门", "权谋", "权谋", ["权谋", "内廷", "帝心"], { energy: 1, money: 1 }, { tracks: { "帝心未定": -4, "身后清算": 1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, addStain: "inner_palace_contact", tags: { 权谋: 1 } }, "宫门里的风，比朝堂上的话来得早。"),
    card("resign_for_principle", "请归守制", "清议", "操守", ["清流", "夺情", "恬退"], { energy: 2 }, { tracks: { "夺情非议": -5, "言路沸腾": -2, "部院迟滞": 2 }, fame: { clean: 3, power: -2 }, resources: { pressure: -3 }, tags: { 清流: 1, 恬退: 1 } }, "退一步未必能保新政，却能保名教。"),
    card("share_credit", "分功部院", "人情", "口才", ["圆滑", "内阁", "部院"], { energy: 1 }, { tracks: { "阁臣观望": -2, "部院迟滞": -2, "权势过盛": -1 }, fame: { competence: -1 }, relations: { peers: { closeness: 1 }, clerks: { trust: 1 } }, tags: { 圆滑: 1 } }, "功劳分出去，责任也分出去。"),
    card("frugal_house", "裁抑冗费", "财赋", "财赋", ["财赋", "能吏", "考成"], { energy: 2 }, { tracks: { "财赋缺口": -3, "部院迟滞": -1, "阁臣观望": 1 }, world: { fiscalHealth: 2 }, tags: { 能吏: 1 } }, "省下来的银子，原本都在别人的碗里。"),
    card("smooth_transfer", "两边转圜", "人情", "口才", ["圆滑", "人情", "朝廷"], { energy: 1, favor: 1 }, { tracks: { "阁臣观望": -3, "言路沸腾": -1 }, relations: { rival: { resentment: -1 }, peers: { closeness: 1 } }, tags: { 圆滑: 1 } }, "让每一边都觉得还有台阶。"),
    card("evidence_chain", "坐实证链", "法度", "法度", ["法度", "证据", "清算"], { energy: 2 }, { tracks: { "身后清算": -4, "言路沸腾": -1 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "证据一环扣一环，话就少了。"),
    card("humble_apology", "具疏自辩", "奏疏", "口才", ["圆滑", "奏疏", "帝心"], { energy: 1 }, { tracks: { "帝心未定": -3, "权势过盛": -1 }, world: { emperorTrust: 1 }, fame: { power: -1 }, tags: { 圆滑: 1 } }, "先把姿态放低，才有余地把事翻回来。"),
    card("delay_deliberation", "延议冷处", "公文", "口才", ["圆滑", "内阁"], { energy: 1 }, { tracks: { "言路沸腾": -2, "阁臣观望": -2, "部院迟滞": 1 }, world: { factionHeat: -1 }, tags: { 圆滑: 1 } }, "拖延不是无为，是等刀离开脖颈。"),
    card("strict_quota", "严行考成", "政务", "政务", ["能吏", "考成", "政策"], { energy: 2 }, { tracks: { "部院迟滞": -4, "考成压力": -2 }, world: { courtPressure: -1, publicMood: -1 }, fame: { competence: 2 }, tags: { 能吏: 1 } }, "让所有人按时交卷，也让所有人恨你。"),
    card("quiet_compensation", "暗中补偿", "人情", "人情", ["圆滑", "地方", "财赋"], { money: 1 }, { tracks: { "地方抵制": -2, "言路沸腾": -1 }, fame: { clean: -1 }, tags: { 圆滑: 1 } }, "有些账不能写进公文。"),
    card("wind_hearsay", "风闻弹驳", "弹劾", "口才", ["清流", "言路", "朝廷"], { energy: 1, pressure: 1 }, { tracks: { "言路沸腾": -2, "权势过盛": -1, "身后清算": 1 }, world: { scholarOpinion: 1 }, tags: { 清流: 1 } }, "风闻可用，代价是风也会吹回自己身上。"),
    card("summon_witness", "传取证词", "法度", "法度", ["证据", "法度", "清算"], { energy: 1, favor: 1 }, { tracks: { "身后清算": -4, "言路沸腾": 1 }, relations: { rival: { resentment: 1 } }, tags: { 能吏: 1 } }, "让沉默的人走到堂前，局势就变了。"),
    card("imperial_mood", "揣摩圣意", "权谋", "权谋", ["帝心", "权谋"], { energy: 1 }, { tracks: { "帝心未定": -3, "阁臣观望": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, "并非每一句话都写在谕旨里。"),
    card("burn_private_letter", "焚毁私札", "权谋", "权谋", ["权谋", "家门", "污点"], { energy: 1 }, { tracks: { "家门牵连": -3, "身后清算": -1 }, fame: { clean: -1, power: 1 }, addStain: "withheld_file", tags: { 权谋: 1 } }, "火能烧纸，烧不尽别人心里的版本。"),
    card("public_repute", "以名护政", "清议", "经术", ["清流", "士林", "经术"], { energy: 1 }, { tracks: { "言路沸腾": -3, "帝心未定": -1 }, resources: { pressure: -1 }, tags: { 清流: 1 } }, "用名声替新政挡一阵风。"),
    card("chain_memorial", "连章自明", "奏疏", "法度", ["清流", "奏疏", "连招"], { energy: 1, pressure: 1 }, { tracks: { "身后清算": -2, "帝心未定": -2 }, fame: { clean: 1 }, tags: { 清流: 1 } }, "一章不够，就连章说明。若前面已经造势，自辩会更稳。"),
    card("joint_review", "部院会核", "法度", "法度", ["能吏", "证据", "部院"], { energy: 2, favor: 1 }, { tracks: { "部院迟滞": -3, "身后清算": -2, "阁臣观望": -2 }, fame: { competence: 1 }, tags: { 能吏: 1 } }, "把案子拖进多人会核，慢而重，能压住口实。"),
    card("turn_reaction", "借势反咬", "权谋", "权谋", ["权谋", "言路", "反制"], { energy: 1, pressure: 1 }, { tracks: { "言路沸腾": -4, "权势过盛": -1 }, fame: { power: 1, clean: -1 }, tags: { 权谋: 1 } }, "抓住对手破绽，反咬比辩解更快。"),
    card("watch_in_silence", "留中观察", "权谋", "权谋", ["权谋", "帝心", "晚局"], { energy: 1 }, { tracks: { "帝心未定": -3, "身后清算": 1, "阁臣观望": -1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, "先看清帝心，再决定落笔。"),

    card("npc_mentor_letter", "太后手谕", "人情", "人情", ["NPC", "内廷", "帝心"], { energy: 0, favor: 1 }, { tracks: { "帝心未定": -3, "内廷牵连": -2 }, relations: { mentor: { debt: 1, closeness: 1 } }, resources: { pressure: 1 }, tags: { 圆滑: 1 } }, "李太后一句手谕，能替你开路，也会把宫中痕迹写深。"),
    card("npc_peer_alliance", "司礼监递话", "人情", "权谋", ["NPC", "内廷", "权谋"], { energy: 1 }, { tracks: { "帝心未定": -2, "内廷牵连": -2, "言路沸腾": -1 }, relations: { mentor: { debt: 1, closeness: 1 } }, tags: { 圆滑: 1 } }, "冯保肯替你递话，但宫门消息从来不是白来的。"),
    card("npc_academy_voice", "阁臣缓颊", "人情", "口才", ["NPC", "内阁", "圆滑"], { energy: 1 }, { tracks: { "阁臣观望": -3, "言路沸腾": -1 }, relations: { peers: { closeness: 1 } }, tags: { 圆滑: 1 } }, "申时行替你留半句余地。"),
    card("npc_adviser_plan", "家门戒牒", "人物", "操守", ["NPC", "家门", "清流"], { energy: 1 }, { tracks: { "家门牵连": -3, "身后清算": -1 }, fame: { clean: 1 }, tags: { 清流: 1 } }, "把话先说给家门听，免得别人替你说。"),
    card("npc_clerk_eyes", "边镇急递", "人情", "边防", ["NPC", "边防", "能吏"], { energy: 0, favor: 1 }, { tracks: { "边镇军饷": -4, "部院迟滞": -1 }, relations: { clerks: { debt: 1, trust: 1 } }, tags: { 能吏: 1 } }, "戚继光的急递比部院公文更快。"),
    card("npc_gentry_grain", "河工图册", "政务", "河工", ["NPC", "河工", "能吏"], { energy: 1 }, { tracks: { "河工急迫": -4, "财赋缺口": -1 }, resources: { pressure: 1 }, relations: { clerks: { debt: 1, closeness: 1 } }, tags: { 能吏: 1 } }, "潘季驯把河道画在纸上，也把银两缺口画在你眼前。"),
    card("npc_power_path", "言路留名", "清议", "清议", ["NPC", "言路", "清流"], { energy: 1, pressure: 1 }, { tracks: { "言路沸腾": -3, "夺情非议": -2, "帝心未定": 1 }, fame: { clean: 2, power: -1 }, tags: { 清流: 1 } }, "邹元标的直声未必帮你，却能提醒你后世会如何看。"),

    card("conceal_deficit", "财赋亏额", "污点", "财赋", ["污点", "财赋"], {}, {}, "账册里被遮住的亏额，日后可能重新见光。"),
    card("withheld_file", "扣案留柄", "污点", "权谋", ["污点", "权谋"], {}, {}, "曾经压下的一页案卷，终会寻找重见天日的时辰。"),
    card("inner_palace_contact", "内廷牵连", "污点", "内廷", ["污点", "内廷"], {}, {}, "宫门里的半句话，能救一案，也能毁一生。"),
    card("family_obligation", "家门私债", "污点", "家门", ["污点", "家门"], {}, {}, "家门人情入档，日后会被说成私门。"),
    card("protege_scandal", "门生牵连", "污点", "人情", ["污点", "门生"], {}, {}, "门生故旧太多，功劳和罪名都会沿着这张网传回来。"),
    card("sleepless", "彻夜不寐", "心病", "体魄", ["心病"], {}, {}, "夜深之后，案牍仍在眼前翻动。"),
    card("guilty_conscience", "名教不安", "心病", "操守", ["心病"], {}, {}, "夺情、严法与清名纠缠不散。"),
    card("fear_purge", "惧身后清算", "心病", "权谋", ["心病"], {}, {}, "还在生前，便已听见身后翻案的纸声。"),
    card("burnout", "积劳成疾", "心病", "体魄", ["心病"], {}, {}, "新政压在身上，也压进骨里。")
  ];

  GameData.contacts = [
    { id: "mentor", name: "内廷奥援", desc: "李太后与冯保可暂稳帝心，但会加深内廷牵连。", effect: "帝心 -，内廷风险 +" },
    { id: "peer_friend", name: "阁臣缓颊", desc: "可化解一次中枢观望，代价是分出功劳与责任。", effect: "阁臣观望 -" },
    { id: "adviser", name: "部院司务", desc: "政务类手段偶尔额外压低部院迟滞。", effect: "政务 +1" },
    { id: "qingliu_leader", name: "士林公论", desc: "清议手段更强，但帝心更敏感。", effect: "清流 +，帝心风险 +" },
    { id: "inner_servant", name: "司礼监耳目", desc: "更容易看清上意，但外廷更疑内廷牵连。", effect: "帝心 -，内廷污点 +" },
    { id: "local_clan", name: "地方大户", desc: "财赋手段短期更有效，清丈阻力也更高。", effect: "财赋 +，地方阻力 +" },
    { id: "old_clerk", name: "户部老吏", desc: "册页与流程事件更容易处理。", effect: "部院迟滞 -" },
    { id: "border_general", name: "边镇急递", desc: "遇边防事件时可获得额外支持。", effect: "边镇军饷 -" },
    { id: "family_uncle", name: "家门亲族", desc: "可提供银两，但带来家门牵连。", effect: "银两 +" },
    { id: "hermit_teacher", name: "名教故交", desc: "压力高时提供退路，结局更容易保全名节。", effect: "压力 -" }
  ];

  var cardModes = {
    memorial_direct: [
      { id: "imperial", name: "直陈帝心", desc: "重点压低帝心未定。", effect: { tracks: { "帝心未定": -4 }, world: { emperorTrust: -1 }, tags: { 清流: 1 } }, setFlags: { direct_advice: 1 }, reactionRisk: 1 },
      { id: "scholars", name: "借公论入奏", desc: "压言路，但更刺眼。", effect: { tracks: { "言路沸腾": -3, "帝心未定": -1 }, world: { scholarOpinion: 2, emperorTrust: -1 }, fame: { clean: 1 }, tags: { 清流: 1 } }, setFlags: { public_mandate: 1 }, reactionRisk: 1 }
    ],
    careful_memorial: [
      { id: "safe", name: "婉转试探", desc: "稳妥看清帝心。", effect: { tracks: { "帝心未定": -2, "阁臣观望": -1 }, world: { emperorTrust: 1 }, tags: { 圆滑: 1 } }, setFlags: { careful_tone: 1 } },
      { id: "delay", name: "缓议留白", desc: "降阁臣观望，但流程更慢。", effect: { tracks: { "阁臣观望": -3, "部院迟滞": 1 }, world: { factionHeat: -1 }, tags: { 圆滑: 1 } }, setFlags: { room_to_turn: 1 } }
    ],
    archive_search: [
      { id: "evidence", name: "翻旧牍取证", desc: "建立清算前置。", effect: { tracks: { "身后清算": -3, "高拱余波": -2 }, tags: { 能吏: 1 } }, setFlags: { records_found: 1 } },
      { id: "procedure", name: "查流程漏洞", desc: "压部院迟滞和阁臣观望。", effect: { tracks: { "部院迟滞": -3, "阁臣观望": -1 }, tags: { 能吏: 1 } }, setFlags: { procedure_gap: 1 } }
    ],
    audit_accounts: [
      { id: "seal", name: "封册取证", desc: "强取证据，地方怨恨上升。", effect: { tracks: { "财赋缺口": -4, "清丈阻力": -1 }, relations: { gentry: { resentment: 2, fear: 1 } }, tags: { 能吏: 1 } }, bonusIf: [{ flag: "records_found", effect: { tracks: { "身后清算": -2 } }, text: "旧牍对上册页，口实更少。" }], setFlags: { accounts_sealed: 1 }, reactionRisk: 1 },
      { id: "clerks", name: "追问部院", desc: "压部院迟滞，取证较慢。", effect: { tracks: { "部院迟滞": -4, "财赋缺口": -1 }, relations: { clerks: { resentment: 1, fear: 1 } }, tags: { 能吏: 1 } }, setFlags: { clerks_pressed: 1 } }
    ],
    survey_fields: [
      { id: "strict", name: "严格丈量", desc: "财赋效果强，激怒地方。", effect: { tracks: { "清丈阻力": -4, "地方抵制": 1 }, world: { fiscalHealth: 2, publicMood: -1 }, relations: { gentry: { resentment: 2 } }, tags: { 能吏: 1 } }, reactionRisk: 1 },
      { id: "gradual", name: "渐进清丈", desc: "效果较慢，民怨较低。", effect: { tracks: { "清丈阻力": -2, "地方抵制": -1 }, world: { fiscalHealth: 1 }, tags: { 能吏: 1 } }, setFlags: { gradual_reform: 1 } }
    ],
    secret_memorial: [
      { id: "direct_secret", name: "密奏直达", desc: "压帝心与言路，损士林。", effect: { tracks: { "帝心未定": -4, "言路沸腾": -2 }, world: { emperorTrust: 2, scholarOpinion: -2 }, fame: { power: 2, clean: -1 }, tags: { 权谋: 1 } }, setFlags: { secret_channel: 1 }, reactionRisk: 2 },
      { id: "controlled_leak", name: "暗放风声", desc: "压言路并制造权势。", effect: { tracks: { "言路沸腾": -3, "身后清算": -1 }, fame: { power: 1 }, tags: { 权谋: 1 } }, setFlags: { rumor_control: 1 }, reactionRisk: 1 }
    ],
    seek_inner_tip: [
      { id: "read_mood", name: "探问帝心", desc: "建立窥见上意前置。", effect: { tracks: { "帝心未定": -4, "内廷牵连": 1 }, world: { emperorTrust: 1, scholarOpinion: -1 }, tags: { 权谋: 1 } }, setFlags: { imperial_mood_known: 1 }, reactionRisk: 1 },
      { id: "buy_secret", name: "买取宫闻", desc: "更强但加入内廷污点。", effect: { tracks: { "帝心未定": -5 }, addStain: "inner_palace_contact", world: { scholarOpinion: -1 }, tags: { 权谋: 1 } }, setFlags: { imperial_mood_known: 1 }, reactionRisk: 2 }
    ]
  };

  GameData.cards.forEach(function (card) {
    if (cardModes[card.id]) card.modes = cardModes[card.id];
    if (["secret_memorial", "withhold_dossier", "divide_faction", "burn_private_letter", "seek_inner_tip"].indexOf(card.id) >= 0) {
      card.reactionRisk = Math.max(card.reactionRisk || 0, 1);
    }
  });
})();
