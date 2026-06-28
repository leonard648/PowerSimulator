(function () {
  window.GameData = window.GameData || {};

  GameData.endings = [
    {
      id: "old_case_prison",
      title: "家门籍没，旧政成狱",
      when: function (s) { return s.flags && s.flags.forcedEnding === "old_case_prison"; },
      text: "政敌把内廷、夺情、门生与家门旧账并成一案。奏辩未达御前，张氏家门已先入清算。\n后世论此局，既难全称其冤，也难尽抹其功。万历新政的账册仍在，籍没的朱批也仍在。"
    },
    {
      id: "powerful_purge",
      title: "权势过盛，身后籍没",
      when: function (s) { return s.fame.power >= 12 && s.stains.length >= 5; },
      text: "张居正生前综核名实，票拟所至，部院震动。只是权势愈盛，旧怨愈深。\n一朝身后风向转冷，门生、家产、内廷旧交皆成证词。新政仍有功，张氏却难逃籍没。"
    },
    {
      id: "party_victim",
      title: "夺情反噬，言路留名",
      when: function (s) { return s.relations.rival.resentment >= 10 && s.world.scholarOpinion >= 12; },
      text: "夺情之议终成一生裂缝。言官曾被廷杖压下，士林却把奏疏传得更久。\n张居正能赢一时廷议，却很难让名教之问彻底闭口。身后清议为言路留名，也把首辅功过写得更峻。"
    },
    {
      id: "corrupt_survivor",
      title: "财赋有成，贪议难洗",
      when: function (s) { return s.fame.corruption >= 9 && s.world.emperorTrust >= 7; },
      text: "清丈、征银与考成使国用稍充，账册上确有成效。可馈赠、门生与家门痕迹也随之增多。\n万历尚肯用其才，故生前未败；后世却难把聚敛与整饬完全分开。"
    },
    {
      id: "cruel_official",
      title: "考成太峻，怨声入史",
      when: function (s) { return s.fame.cruel >= 8; },
      text: "考成法下，部院不敢怠，地方不敢欺，许多积弊确被压出形状。\n只是期限太硬，催责太急，怨声也一并入史。后世称其能臣，也常在能字旁边添一个峻字。"
    },
    {
      id: "clean_minister",
      title: "新政留名，清议稍平",
      when: function (s) { return s.fame.clean >= 12 && s.stains.length <= 2; },
      text: "张居正权重十年，却能少留私污，清议虽不尽服，终难把新政全写成私门之利。\n考成、清丈、治河与边防各有实绩。身后风波仍起，但史笔会给他留下一处较干净的位置。"
    },
    {
      id: "able_but_controversial",
      title: "综核名实，功过相参",
      when: function (s) { return s.fame.competence >= 13 && s.fame.corruption < 8; },
      text: "张居正为政精核，能把空疏政令压成可考的期限与账册。国用、河工、边防皆因之见效。\n然而新政越有成，越显其权太重、法太急。后世论他，常在救时宰相与专权首辅之间摇摆。"
    },
    {
      id: "benevolent_local",
      title: "边防河工有成",
      when: function (s) { return s.world.publicMood >= 15 && s.tagUse["仁政"] >= 6; },
      text: "潘季驯治河、戚继光守边，皆在新政财赋与中枢护持中得以成事。\n若民生稍安、边圉少警，后世便不能只从权势看张居正。堤岸与边墙沉默，却替他留下另一种功业。"
    },
    {
      id: "retired_scholar",
      title: "积劳成疾，身后追思",
      when: function (s) { return s.resources.pressure >= 13 && s.fame.clean >= 7; },
      text: "十年新政几乎把首辅一身精力烧尽。帝心、言路、部院、河工、边镇和家门，无一不压在案头。\n身后或有清算，亦有追思。许多人到旧法松弛之后，才想起张居正当年为何如此急切。"
    },
    {
      id: "stalled_hanlin",
      title: "辅政未稳，新政早折",
      when: function (s) { return s.career && s.career.officeId === "hanlin"; },
      text: "万历初局尚未坐稳，遗诏、内廷与高拱余波便先搅成死结。\n张居正未能把辅政名义转为新政权威。后世翻到这一页，只见一个可能成局的首辅，停在开端。"
    },
    {
      id: "local_career",
      title: "新政半途，功业未竟",
      when: function (s) { return s.career && s.career.officeId === "county"; },
      text: "考成、清丈与财赋已见端倪，河工边防亦有起色，却尚未走到身后定论的关口。\n此局像一部未完的章程：能看见张居正的手腕，也能看见所有将要反噬他的裂缝。"
    },
    {
      id: "balanced_survivor",
      title: "权衡保局，身后有余",
      when: function (s) { return s.tagUse["圆滑"] >= 7 && s.stains.length < 5; },
      text: "张居正少作无谓峻烈，懂得给阁臣、部院与地方留些退步。新政因此未必最快，却少了几处可被合流清算的旧伤。\n史书仍会写其专权，却也承认他懂得保局。能把功业留到身后，已是晚局难得的胜法。"
    },
    {
      id: "ordinary",
      title: "帝心终失，功过未定",
      when: function () { return true; },
      text: "万历十年终了，帝心渐远，言路未平，家门与内廷旧账仍在暗处。\n张居正的新政有成有败，既未全成青史定论，也未立刻坠入覆灭。后人再翻此传，只能说功过仍须并读。"
    }
  ];
})();
