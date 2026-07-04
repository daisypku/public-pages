const SAVE_KEY = "luanshi-taiping-wuyue-trial-v01";
const TOTAL_YEARS = 10;

const stages = [
  { id: "founding", name: "钱塘立国", startTurn: 1, text: "钱塘初定，仓廪未丰。前十年的关键不是扩张，而是在粮食、钱帛和边防之间建立最初余量；任何一项透支，都会在后面连锁发作。" },
  { id: "liangzhe", name: "经营两浙", startTurn: 11, text: "两浙渐安，商旅复行。水利和港市能带来长期收益，却也会扩大人口、官吏与军费成本；繁荣本身开始成为治理负担。" },
  { id: "diplomacy", name: "夹缝外交", startTurn: 21, text: "中原渐趋统一，外敌压力的历史底线开始上升。向北示好可以换取缓冲，维持独立则必须准备承担更高军费与边境风险。" },
  { id: "choice", name: "乱世抉择", startTurn: 31, text: "宋朝立国后，吴越不能无限观望。归附与独立若同时推进，朝堂会因路线冲突而失去安定；玩家必须逐步形成清晰国策。" },
  { id: "ending", name: "太平结局", startTurn: 41, text: "天下将定，南唐屏障也将消失。最后十年检验的不只是倾向数值：仓廪、府库、民心和安定都必须足以承受最终选择。" }
];

const contentData = globalThis.WUYUE_CONTENT;
if (!contentData) {
  throw new Error("缺少试玩内容数据。");
}
const events = contentData.events;
const branchEvents = contentData.branchEvents;

const yearConditionDeck = [
  ...Array(10).fill("丰年"),
  ...Array(35).fill("普年"),
  ...Array(5).fill("欠年")
];

const yearConditionRules = {
  "丰年": { incomeMultiplier: 1.25, costMultiplier: 0.95, moraleDelta: 1, text: "田畴丰稔，米价稍平。", report: "粮食产出提高，粮食消耗略降，民心 +1" },
  "普年": { incomeMultiplier: 1, costMultiplier: 1, moraleDelta: 0, text: "岁入如常，民间尚能支应。", report: "粮食产出和消耗如常，民心不变" },
  "欠年": { incomeMultiplier: 0.75, costMultiplier: 1.1, moraleDelta: -3, text: "收成不足，市井已有惜米之声。", report: "粮食产出降低，粮食消耗上升，民心 -3" }
};

const lightEventPool = [
  { title: "海盗传闻", text: "外海有盗船出没，商旅稍有惊惧。", delta: { threat: 2, money: -8 } },
  { title: "台风过境", text: "大风入海，数处民居受损。", delta: { food: -12, stability: -1 } },
  { title: "夜见流星", text: "夜中流星划过，士民议论吉凶。", delta: { morale: 1, prestige: 1 } },
  { title: "商船误期", text: "一队商船迟迟未归，港市短时冷清。", delta: { money: -10 } },
  { title: "异僧入城", text: "异僧携香药入钱塘，市井多有围观。", delta: { prestige: 1, morale: 1 } },
  { title: "潮声异常", text: "江潮夜响，沿岸百姓不安。", delta: { morale: -1, stability: -1 } },
  { title: "乡里献稻", text: "乡里献来早熟稻种，农官记其法。", delta: { food: 10 } },
  { title: "军中角抵", text: "军中角抵取乐，士气稍振。", delta: { army: 4, morale: 1 } }
];

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function generateYearConditions() {
  return shuffled(yearConditionDeck).slice(0, TOTAL_YEARS);
}

function generateLightEvents() {
  const count = 1 + Math.floor(Math.random() * 4);
  const turns = shuffled(Array.from({ length: TOTAL_YEARS }, (_, index) => index + 1)).slice(0, count);
  const pool = shuffled(lightEventPool);
  return turns.reduce((eventsByTurn, turn, index) => {
    eventsByTurn[turn] = pool[index % pool.length];
    return eventsByTurn;
  }, {});
}

const defaultState = {
  turn: 1,
  resources: { food: 200, money: 125, people: 120, army: 100, morale: 60, prestige: 25, stability: 60 },
  pressure: { threat: 45, fiscal: 20, submit: 0, independent: 0 },
  legacy: { points: 0, endings: [] },
  yearConditions: null,
  lightEvents: null,
  branch: "吴越",
  branchRun: null,
  crisis: { foodStressYears: 0, foodShortageYears: 0, moneyShortageYears: 0 },
  currentEventIndex: 0,
  log: ["公元930年 · 钱塘初定，吴越小朝廷开始理政。"],
  finished: false
};

