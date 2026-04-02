// Encounter tables for Gen 3 games
// Keys are normalized lowercase for lookup

export const ENCOUNTER_TABLES = {
  emerald: {
    "route 101": ["Poochyena", "Zigzagoon", "Wurmple"],
    "route 102": ["Poochyena", "Zigzagoon", "Wurmple", "Lotad", "Seedot"],
    "route 103": ["Poochyena", "Zigzagoon", "Wingull"],
    "route 104": ["Wurmple", "Wingull", "Taillow", "Marill"],
    "route 105": ["Tentacool", "Wingull"],
    "route 106": ["Tentacool", "Wingull"],
    "route 107": ["Tentacool", "Wingull"],
    "route 108": ["Tentacool", "Wingull"],
    "route 109": ["Tentacool", "Wingull"],
    "route 110": ["Electrike", "Minun", "Plusle", "Oddish", "Gulpin"],
    "route 111": ["Sandshrew", "Trapinch", "Cacnea", "Vulpix", "Spinda"],
    "route 112": ["Numel", "Machop", "Spoink"],
    "route 113": ["Spinda", "Skarmory", "Sandshrew"],
    "route 114": ["Lotad", "Poochyena", "Surskit", "Lombre"],
    "route 115": ["Swablu", "Jigglypuff", "Taillow"],
    "route 116": ["Nincada", "Skitty", "Whismur", "Abra"],
    "route 117": ["Volbeat", "Illumise", "Oddish", "Marill"],
    "route 118": ["Electrike", "Wingull", "Kecleon"],
    "route 119": ["Oddish", "Kecleon", "Wingull", "Tropius"],
    "route 120": ["Absol", "Kecleon", "Oddish"],
    "route 121": ["Shuppet", "Kecleon", "Wingull"],
    "route 122": ["Tentacool", "Wingull"],
    "route 123": ["Shuppet", "Kecleon", "Wingull", "Oddish"],
    "route 124": ["Wingull", "Tentacool"],
    "route 125": ["Wingull", "Tentacool"],
    "route 126": ["Wingull", "Tentacool", "Wailmer"],
    "route 127": ["Wingull", "Tentacool", "Wailmer"],
    "route 128": ["Wingull", "Tentacool", "Wailmer"],
    "route 129": ["Wailmer", "Tentacool"],
    "route 130": ["Wailmer", "Tentacool"],
    "route 131": ["Wailmer", "Tentacool"],
    "route 132": ["Poochyena", "Wingull", "Magikarp"],
    "route 133": ["Poochyena", "Wingull", "Magikarp"],
    "route 134": ["Poochyena", "Wingull", "Magikarp"],
    "petalburg woods": ["Wurmple", "Shroomish", "Slakoth", "Taillow"],
    "rusturf tunnel": ["Whismur"],
    "granite cave": ["Abra", "Geodude", "Zubat", "Makuhita", "Sableye", "Mawile"],
    "fiery path": ["Torkoal", "Koffing", "Machop", "Grimer"],
    "jagged pass": ["Numel", "Slugma", "Machop", "Spoink"],
    "mt. chimney": ["Numel", "Spinda", "Machop"],
    "mt chimney": ["Numel", "Spinda", "Machop"],
    "meteor falls": ["Solrock", "Bagon", "Zubat", "Goldeen"],
    "mt. pyre": ["Shuppet", "Duskull", "Wingull"],
    "mt pyre": ["Shuppet", "Duskull", "Wingull"],
    "cave of origin": ["Sableye", "Mawile", "Graveler", "Zubat", "Groudon", "Kyogre"],
    "shoal cave": ["Spheal", "Zubat", "Snorunt"],
    "seafloor cavern": ["Zubat", "Golbat", "Tentacool"],
    "victory road": ["Golbat", "Hariyama", "Mightyena", "Graveler", "Machoke", "Lairon"],
    "safari zone": ["Pikachu", "Doduo", "Rhyhorn", "Pinsir", "Heracross", "Girafarig", "Natu"],
    "desert underpass": ["Baltoy", "Trapinch"],
    "sky pillar": ["Claydol", "Golbat", "Sableye", "Mawile", "Altaria", "Rayquaza"],
    "scorched slab": ["Vulpix", "Zubat"],
    "desert ruins": ["Regirock"],
    "island cave": ["Regice"],
    "ancient tomb": ["Registeel"],
    "southern island": ["Latias", "Latios"],
    "navel rock": ["Ho-oh", "Lugia"],
    "birth island": ["Deoxys"]
  },
  firered: {
    "route 1": ["Pidgey", "Rattata"],
    "route 2": ["Pidgey", "Rattata", "Caterpie", "Nidoran♂", "Nidoran♀"],
    "route 3": ["Jigglypuff", "Mankey", "Spearow", "Pidgey", "Nidoran♂", "Nidoran♀"],
    "route 4": ["Spearow", "Rattata", "Ekans", "Mankey"],
    "route 5": ["Meowth", "Mankey", "Pidgey", "Jigglypuff", "Abra"],
    "route 6": ["Pidgey", "Meowth", "Mankey", "Magnemite", "Abra", "Drowzee"],
    "route 7": ["Vulpix", "Pidgey", "Growlithe", "Rattata", "Nidoran♂", "Nidoran♀"],
    "route 8": ["Pidgey", "Meowth", "Growlithe", "Vulpix", "Ekans", "Drowzee"],
    "route 9": ["Rattata", "Nidoran♂", "Nidoran♀", "Spearow", "Bellsprout", "Mankey"],
    "route 10": ["Spearow", "Voltorb", "Magnemite", "Raticate", "Nidoran♂", "Nidoran♀"],
    "route 11": ["Spearow", "Ekans", "Rattata", "Electabuzz", "Drowzee"],
    "route 12": ["Pidgey", "Venonat", "Bellsprout", "Weepinbell"],
    "route 13": ["Pidgey", "Venonat", "Weepinbell"],
    "route 14": ["Venonat", "Weepinbell"],
    "route 15": ["Venonat", "Nidorina"],
    "route 16": ["Rattata", "Spearow", "Doduo", "Hypno"],
    "route 17": ["Rattata", "Spearow", "Doduo", "Fearow", "Ditto"],
    "route 18": ["Rattata", "Spearow", "Doduo", "Fearow"],
    "route 21": ["Tangela", "Cubone", "Ponyta", "Magmar", "Ditto"],
    "route 22": ["Rattata", "Spearow", "Nidoran♂", "Nidoran♀", "Mankey"],
    "route 23": ["Arbok", "Primeape", "Fearow", "Ditto"],
    "route 24": ["Caterpie", "Metapod", "Bellsprout", "Pidgey", "Abra"],
    "route 25": ["Caterpie", "Metapod", "Pidgey", "Bellsprout", "Jigglypuff"],
    "viridian forest": ["Caterpie", "Metapod", "Pikachu", "Weedle", "Kakuna"],
    "mt. moon": ["Zubat", "Geodude", "Clefairy", "Paras"],
    "mt moon": ["Zubat", "Geodude", "Clefairy", "Paras"],
    "rock tunnel": ["Zubat", "Geodude", "Machop", "Onix"],
    "diglett's cave": ["Diglett", "Dugtrio"],
    "digletts cave": ["Diglett", "Dugtrio"],
    "pokemon tower": ["Gastly", "Haunter", "Cubone"],
    "safari zone": ["Nidorino", "Nidorina", "Parasect", "Rhyhorn", "Exeggcute", "Chansey", "Scyther", "Kangaskhan", "Tauros", "Pinsir"],
    "power plant": ["Voltorb", "Magnemite", "Magneton", "Raichu", "Electabuzz", "Electrode", "Zapdos"],
    "seafoam islands": ["Zubat", "Golbat", "Seel", "Dewgong", "Slowpoke", "Jynx", "Articuno"],
    "victory road": ["Geodude", "Graveler", "Onix", "Marowak", "Primeape", "Magneton", "Venomoth"],
    "cerulean cave": ["Kangaskhan", "Golbat", "Wobbuffet", "Kadabra", "Hypno", "Dodrio", "Ditto", "Mewtwo"],
    "mt. ember": ["Spearow", "Fearow", "Geodude", "Ponyta", "Rapidash", "Magmar", "Moltres"],
    "roaming": ["Raikou", "Entei", "Suicune"]
  },
};

export function getGameKey(game) {
  const g = (game || "").toLowerCase();
  if (g.includes("emerald") || g.includes("ruby") || g.includes("sapphire")) return "emerald";
  if (
    g.includes("firered") || g.includes("fire red") ||
    g.includes("leafgreen") || g.includes("leaf green")
  ) return "firered";
  // Common ROM hacks based on FR/E
  if (g.includes("radical red") || g.includes("unbound")) return "firered";
  return null;
}

export function getEncounterSuggestions(game, location) {
  const key = getGameKey(game);
  if (!key) return null;
  const table = ENCOUNTER_TABLES[key];
  if (!table) return null;
  return table[location.toLowerCase().trim()] || null;
}
