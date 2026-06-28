const fs = require("fs");
const path = require("path");
const vm = require("vm");

global.window = global;
global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };

for (const file of [
  "src/data/offices.js",
  "src/data/cards.js",
  "src/data/events.js",
  "src/data/endings.js",
  "src/core/state.js",
  "src/core/deck.js",
  "src/core/rules.js"
]) {
  vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
}

function makeRng(seed) {
  let t = seed >>> 0;
  return function random() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function seasonName() {
  return GameData.seasons[Game.state.seasonIndex] || "?";
}

function resultWeight(level) {
  if (level === "success") return 1000;
  if (level === "partial") return 420;
  return 0;
}

function eventStats(event) {
  const tracks = event && event.tracks || {};
  const critical = event && event.criticalTracks || [];
  const total = Object.values(tracks).reduce((sum, item) => sum + Math.max(0, item.value || 0), 0);
  const criticalTotal = critical.reduce((sum, name) => sum + Math.max(0, tracks[name] ? tracks[name].value : 0), 0);
  const blocked = critical.filter((name) => tracks[name] && tracks[name].value > 4).length;
  return { total, criticalTotal, blocked };
}

function modeList(card) {
  return card.modes && card.modes.length ? card.modes.map((mode) => mode.id) : [null];
}

function modeName(card, modeId) {
  if (!modeId) return "";
  const mode = (card.modes || []).find((item) => item.id === modeId);
  return mode ? mode.name : modeId;
}

function scoreCandidate(card, modeId) {
  if (!Game.canPlayCard(card, modeId)) return null;
  const beforeState = clone(Game.state);
  const beforeOutcome = Game.previewCurrentEventOutcome();
  const beforeStats = eventStats(Game.state.currentEvent);
  const ok = Game.playCard(card.instanceId, modeId);
  if (!ok) {
    Game.state = beforeState;
    return null;
  }

  const afterOutcome = Game.previewCurrentEventOutcome();
  const afterStats = eventStats(Game.state.currentEvent);
  const afterState = Game.state;
  const pressureDelta = (afterState.resources.pressure || 0) - (beforeState.resources.pressure || 0);
  const stainDelta = (afterState.stains || []).length - (beforeState.stains || []).length;
  const emperorDelta = (afterState.world.emperorTrust || 0) - (beforeState.world.emperorTrust || 0);
  const publicDelta = (afterState.world.publicMood || 0) - (beforeState.world.publicMood || 0);
  const cleanDelta = (afterState.fame.clean || 0) - (beforeState.fame.clean || 0);
  const corruptionDelta = (afterState.fame.corruption || 0) - (beforeState.fame.corruption || 0);
  const cruelDelta = (afterState.fame.cruel || 0) - (beforeState.fame.cruel || 0);
  const threatGain = afterState.currentEvent.lastThreatGain || 0;
  const playedHelp = (beforeStats.criticalTotal - afterStats.criticalTotal) * 80 +
    (beforeStats.total - afterStats.total) * 12 +
    (beforeStats.blocked - afterStats.blocked) * 140;
  const outcomeHelp = resultWeight(afterOutcome.level) - resultWeight(beforeOutcome.level);
  let score = playedHelp + outcomeHelp;
  score -= Math.max(0, pressureDelta) * 16;
  score -= Math.max(0, stainDelta) * 110;
  score -= Math.max(0, -emperorDelta) * 22;
  score -= Math.max(0, -publicDelta) * 16;
  score -= Math.max(0, -cleanDelta) * 18;
  score -= Math.max(0, corruptionDelta) * 45;
  score -= Math.max(0, cruelDelta) * 32;
  score -= threatGain * 8;
  if ((card.tags || []).includes("污点") || (card.tags || []).includes("贪腐")) score -= 60;
  if ((card.tags || []).includes("权谋")) score -= 14;
  if ((card.tags || []).includes("酷吏")) score -= 24;

  const candidate = {
    instanceId: card.instanceId,
    cardId: card.id,
    cardName: card.name,
    modeId,
    modeName: modeName(card, modeId),
    score,
    beforeLevel: beforeOutcome.level,
    afterLevel: afterOutcome.level
  };
  Game.state = beforeState;
  return candidate;
}

function choosePrepare() {
  const s = Game.state;
  const event = s.currentEvent;
  const names = (event.criticalTracks || []).concat(Object.keys(event.tracks || {})).join("|");
  if (/证据不足|案卷迟滞/.test(names) && s.resources.money >= 1) return "evidence";
  if (/派系阻挠|举荐不足|流言滋生|政敌反扑|清议沸腾/.test(names) && s.resources.favor >= 1) return "contact";
  if (s.resources.pressure <= 10) return "focus";
  return "pressure_draw";
}

function summarizeChanges(groups, stains, npcs) {
  const items = [];
  for (const group of groups) {
    for (const item of group.items || []) {
      if (item.text) {
        items.push(`${item.label}:${item.text}`);
        continue;
      }
      const delta = item.delta > 0 ? `+${item.delta}` : String(item.delta);
      items.push(`${item.label}${delta}`);
    }
  }
  for (const item of stains || []) {
    const delta = item.delta > 0 ? `+${item.delta}` : String(item.delta);
    items.push(`污点:${item.label}${delta}`);
  }
  for (const npc of npcs || []) {
    const change = npc.changes && npc.changes[0];
    if (change) items.push(`${npc.name}${change.label}${change.delta > 0 ? "+" : ""}${change.delta}`);
  }
  return items.slice(0, 8);
}

function playSeason() {
  const start = {
    year: Game.state.year,
    season: seasonName(),
    office: Game.getOffice().name,
    merit: Game.state.career.merit,
    event: Game.state.currentEvent ? Game.state.currentEvent.name : ""
  };
  const prepare = choosePrepare();
  const prepared = Game.prepareForSeason(prepare) ? prepare : "";
  Game.drawCards(Game.getOffice().handLimit);

  const actions = [];
  for (let i = 0; i < 8; i += 1) {
    const current = Game.previewCurrentEventOutcome();
    if (!current || current.level === "success") break;
    const candidates = [];
    for (const card of Game.state.hand.slice()) {
      for (const modeId of modeList(card)) {
        const candidate = scoreCandidate(card, modeId);
        if (candidate) candidates.push(candidate);
      }
    }
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    if (!best || best.score < 30) break;
    const played = Game.playCard(best.instanceId, best.modeId);
    if (!played) break;
    actions.push(best.cardName + (best.modeName ? `/${best.modeName}` : ""));
  }

  const eventBeforeEnd = Game.state.currentEvent ? clone(Game.state.currentEvent) : null;
  Game.endQuarter();
  if (Game.state.ended && !Game.state.pendingSummary) {
    return {
      ...start,
      prepare: prepared,
      played: actions,
      title: "仕途骤断",
      level: "forced",
      resultText: Game.state.ending ? Game.state.ending.text : "强制结局",
      critical: eventBeforeEnd ? eventBeforeEnd.criticalTracks.map((name) => {
        const track = eventBeforeEnd.tracks[name];
        return `${name} ${track ? track.value : 0}/${track ? track.max : 0}`;
      }) : [],
      blocked: [],
      unresolved: [],
      reward: "",
      package: "",
      changes: []
    };
  }

  const summary = Game.state.pendingSummary;
  if (!summary) throw new Error(`No pending summary after ${start.year}${start.season}`);

  let reward = "";
  let pack = "";
  if (summary.rewardOptions && summary.rewardOptions.length && !summary.rewardChosen) {
    let index = -1;
    const hasGap = (summary.trackSummary.blocked || []).length || (summary.trackSummary.unresolved || []).length;
    if (hasGap) index = summary.rewardOptions.findIndex((option) => option.id === "gap_card");
    if (index < 0) index = summary.rewardOptions.findIndex((option) => option.id === "route_card");
    if (index < 0) index = summary.rewardOptions.findIndex((option) => option.id !== "tainted_card");
    if (index < 0) index = 0;
    reward = `${summary.rewardOptions[index].name}: ${summary.rewardOptions[index].desc}`;
    Game.selectReward(index);
  }

  if (Game.state.pendingOfficeDraft) {
    const draft = Game.state.pendingOfficeDraft;
    let index = 0;
    if (draft.officeId === "county") {
      if (Game.state.world.publicMood <= 5) index = Math.max(0, draft.packages.findIndex((item) => item.id === "county_benevolent"));
      else index = Math.max(0, draft.packages.findIndex((item) => item.id === "county_accounts"));
    }
    if (draft.officeId === "censor") {
      index = Math.max(0, draft.packages.findIndex((item) => item.id === "censor_law"));
    }
    pack = draft.packages[index] ? draft.packages[index].name : "";
    Game.selectOfficePackage(index);
  }

  const finalSummary = Game.state.pendingSummary;
  const line = {
    ...start,
    prepare: prepared,
    played: finalSummary.played && finalSummary.played.length ? finalSummary.played : actions,
    title: finalSummary.title,
    level: finalSummary.level,
    resultText: finalSummary.resultText,
    story: finalSummary.story,
    critical: (finalSummary.trackSummary.critical || []).map((item) => `${item.name} ${item.value}/${item.max}${item.safe ? " OK" : " !"}`),
    blocked: finalSummary.trackSummary.blocked || [],
    unresolved: finalSummary.trackSummary.unresolved || [],
    reward,
    package: pack,
    changes: summarizeChanges(finalSummary.deltaGroups || [], finalSummary.stainChanges || [], finalSummary.npcBeats || [])
  };

  if (!Game.continueAfterSummary()) {
    throw new Error(`Failed to continue after ${start.year}${start.season}`);
  }
  return line;
}

function run(seed) {
  Math.random = makeRng(seed);
  Game.state = Game.createNewState();
  Game.buildStartingDeck();
  Game.startEvent();
  const seasons = [];
  while (!Game.state.ended) {
    seasons.push(playSeason());
    if (seasons.length > 60) throw new Error("Season overflow");
  }
  return {
    seed,
    seasons,
    ending: clone(Game.state.ending),
    final: {
      year: Game.state.year,
      age: Game.state.age,
      office: Game.getOffice().name,
      merit: Game.state.career.merit,
      fame: clone(Game.state.fame),
      world: clone(Game.state.world),
      resources: clone(Game.state.resources),
      stains: Game.state.stains.map((id) => Game.cardById(id) ? Game.cardById(id).name : id),
      style: Game.getDominantStyle ? Game.getDominantStyle() : null
    }
  };
}

function formatRun(run, index) {
  const lines = [];
  lines.push(`## 第 ${index} 局 (seed ${run.seed})`);
  lines.push("");
  lines.push(`最终结局: ${run.ending.title}`);
  lines.push(`结局说明: ${run.ending.text}`);
  lines.push(`终局状态: ${run.final.office}, 官评 ${run.final.merit}, 清名 ${run.final.fame.clean}, 能名 ${run.final.fame.competence}, 权名 ${run.final.fame.power}, 酷名 ${run.final.fame.cruel}, 贪名 ${run.final.fame.corruption}, 压力 ${run.final.resources.pressure}, 污点 ${run.final.stains.length ? run.final.stains.join(", ") : "无"}`);
  lines.push("");
  lines.push("| 季度 | 官职 | 事件 | 结论 | 关键轨 | 出牌 | 奖励/升迁 | 主要变化 |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const season of run.seasons) {
    const time = `第${season.year}年${season.season}`;
    const played = season.played && season.played.length ? season.played.join(", ") : "未出牌";
    const prep = season.prepare ? `准备:${season.prepare}${played === "未出牌" ? "" : "; "}` : "";
    const rewardBits = [season.reward, season.package ? `升迁选包:${season.package}` : ""].filter(Boolean).join("; ") || "-";
    const change = season.changes && season.changes.length ? season.changes.join(", ") : "-";
    const critical = season.critical && season.critical.length ? season.critical.join(", ") : "-";
    const result = season.title + (season.blocked && season.blocked.length ? ` / 未解:${season.blocked.join(",")}` : "");
    lines.push(`| ${time} | ${season.office} | ${season.event} | ${result} | ${critical} | ${prep}${played} | ${rewardBits.replace(/\|/g, "/")} | ${change.replace(/\|/g, "/")} |`);
  }
  lines.push("");
  return lines.join("\n");
}

const seeds = [101, 202, 303];
const runs = seeds.map(run);
const reportLines = [];
reportLines.push("# PowerSimulator 自动模拟报告");
reportLines.push("");
reportLines.push("模拟策略: 每季先按事件短板准备, 抽牌后自动选择可支付且最能压低关键轨的牌, 季末优先选择“补足短板/沉淀路线”, 避开“险路强牌”。");
reportLines.push(`模拟局数: ${runs.length} 局; 每局最多 12 年 48 季。`);
reportLines.push("");
runs.forEach((item, index) => reportLines.push(formatRun(item, index + 1)));
const outPath = path.resolve("tmp/simulation-report.md");
fs.writeFileSync(outPath, reportLines.join("\n"), "utf8");

for (let i = 0; i < runs.length; i += 1) {
  const item = runs[i];
  console.log(`第${i + 1}局 seed ${item.seed}: ${item.seasons.length}季, 结局=${item.ending.title}, 官评=${item.final.merit}, 污点=${item.final.stains.length}, 压力=${item.final.resources.pressure}`);
}
console.log(`REPORT=${outPath}`);