let state = ensureRunSetup(loadState());

const effectNames = {
  food: "粮食",
  money: "钱帛",
  people: "人口",
  army: "兵力",
  morale: "民心",
  prestige: "国威",
  stability: "安定",
  threat: "外敌压力",
  fiscal: "财政压力",
  submit: "归附倾向",
  independent: "独立倾向"
};

const badWhenUp = new Set(["threat", "fiscal"]);
const badWhenDown = new Set(["food", "money", "people", "army", "morale", "prestige", "stability", "submit", "independent"]);

const ruleTips = {};

function loadState() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return structuredClone(defaultState);
  try {
    return { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultState);
  }
}

function ensureRunSetup(nextState) {
  if (!Array.isArray(nextState.yearConditions) || nextState.yearConditions.length !== TOTAL_YEARS) nextState.yearConditions = generateYearConditions();
  if (!nextState.lightEvents) nextState.lightEvents = generateLightEvents();
  if (!nextState.branch) nextState.branch = "吴越";
  if (nextState.branch !== "吴越" && !nextState.branchRun) {
    nextState.branchRun = { type: nextState.branch, index: 0, remaining: 1 };
  }
  if (!nextState.crisis) nextState.crisis = { foodStressYears: 0, foodShortageYears: 0, moneyShortageYears: 0 };
  if (typeof nextState.crisis.foodStressYears !== "number") nextState.crisis.foodStressYears = 0;
  if (typeof nextState.crisis.foodShortageYears !== "number") nextState.crisis.foodShortageYears = 0;
  if (typeof nextState.crisis.moneyShortageYears !== "number") nextState.crisis.moneyShortageYears = 0;
  return nextState;
}

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function clamp(value, min = 0, max = 9999) {
  return Math.max(min, Math.min(max, value));
}

function clampPercent(value) {
  return clamp(value, 0, 100);
}

function getStage() {
  return stages.reduce((current, stage) => (state.turn >= stage.startTurn ? stage : current), stages[0]);
}

function getEvent() {
  if (state.branchRun) {
    const scenes = branchEvents[state.branchRun.type] || [];
    return scenes[Math.min(state.branchRun.index, scenes.length - 1)] || events[Math.min(state.turn - 1, events.length - 1)];
  }
  return events[Math.min(state.turn - 1, events.length - 1)];
}

function getYearCondition() {
  const name = state.yearConditions[Math.min(state.turn - 1, TOTAL_YEARS - 1)] || "普年";
  return { name, ...yearConditionRules[name] };
}

function getLightEvent() {
  return state.lightEvents?.[state.turn] || null;
}

function applyDelta(delta) {
  const maxByResource = { food: 2000, money: 2000, people: 700, army: 800, morale: 100, prestige: 150, stability: 100 };
  for (const key of Object.keys(delta)) {
    if (key in state.resources) state.resources[key] = clamp(state.resources[key] + delta[key], 0, maxByResource[key] || 9999);
    if (key in state.pressure) state.pressure[key] = clampPercent(state.pressure[key] + delta[key]);
  }
}

function getEventChoices(event) {
  if (state.branchRun) return event.choices.map((choice) => ({ ...choice }));
  const choices = event.choices.map((choice) => ({ ...choice }));
  if (event.title === "中原易主") {
    choices.push({ label: "遣密使北上", desc: "开启最多两回合的中原观察，了解新朝军政变化。", delta: { money: -12, stability: -1 }, branchStart: "中原" });
  }
  if (event.title === "南唐求援") {
    choices.push({ label: "遣使赴金陵", desc: "开启最多两回合的南唐观察，判断金陵是否还能作为屏障。", delta: { money: -14, stability: -1 }, branchStart: "南唐" });
  }
  return choices;
}

function getChoiceDisplay(event, choice) {
  return { label: choice.label, desc: choice.desc };
}

function formatEffects(delta) {
  const gains = [];
  const costs = [];
  const chips = [];
  for (const [key, value] of Object.entries(delta)) {
    if (value === 0) continue;
    const name = effectNames[key] || key;
    const abs = Math.abs(value);
    const isCost = value > 0 ? badWhenUp.has(key) : badWhenDown.has(key);
    const direction = value > 0 ? "+" : "-";
    const text = `${name} ${direction}${abs}`;
    if (isCost) costs.push(text);
    else gains.push(text);
    chips.push({ text: `${direction}${name} ${abs}`, cost: isCost });
  }
  return {
    gains,
    costs,
    chips,
    summary: [gains.length ? `收益：${gains.join("，")}` : "", costs.length ? `代价：${costs.join("，")}` : ""].filter(Boolean).join("；")
  };
}

