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
})();
