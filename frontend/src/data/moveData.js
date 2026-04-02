// frontend/src/data/moveData.js

// Gen 3 Mechanics: Category (Physical/Special) is determined strictly by Type.
// Physical: Normal, Fighting, Flying, Poison, Ground, Rock, Bug, Ghost, Steel
// Special: Fire, Water, Grass, Electric, Psychic, Ice, Dragon, Dark

export const MOVE_DATA = {
  // Normal
  "tackle": { type: "normal", power: 35, acc: 100 },
  "quick-attack": { type: "normal", power: 40, acc: 100 },
  "body-slam": { type: "normal", power: 85, acc: 100 },
  "facade": { type: "normal", power: 70, acc: 100 },
  "slash": { type: "normal", power: 70, acc: 100 },
  "hyper-beam": { type: "normal", power: 150, acc: 90 },
  "extreme-speed": { type: "normal", power: 80, acc: 100 },
  "selfdestruct": { type: "normal", power: 200, acc: 100 },
  "explosion": { type: "normal", power: 250, acc: 100 },
  
  // Fighting
  "karate-chop": { type: "fighting", power: 50, acc: 100 },
  "vital-throw": { type: "fighting", power: 70, acc: "-" },
  "cross-chop": { type: "fighting", power: 100, acc: 80 },
  "mach-punch": { type: "fighting", power: 40, acc: 100 },
  "brick-break": { type: "fighting", power: 75, acc: 100 },

  // Flying
  "peck": { type: "flying", power: 35, acc: 100 },
  "aerial-ace": { type: "flying", power: 60, acc: "-" },
  "fly": { type: "flying", power: 70, acc: 95 },
  "wing-attack": { type: "flying", power: 60, acc: 100 },

  // Ground
  "earthquake": { type: "ground", power: 100, acc: 100 },
  "magnitude": { type: "ground", power: "?", acc: 100 },
  "sand-tomb": { type: "ground", power: 15, acc: 70 },

  // Rock
  "rock-throw": { type: "rock", power: 50, acc: 90 },
  "rock-tomb": { type: "rock", power: 50, acc: 80 },
  "rock-slide": { type: "rock", power: 75, acc: 90 },

  // Bug
  "megahorn": { type: "bug", power: 120, acc: 85 },
  "silver-wind": { type: "bug", power: 60, acc: 100 },

  // Ghost
  "shadow-ball": { type: "ghost", power: 80, acc: 100 },
  "shadow-punch": { type: "ghost", power: 60, acc: "-" },
  "astonish": { type: "ghost", power: 30, acc: 100 },

  // Steel
  "steel-wing": { type: "steel", power: 70, acc: 90 },
  "iron-tail": { type: "steel", power: 100, acc: 75 },

  // Fire
  "ember": { type: "fire", power: 40, acc: 100 },
  "flamethrower": { type: "fire", power: 95, acc: 100 },
  "fire-blast": { type: "fire", power: 120, acc: 85 },
  "overheat": { type: "fire", power: 140, acc: 90 },
  "fire-punch": { type: "fire", power: 75, acc: 100 },

  // Water
  "water-gun": { type: "water", power: 40, acc: 100 },
  "water-pulse": { type: "water", power: 60, acc: 100 },
  "surf": { type: "water", power: 95, acc: 100 },
  "crabhammer": { type: "water", power: 90, acc: 85 },

  // Grass
  "absorb": { type: "grass", power: 20, acc: 100 },
  "magical-leaf": { type: "grass", power: 60, acc: "-" },
  "giga-drain": { type: "grass", power: 60, acc: 100 },
  "solarbeam": { type: "grass", power: 120, acc: 100 },

  // Electric
  "spark": { type: "electric", power: 65, acc: 100 },
  "thunderbolt": { type: "electric", power: 95, acc: 100 },
  "thunder": { type: "electric", power: 120, acc: 70 },
  "thunder-punch": { type: "electric", power: 75, acc: 100 },

  // Psychic
  "confusion": { type: "psychic", power: 50, acc: 100 },
  "psybeam": { type: "psychic", power: 65, acc: 100 },
  "psychic": { type: "psychic", power: 90, acc: 100 },
  "extrasensory": { type: "psychic", power: 80, acc: 100 },

  // Ice
  "icy-wind": { type: "ice", power: 55, acc: 95 },
  "aurora-beam": { type: "ice", power: 65, acc: 100 },
  "ice-beam": { type: "ice", power: 95, acc: 100 },
  "blizzard": { type: "ice", power: 120, acc: 70 },

  // Dragon
  "dragonbreath": { type: "dragon", power: 60, acc: 100 },
  "dragon-claw": { type: "dragon", power: 80, acc: 100 },

  // Dark
  "bite": { type: "dark", power: 60, acc: 100 },
  "faint-attack": { type: "dark", power: 60, acc: "-" },
  "crunch": { type: "dark", power: 80, acc: 100 }
};

// Helper function to check category
export function getMoveCategory(type) {
  const physicalTypes = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel"];
  if (physicalTypes.includes(type)) return "Physical";
  return "Special";
}
