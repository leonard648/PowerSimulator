(function () {
  window.GameData = window.GameData || {};

  GameData.endings = [
    {
      id: "old_case_prison",
      title: "旧案成狱",
      when: function (s) { return s.flags && s.flags.forcedEnding === "old_case_prison"; },
      text: "旧案翻作新狱，奏辩未达御前，名字已在朱笔下定成死局。后世偶有清议追述，也只能在案牍缝隙里替他说几句未尽之言。"
    },
    {
      id: "clean_minister",
      title: "清节自持，青史留名",
      when: function (s) { return s.fame.clean >= 12 && s.stains.length <= 2; },
      text: "其人起于馆阁，历地方而入台垣。遇事多守名节，虽不免迂缓孤立，终能使后世称其清而不苟。"
    },
    {
      id: "able_but_controversial",
      title: "能臣干吏，毁誉参半",
      when: function (s) { return s.fame.competence >= 13 && s.fame.corruption < 8; },
      text: "其人为政精核，所至能清积弊、完钱粮、理案牍。然催科过急，得罪亦多，史家称其有功而不尽可亲。"
    },
    {
      id: "powerful_purge",
      title: "权倾一时，身后籍没",
      when: function (s) { return s.fame.power >= 12 && s.stains.length >= 5; },
      text: "其人善用密折、把柄与门生，声势一时无两。然权势愈盛，旧怨愈深，身后诸案并发，家产籍没，门生星散。"
    },
    {
      id: "benevolent_local",
      title: "救荒有功，十年不迁",
      when: function (s) { return s.world.publicMood >= 15 && s.tagUse["仁政"] >= 6; },
      text: "其人不以速迁为念，数为百姓缓征赈济。朝廷谓其不识大体，地方却立碑请留，香火多年不绝。"
    },
    {
      id: "cruel_official",
      title: "酷吏干才，民怨随名",
      when: function (s) { return s.fame.cruel >= 8; },
      text: "其人断事如削竹，案无久悬，吏无敢欺。只是刑名太急，民间畏之甚于敬之，后世评语亦冷。"
    },
    {
      id: "corrupt_survivor",
      title: "贪名难洗，苟全善终",
      when: function (s) { return s.fame.corruption >= 9 && s.world.emperorTrust >= 7; },
      text: "其人屡在灰处转圜，亏空、冰敬、人情债皆有痕迹。幸而上意尚可，终得保全，只是史传不免含糊。"
    },
    {
      id: "party_victim",
      title: "党祸牵连，青史留名",
      when: function (s) { return s.relations.rival.resentment >= 10 && s.world.scholarOpinion >= 12; },
      text: "其人以清议与弹劾立身，终为党争所困。生前多挫，身后士林追述其直，遂成一代孤臣。"
    },
    {
      id: "retired_scholar",
      title: "生前沉沦，身后追复",
      when: function (s) { return s.resources.pressure >= 13 && s.fame.clean >= 7; },
      text: "其人晚年多病，退而著书。生前官评不显，身后新政追述旧议，方知其当年所言并非迂论。"
    },
    {
      id: "stalled_hanlin",
      title: "久滞馆阁，文名自存",
      when: function (s) { return s.career && s.career.officeId === "hanlin"; },
      text: "其人十二年多困馆阁，未能外放历事。然诗文奏疏仍有可观，士林或惜其不遇，亦或讥其只知纸上经纶。"
    },
    {
      id: "local_career",
      title: "一县沉浮，政声有痕",
      when: function (s) { return s.career && s.career.officeId === "county"; },
      text: "其人仕途止于州县之间，未入台垣。所治地方有惠有怨，案牍钱粮皆见其手，史传虽短，民间却仍记得几件实事。"
    },
    {
      id: "balanced_survivor",
      title: "圆滑中枢，安然下车",
      when: function (s) { return s.tagUse["圆滑"] >= 7 && s.stains.length < 5; },
      text: "其人不为峻名，不贪奇功，善在诸方之间留余地。史书写得平淡，却也是一种难得的善终。"
    },
    {
      id: "ordinary",
      title: "宦海浮沉，留名一页",
      when: function () { return true; },
      text: "其人十二年仕途有得有失，既未成一代名臣，也未坠为巨蠹。生平诸事散入案牍，留给后人几行温吞评语。"
    }
  ];

  var endingSupplements = {
    old_case_prison: [
      "狱成之后，门生故旧多噤声，唯有旧日几份案卷在士林手中辗转传抄。有人说他败于政敌罗织，有人说他早年本就留下太多可疑之处，真相被压在朱批、供词和沉默之间。",
      "后世修史时，此传最难下笔。若称其冤，则旧案中确有牵连；若称其罪，则许多政绩又难抹去。于是只留下几句低回的评语，像替一段未尽仕途收尸。"
    ],
    clean_minister: [
      "他平生不善趋附，遇可疑之利多能退让，遇强势之人亦少肯屈笔。此等清节使他在当时屡显迂直，升迁不算最快，却让许多案后议论无处着力。",
      "身后士林为其编年，最爱写他在钱粮、弹章、人情之间守住的几处窄门。也有人讥其不够圆熟，然正因不够圆熟，青史才肯把清字落在他名下。"
    ],
    able_but_controversial: [
      "他所到之处，簿册能清，积案能动，胥吏与豪右皆知新官不是虚坐堂上之人。只是办事求速，常把人情、体面和缓冲一并削去。",
      "百姓记得几件实政，上司也不能抹去其功；可被他催逼、问责、裁撤之人，同样留下许多冷语。后世论其人，常在能臣与刻薄之间摇摆，终不能一言定之。"
    ],
    powerful_purge: [
      "他在中枢时，门路广而耳目灵，许多难办之事经其手便有转圜。密折、把柄、门生、旧案皆为其所用，朝中一时畏其锋芒。",
      "然而权名越盛，别人越记得清楚。待风向一转，曾被他压下的案卷、曾借他上位的门生、曾与他交易的旧人都成了证词。家产籍没只是结局，真正被清算的是他亲手织出的那张网。"
    ],
    benevolent_local: [
      "他在州县久任，屡以缓征、赈济、修堤、平粜为先。朝廷考成不喜其迟缓，地方父老却知其每一次迟缓都换来几户人家免于流离。",
      "十年不迁，既是不得志，也是地方之幸。身后碑文多由百姓口述，不甚工整，却比馆阁文章更近人心。史家称其未必通达大体，民间只说那年饥荒幸有此官。"
    ],
    cruel_official: [
      "其治下案牍清快，盗讼稍息，胥吏不敢轻慢。每逢大案，他常以雷霆手段压住局面，短期内确能让官府重新显出威势。",
      "只是酷名一成，善政也被寒气裹住。百姓畏其断狱，却少有人愿称其仁；后世读其传，承认其才，也难掩纸面上那股逼人的冷意。"
    ],
    corrupt_survivor: [
      "他并非巨蠹，却惯于在灰处取便。亏空可暂遮，人情可暂借，冰敬可暂收，每一笔都不大，合在一处却足以让清名失色。",
      "幸而他仍知分寸，亦能把事情办成，君前尚未全失信用。于是终局未至覆灭，只是身后史传总绕不开含糊二字：说他有才，不好称清；说他贪墨，又未至不可收拾。"
    ],
    party_victim: [
      "他以弹章、清议与名节立身，早年所获声望，晚年皆化为政敌攻讦的理由。党争最毒处，是能把直言说成结党，把孤愤说成邀名。",
      "生前受挫时，许多旧友不敢相救；身后风向稍平，士林又争相追述其直。于是他终于得名，却是以生前坎坷换来。史家称孤臣，二字之中有光，也有寒。"
    ],
    retired_scholar: [
      "晚年退居之后，他把旧疏、案牍和未竟之议重新整理成书。那些曾被朝堂视为迂阔的言论，在多年后竟与新政相合。",
      "他生前官评不显，或因不肯迎合，或因时机未至。身后追复并不能补回失去的岁月，却让后人明白：有些官员的功过，不在当世立即结账。"
    ],
    stalled_hanlin: [
      "他久居馆阁，文章、讲读、奏疏皆有可观，却少经地方风雨与案牍磨砺。旁人升降起落，他仍在纸笔之间辨一字轻重。",
      "此生未必显达，却也未全无所成。士林惜其才名，亦有人笑其只知经义不知世务。传至后世，像一卷未出京城的履历，清雅而带遗憾。"
    ],
    local_career: [
      "他未入台垣，却在一县一府之间留下许多具体痕迹：一场水患、一桩田讼、几册钱粮、几名被压服或被得罪的旧吏。",
      "史传写得短，是因官阶不高；民间记得久，是因每件事都落在身边。其人不成庙堂名臣，却让后人知道州县之治亦有沉浮重量。"
    ],
    balanced_survivor: [
      "他平生少作峻烈之举，遇争端常先留余地，遇强人亦不急于撕破脸面。许多人说他圆滑，也有许多人因此少受牵连。",
      "史书不爱写这种人，因为没有惊天功罪可供评断；官场却最常由这种人维持不断。能安然下车，未必光耀，却是一种在暗流中保全自身与局面的本事。"
    ],
    ordinary: [
      "他一生所办诸事，有成有败，有几次可称得体，也有几处足以自愧。名声未曾高到惊动朝野，污点也未重到覆灭家门。",
      "这样的生平在史册中只占一页，却更像多数官员真实的命运。案牍散去，人名留存，后人若偶然翻到，也只见一个人在制度、人情与自保之间缓慢沉浮。"
    ]
  };

  GameData.endings.forEach(function (ending) {
    var supplement = endingSupplements[ending.id];
    if (supplement && supplement.length) {
      ending.text = [ending.text].concat(supplement).filter(Boolean).join("\n");
    }
  });
})();