function yearlySettlement(yearCondition, lightEvent) {
  const r = state.resources;
  const p = state.pressure;
  const report = [];
  const legacyBonus = state.legacy.points;
  const coherentIndependent = p.independent > 55 && p.submit < 20 && r.army >= p.threat * 4;
  const militaryFarmIncome = coherentIndependent ? Math.round(Math.max(0, r.army - 280) * 0.08) : 0;
  const armyMoneyRate = coherentIndependent ? 0.08 : 0.095;
  const armyFoodRate = coherentIndependent ? 0.075 : 0.1;
  const populationScalePenalty = Math.max(0, (r.people - 350) / 60);
  const shortagePopulationPenalty = r.food <= 0 ? 10 : r.food < 60 ? 6 : r.food < 120 ? 3 : 0;

  const foodIncome = (38 + r.people * 0.18 + legacyBonus * 3 + militaryFarmIncome) * yearCondition.incomeMultiplier;
  const moneyIncome = 30 + r.people * 0.14 + r.prestige * 0.06 + legacyBonus * 2;
  const peopleGrowth = 4 + r.morale / 30 + r.stability / 50 - populationScalePenalty - shortagePopulationPenalty;
  const foodCost = (r.people * 0.22 + r.army * armyFoodRate) * yearCondition.costMultiplier;
  const bureaucracyCost = 5 + r.people * 0.038 + r.stability * 0.04;
  const moneyCost = r.army * armyMoneyRate + p.fiscal * 0.45 + bureaucracyCost;
  const netFood = Math.round(foodIncome - foodCost);
  const netMoney = Math.round(moneyIncome - moneyCost);
  const netPeople = Math.round(peopleGrowth);

  r.food = clamp(r.food + netFood, 0, 2000);
  r.money = clamp(r.money + netMoney, 0, 2000);
  r.people = clamp(r.people + netPeople, 0, 700);
  if (yearCondition.moraleDelta) {
    r.morale = clampPercent(r.morale + yearCondition.moraleDelta);
  }
  report.push(`${yearCondition.name}：${yearCondition.report}`);
  report.push(`常年收支：粮食 ${netFood >= 0 ? "+" : ""}${netFood}，钱帛 ${netMoney >= 0 ? "+" : ""}${netMoney}，人口 ${netPeople >= 0 ? "+" : ""}${netPeople}`);
  if (coherentIndependent) {
    report.push(`独立国策明确，军屯贡献粮食产出 ${militaryFarmIncome}，军费按整合后的较低标准结算`);
  }

  if (r.morale > 85) {
    const loss = r.morale > 95 ? 4 : r.morale > 90 ? 3 : 2;
    r.morale = clampPercent(r.morale - loss);
    report.push(`民心高位，百姓期待随之提高，民心 -${loss}`);
  }

  if (r.stability > 85) {
    const highLoss = r.stability > 95 ? 4 : r.stability > 90 ? 3 : 2;
    const loss = r.people > 520 ? Math.max(3, highLoss) : highLoss;
    r.stability = clampPercent(r.stability - loss);
    report.push(`安定高位，州县事务增多，安定 -${loss}`);
  }
  if (r.morale > 80 && r.stability > 80) {
    p.fiscal = clampPercent(p.fiscal + 1);
    report.push("民心与安定都处高位，维持赈济、治安和官吏体系，财政压力 +1");
  }

  if (lightEvent) {
    applyDelta(lightEvent.delta);
    report.push(`杂事：${lightEvent.title}，${formatEffects(lightEvent.delta).summary || "无明显影响"}`);
  }

  if (r.army < p.threat * 3.2) {
    const loss = Math.ceil((p.threat * 3.2 - r.army) / 60);
    r.stability = clampPercent(r.stability - loss);
    report.push(`兵力不足以压住外敌压力，安定 -${loss}`);
  }
  if (r.army > p.threat * 5) {
    r.prestige = clamp(r.prestige + 1, 0, 150);
    report.push("兵势足以威慑四方，国威 +1");
  }
  if (p.fiscal > 45) {
    const loss = Math.ceil((p.fiscal - 45) / 4);
    r.money = clamp(r.money - loss, 0, 2000);
    report.push(`财政压力过高，钱帛额外 -${loss}`);
  }
  if (p.fiscal > 65) {
    const loss = Math.ceil((p.fiscal - 65) / 10);
    r.morale = clampPercent(r.morale - loss);
    report.push(`财政压力伤及民生，民心 -${loss}`);
  }
  if (p.fiscal > 75) {
    const loss = Math.ceil((p.fiscal - 75) / 15);
    r.stability = clampPercent(r.stability - loss);
    report.push(`财政压力逼迫州县催科，安定 -${loss}`);
  }

  if (p.threat > 70) {
    const loss = Math.ceil((p.threat - 70) / 20);
    r.stability = clampPercent(r.stability - loss);
    report.push(`外敌压力高于 70，边境牵动州县，安定 -${loss}`);
  }
  if (p.submit > 35 && p.independent > 35) {
    const loss = p.submit > 60 && p.independent > 60 ? 3 : 2;
    r.stability = clampPercent(r.stability - loss);
    report.push(`归附与独立两派同时坐大，朝议相持，安定 -${loss}`);
  }

  if (r.food < 120) {
    state.crisis.foodStressYears += 1;
    r.morale = clampPercent(r.morale - 4);
    r.stability = clampPercent(r.stability - 4);
    r.prestige = clamp(r.prestige - 2, 0, 150);
    report.push(`粮食低于 120，连续粮紧 ${state.crisis.foodStressYears} 年，民心 -4，安定 -4，国威 -2`);
  } else {
    state.crisis.foodStressYears = 0;
  }
  if (r.food < 60) {
    r.morale = clampPercent(r.morale - 6);
    r.stability = clampPercent(r.stability - 6);
    r.prestige = clamp(r.prestige - 4, 0, 150);
    p.threat = clampPercent(p.threat + 2);
    report.push("粮食低于 60，民心 -6，安定 -6，国威 -4，外敌压力 +2");
  }
  if (r.food <= 0) {
    state.crisis.foodShortageYears += 1;
    r.morale = clampPercent(r.morale - 10);
    r.stability = clampPercent(r.stability - 10);
    r.prestige = clamp(r.prestige - 7, 0, 150);
    p.threat = clampPercent(p.threat + 4);
    report.push(`粮食归零，连续缺粮 ${state.crisis.foodShortageYears} 年，民心 -10，安定 -10，国威 -7，外敌压力 +4`);
  } else if (r.food >= 120) {
    state.crisis.foodShortageYears = 0;
  }

  if (r.money < 80) {
    p.fiscal = clampPercent(p.fiscal + 5);
    r.stability = clampPercent(r.stability - 2);
    report.push("钱帛低于 80，财政压力 +5，安定 -2");
  }
  if (r.money < 40) {
    state.crisis.moneyShortageYears += 1;
    r.army = clamp(r.army - 14, 0, 800);
    r.morale = clampPercent(r.morale - 3);
    r.prestige = clamp(r.prestige - 3, 0, 150);
    report.push(`钱帛低于 40，连续欠饷 ${state.crisis.moneyShortageYears} 年，兵力 -14，民心 -3，国威 -3`);
  } else if (r.money >= 80) {
    state.crisis.moneyShortageYears = 0;
  }

  if (r.morale < 45) {
    r.stability = clampPercent(r.stability - 4);
    report.push("民心低于 45，安定 -4");
  }
  if (r.morale < 25) {
    r.stability = clampPercent(r.stability - 7);
    report.push("民心低于 25，安定额外 -7");
  }
  if (r.stability < 45) {
    p.fiscal = clampPercent(p.fiscal + 4);
    report.push("安定低于 45，财政压力 +4");
  }
  if (r.stability < 25) {
    r.morale = clampPercent(r.morale - 5);
    p.threat = clampPercent(p.threat + 5);
    report.push("安定低于 25，民心 -5，外敌压力 +5");
  }
  if (p.independent > 55) {
    if (coherentIndependent) {
      p.fiscal = clampPercent(p.fiscal - 4);
      report.push("独立国策明确且兵力足以守边，军令统一，财政压力 -4");
    } else {
      p.threat = clampPercent(p.threat + 1);
      report.push("独立倾向高而兵势不足，外敌压力 +1");
    }
  }
  if (p.submit > 55) {
    p.threat = clampPercent(p.threat - 1);
    report.push("归附倾向高于 55，外敌压力 -1");
  }
  const historicalThreatFloor = state.turn >= 46 ? 52 : state.turn >= 31 ? 36 : state.turn >= 21 ? 26 : 20;
  const submissionRelief = p.submit >= 85 ? 22 : p.submit >= 65 ? 12 : 0;
  const threatFloor = Math.max(12, historicalThreatFloor - submissionRelief);
  if (p.threat < threatFloor) {
    const rebound = threatFloor - p.threat;
    p.threat = threatFloor;
    const phaseText = state.turn >= 46
      ? "南唐既亡，宋军锋芒直抵吴越"
      : state.turn >= 31
        ? "宋朝立国，江南统一压力上升"
        : state.turn >= 21
          ? "中原渐趋统一"
          : "割据局势尚未平息";
    report.push(`${phaseText}，外敌压力回到阶段底线 ${threatFloor}（+${rebound}）`);
  }
  if (r.money > 450 && r.stability > 55) {
    p.fiscal = clampPercent(p.fiscal - 1);
    report.push("府库充实且州县安定，财政压力 -1");
  }
  if (r.money > 900) {
    const leakage = Math.ceil((r.money - 900) / 4);
    r.money = clamp(r.money - leakage, 0, 2000);
    report.push(`府库超过常备规模，赏赐、调拨与贪墨损耗，钱帛 -${leakage}`);
  }
  if (r.army > 320) {
    p.fiscal = clampPercent(p.fiscal + 2);
    report.push("军额庞大，财政压力 +2");
  }
  if (r.people > 520) {
    p.fiscal = clampPercent(p.fiscal + 1);
    report.push("户口繁多，官僚维护成本上升，财政压力 +1");
  }
  return report;
}

