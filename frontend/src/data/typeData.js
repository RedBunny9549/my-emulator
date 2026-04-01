export const TYPES = [
  "normal","fire","water","electric","grass","ice",
  "fighting","poison","ground","flying","psychic","bug",
  "rock","ghost","dragon","dark","steel","fairy",
];

export const TYPE_COLOR = {
  normal:"#AAAAAA", fire:"#FF4422", water:"#3399FF", electric:"#FFCC33",
  grass:"#77CC55", ice:"#66CCFF", fighting:"#CC6655", poison:"#AA55AA",
  ground:"#DDBB55", flying:"#8899FF", psychic:"#FF5599", bug:"#AABB22",
  rock:"#BBAA66", ghost:"#6655BB", dragon:"#7766EE", dark:"#AA7766",
  steel:"#AAAABB", fairy:"#EE99EE",
};

const GEN1_CHART = {
  normal:   { rock:0.5, ghost:0 },
  fire:     { fire:0.5, water:0.5, rock:0.5, dragon:0.5, grass:2, ice:2, bug:2 },
  water:    { water:0.5, grass:0.5, dragon:0.5, fire:2, ground:2, rock:2 },
  electric: { electric:0.5, grass:0.5, dragon:0.5, flying:2, water:2, ground:0 },
  grass:    { fire:0.5, grass:0.5, poison:0.5, flying:0.5, bug:0.5, dragon:0.5, water:2, ground:2, rock:2 },
  ice:      { water:0.5, ice:0.5, grass:2, ground:2, flying:2, dragon:2 },
  fighting: { poison:0.5, bug:0.5, flying:0.5, psychic:0.5, ghost:0, normal:2, ice:2, rock:2 },
  poison:   { poison:0.5, ground:0.5, rock:0.5, ghost:0.5, bug:2, grass:2 },
  ground:   { grass:0.5, bug:0.5, flying:0, fire:2, electric:2, poison:2, rock:2 },
  flying:   { electric:0.5, rock:0.5, bug:2, grass:2, fighting:2 },
  psychic:  { psychic:0.5, ghost:0, fighting:2, poison:2 },
  bug:      { fire:0.5, fighting:0.5, flying:0.5, grass:2, poison:2, psychic:2 },
  rock:     { fighting:0.5, ground:0.5, fire:2, ice:2, flying:2, bug:2 },
  ghost:    { normal:0, psychic:0 },
  dragon:   { dragon:2 },
  dark:{}, steel:{}, fairy:{},
};

const GEN2_CHART = {
  normal:   { rock:0.5, steel:0.5, ghost:0 },
  fire:     { fire:0.5, water:0.5, rock:0.5, dragon:0.5, grass:2, ice:2, bug:2, steel:2 },
  water:    { water:0.5, grass:0.5, dragon:0.5, fire:2, ground:2, rock:2 },
  electric: { electric:0.5, grass:0.5, dragon:0.5, steel:0.5, flying:2, water:2, ground:0 },
  grass:    { fire:0.5, grass:0.5, poison:0.5, flying:0.5, bug:0.5, dragon:0.5, steel:0.5, water:2, ground:2, rock:2 },
  ice:      { water:0.5, ice:0.5, steel:0.5, grass:2, ground:2, flying:2, dragon:2 },
  fighting: { poison:0.5, bug:0.5, flying:0.5, psychic:0.5, ghost:0, normal:2, ice:2, rock:2, dark:2, steel:2 },
  poison:   { poison:0.5, ground:0.5, rock:0.5, ghost:0.5, steel:0, bug:2, grass:2 },
  ground:   { grass:0.5, bug:0.5, flying:0, fire:2, electric:2, poison:2, rock:2, steel:2 },
  flying:   { electric:0.5, rock:0.5, steel:0.5, bug:2, grass:2, fighting:2 },
  psychic:  { psychic:0.5, steel:0.5, dark:0, fighting:2, poison:2 },
  bug:      { fire:0.5, fighting:0.5, flying:0.5, ghost:0.5, steel:0.5, grass:2, psychic:2, dark:2 },
  rock:     { fighting:0.5, ground:0.5, steel:0.5, fire:2, ice:2, flying:2, bug:2 },
  ghost:    { normal:0, dark:0.5, psychic:2, ghost:2 },
  dragon:   { steel:0.5, dragon:2 },
  dark:     { fighting:0.5, dark:0.5, psychic:2, ghost:2 },
  steel:    { fire:0.5, water:0.5, electric:0.5, steel:0.5, normal:0.5, grass:0.5,
              flying:0.5, psychic:0.5, bug:0.5, ghost:0.5, dragon:0.5, dark:0.5,
              poison:0, rock:2, ice:2 },
  fairy:    {},
};

const GEN6_CHART = {
  ...GEN2_CHART,
  fairy:    { fire:0.5, poison:0.5, steel:0.5, fighting:2, dragon:2, dark:2 },
  dragon:   { steel:0.5, dragon:2, fairy:0 },
  dark:     { fighting:0.5, dark:0.5, fairy:0.5, psychic:2, ghost:2 },
  fighting: { poison:0.5, bug:0.5, flying:0.5, psychic:0.5, ghost:0, fairy:0.5, dark:2, normal:2, ice:2, rock:2, steel:2 },
  poison:   { poison:0.5, ground:0.5, rock:0.5, ghost:0.5, steel:0, bug:2, grass:2, fairy:2 },
};

export function getChart(gen) {
  if (gen <= 1) return GEN1_CHART;
  if (gen <= 5) return GEN2_CHART;
  return GEN6_CHART;
}

export function getMultiplier(attacking, defending, gen = 6) {
  const chart = getChart(gen);
  return chart[attacking]?.[defending] ?? 1;
}

export function getDefenseMatchups(types, gen = 6) {
  const result = {};
  for (const atk of TYPES) {
    let mult = 1;
    for (const def of types) mult *= getMultiplier(atk, def, gen);
    result[atk] = mult;
  }
  return result;
}

export const GEN_OPTIONS = [
  { label: "Gen 1 (RBY)", value: 1 },
  { label: "Gen 2–5 (GSC–BW)", value: 2 },
  { label: "Gen 6+ (XY–SV)", value: 6 },
];