function choose(choiceIndex) {
  if (state.finished) {
    startNextCycle();
    return;
  }
  const event = getEvent();
  const yearCondition = getYearCondition();
  const lightEvent = getLightEvent();
  const choice = getEventChoices(event)[choiceIndex];
  const effects = formatEffects(choice.delta);
  const wasBranch = Boolean(state.branchRun);
  applyDelta(choice.delta);
  if (choice.branchStart) {
    state.branch = choice.branchStart;
    state.branchRun = { type: choice.branchStart, index: 0, remaining: 2 };
  }
  const settlementReport = yearlySettlement(yearCondition, lightEvent);

  state.log.unshift(`${event.year} · 年度结算：${settlementReport.join("；")}。`);
  state.log.unshift(`${event.year} · 朝议决断：${event.title}，${choice.label}。${effects.summary}`);
  state.log = state.log.slice(0, 10);
  state.turn += 1;
  state.currentEventIndex += 1;
  if (wasBranch && state.branchRun) {
    state.branchRun.remaining -= 1;
    state.branchRun.index += 1;
    if (state.branchRun.remaining <= 0 || state.branchRun.index >= (branchEvents[state.branchRun.type] || []).length) {
      const ended = state.branchRun.type;
      state.branchRun = null;
      state.branch = "吴越";
      state.log.unshift(`${event.year} · ${ended}观察结束，密使回报钱塘，朝议回到吴越本局。`);
    }
  }
  maybeFinish();
  saveState();
  render();
}

function maybeFinish() {
  const r = state.resources;
  const p = state.pressure;
  if (r.morale <= 0 || r.stability <= 0) {
    finish("内乱崩解", "治乱遗产", "民心与安定耗尽，州县离心。乱世吞没了国号，却留下了治理失败的教训。");
    return;
  }
  if (p.threat >= 100 && r.army < 320) {
    finish("兵败亡国", "血战遗产", "外敌压境，兵力不足。吴越国祚断绝，但后人记住了边防不可轻忽。");
    return;
  }
  if ((r.food <= 0 && state.crisis.foodShortageYears >= 2) || (r.food < 60 && state.crisis.foodStressYears >= 4 && (r.morale < 45 || r.stability < 45))) {
    finish("饥荒动乱", "水利遗产", "仓廪空虚，民心离散。此败让后人明白，太平先从一粒米开始。");
    return;
  }
  if (r.money <= 0 && state.crisis.moneyShortageYears >= 4 && (r.army < 120 || p.fiscal > 90)) {
    finish("军府溃散", "军镇遗产", "府库空竭，军府无饷。兵不再听命，国势随之倾颓。");
    return;
  }
  if (state.turn < events.length + 1) return;

  finish("试玩结束", "钱塘初政", "你已经走完公开试玩版的前十年。完整剧本仍在继续打磨，后续会开放更多年份与路线。");
}

function finish(title, legacyName, text) {
  state.finished = true;
  state.ending = { title, legacyName, text };
  state.legacy.points += 1;
  state.legacy.endings.push(title);
  state.log.unshift(`结局：${title}`);
}

function startNextCycle() {
  const legacy = structuredClone(state.legacy);
  state = ensureRunSetup(structuredClone(defaultState));
  state.legacy = legacy;
  state.resources.morale = clampPercent(state.resources.morale + legacy.points * 2);
  state.resources.stability = clampPercent(state.resources.stability + legacy.points * 2);
  state.resources.food += legacy.points * 15;
  state.resources.money += legacy.points * 10;
  state.log = [`公元930年 · 新一轮开启，文明记忆带来 ${legacy.points} 点遗产加成。`];
  saveState();
  render();
}

function resetSave() {
  if (!confirm("确定清除当前存档并重新开始？")) return;
  localStorage.removeItem(SAVE_KEY);
  state = ensureRunSetup(structuredClone(defaultState));
  render();
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function setBar(id, value) {
  document.getElementById(id).style.width = `${clampPercent(value)}%`;
}

function setResourceBar(id, value, max) {
  document.getElementById(id).style.width = `${clamp((value / max) * 100, 3, 100)}%`;
}

function installRuleTips() {
  for (const [key, lines] of Object.entries(ruleTips)) {
    const valueNode = document.getElementById(key);
    const card = valueNode?.closest(".resource, .pressure");
    if (!card) continue;
    const tip = lines.join("\n");
    card.title = tip;
    card.setAttribute("aria-label", tip);
  }
}

function renderChoices(event) {
  const choices = document.getElementById("choices");
  choices.innerHTML = "";
  if (state.finished) {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.innerHTML = "<strong>开启下一轮</strong><span>保留遗产，回到钱塘立国。</span>";
    button.addEventListener("click", startNextCycle);
    choices.appendChild(button);
    return;
  }
  getEventChoices(event).forEach((choice, index) => {
    const effects = formatEffects(choice.delta);
    const display = getChoiceDisplay(event, choice);
    const effectTags = effects.chips
      .map((chip) => `<em${chip.cost ? ' class="cost"' : ""}>${chip.text}</em>`)
      .join("");
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.innerHTML = `
      <div class="choice-head">
        <strong>${display.label}</strong>
        <div class="choice-effects">${effectTags}</div>
      </div>
      <span>${display.desc}</span>
    `;
    button.addEventListener("click", () => choose(index));
    choices.appendChild(button);
  });
}

function render() {
  const stage = getStage();
  const event = getEvent();
  const r = state.resources;
  const p = state.pressure;
  setText("year", event.year);
  setText("stage", state.branchRun ? `${stage.name} · ${state.branchRun.type}观察` : stage.name);
  setText("turn", state.turn);
  setText("stageText", stage.text);
  for (const key of Object.keys(r)) setText(key, Math.round(r[key]));
  setResourceBar("foodBar", r.food, 2000);
  setResourceBar("moneyBar", r.money, 2000);
  setResourceBar("peopleBar", r.people, 700);
  setResourceBar("armyBar", r.army, 800);
  setResourceBar("moraleBar", r.morale, 100);
  setResourceBar("prestigeBar", r.prestige, 150);
  setResourceBar("stabilityBar", r.stability, 100);
  for (const key of Object.keys(p)) {
    setText(key, Math.round(p[key]));
    setBar(`${key}Bar`, p[key]);
  }
  if (state.finished) {
    setText("eventTitle", state.ending.title);
    setText("eventText", `${state.ending.text} 获得：${state.ending.legacyName}。`);
  } else {
    setText("eventTitle", event.title);
    const branchNote = state.branchRun ? `【${state.branchRun.type}支线观察】这是密使带回的外交情报，不是接管别国内政。` : "";
    setText("eventText", [branchNote, event.text].filter(Boolean).join(" "));
  }
  const summary = state.legacy.points
    ? `遗产点 ${state.legacy.points}。曾达成：${state.legacy.endings.join("、")}。`
    : "尚无遗产。完成一轮结局后，下一轮会获得永久加成。";
  setText("legacySummary", summary);
  const log = document.getElementById("log");
  log.innerHTML = "";
  state.log.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    log.appendChild(li);
  });
  renderChoices(event);
}

document.getElementById("resetSave").addEventListener("click", resetSave);
installRuleTips();
render();
