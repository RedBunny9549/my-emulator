// frontend/src/data/bossData.js

export const BOSS_DATA = {
  emerald: {
    gyms: [
      { num: 1, leader: "Roxanne", city: "Rustboro City", badge: "Stone Badge", team: [{ name: "geodude", level: 12 }, { name: "geodude", level: 12 }, { name: "nosepass", level: 15 }] },
      { num: 2, leader: "Brawly", city: "Dewford Town", badge: "Knuckle Badge", team: [{ name: "machop", level: 17 }, { name: "meditite", level: 17 }, { name: "makuhita", level: 19 }] },
      { num: 3, leader: "Wattson", city: "Mauville City", badge: "Dynamo Badge", team: [{ name: "voltorb", level: 20 }, { name: "electrike", level: 20 }, { name: "magneton", level: 22 }, { name: "manectric", level: 24 }] },
      { num: 4, leader: "Flannery", city: "Lavaridge Town", badge: "Heat Badge", team: [{ name: "slugma", level: 26 }, { name: "slugma", level: 26 }, { name: "camerupt", level: 28 }, { name: "torkoal", level: 29 }] },
      { num: 5, leader: "Norman", city: "Petalburg City", badge: "Balance Badge", team: [{ name: "spinda", level: 27 }, { name: "vigoroth", level: 27 }, { name: "linoone", level: 29 }, { name: "slaking", level: 31 }] },
      { num: 6, leader: "Winona", city: "Fortree City", badge: "Feather Badge", team: [{ name: "swablu", level: 27 }, { name: "tropius", level: 29 }, { name: "pelipper", level: 30 }, { name: "skarmory", level: 31 }, { name: "altaria", level: 33 }] },
      { num: 7, leader: "Tate & Liza", city: "Mossdeep City", badge: "Mind Badge", team: [{ name: "solrock", level: 42 }, { name: "lunatone", level: 42 }] },
      { num: 8, leader: "Juan", city: "Sootopolis City", badge: "Rain Badge", team: [{ name: "luvdisc", level: 41 }, { name: "whiscash", level: 41 }, { name: "sealeo", level: 43 }, { name: "crawdaunt", level: 43 }, { name: "kingdra", level: 46 }] }
    ],
    elite: [
      { leader: "Sidney", title: "Elite Four", team: [{ name: "mightyena", level: 46 }, { name: "shiftry", level: 48 }, { name: "cacturne", level: 46 }, { name: "absol", level: 49 }, { name: "sharpedo", level: 48 }] },
      { leader: "Phoebe", title: "Elite Four", team: [{ name: "dusclops", level: 48 }, { name: "banette", level: 49 }, { name: "sableye", level: 50 }, { name: "banette", level: 49 }, { name: "dusclops", level: 51 }] },
      { leader: "Glacia", title: "Elite Four", team: [{ name: "sealeo", level: 50 }, { name: "glalie", level: 50 }, { name: "sealeo", level: 52 }, { name: "glalie", level: 52 }, { name: "walrein", level: 53 }] },
      { leader: "Drake", title: "Elite Four", team: [{ name: "shelgon", level: 52 }, { name: "altaria", level: 54 }, { name: "flygon", level: 53 }, { name: "flygon", level: 53 }, { name: "salamence", level: 55 }] },
    ],
    champion: { leader: "Wallace", title: "Champion", team: [{ name: "wailord", level: 57 }, { name: "tentacruel", level: 55 }, { name: "ludicolo", level: 56 }, { name: "whiscash", level: 56 }, { name: "gyarados", level: 58 }, { name: "milotic", level: 58 }] }
  },
  firered: {
    gyms: [
      { num: 1, leader: "Brock", city: "Pewter City", badge: "Boulder Badge", team: [{ name: "geodude", level: 12 }, { name: "onix", level: 14 }] },
      { num: 2, leader: "Misty", city: "Cerulean City", badge: "Cascade Badge", team: [{ name: "staryu", level: 18 }, { name: "starmie", level: 21 }] },
      { num: 3, leader: "Lt. Surge", city: "Vermilion City", badge: "Thunder Badge", team: [{ name: "voltorb", level: 21 }, { name: "pikachu", level: 18 }, { name: "raichu", level: 24 }] },
      { num: 4, leader: "Erika", city: "Celadon City", badge: "Rainbow Badge", team: [{ name: "victreebel", level: 29 }, { name: "tangela", level: 24 }, { name: "vileplume", level: 29 }] },
      { num: 5, leader: "Koga", city: "Fuchsia City", badge: "Soul Badge", team: [{ name: "koffing", level: 37 }, { name: "muk", level: 39 }, { name: "koffing", level: 37 }, { name: "weezing", level: 43 }] },
      { num: 6, leader: "Sabrina", city: "Saffron City", badge: "Marsh Badge", team: [{ name: "kadabra", level: 38 }, { name: "mr-mime", level: 37 }, { name: "venomoth", level: 38 }, { name: "alakazam", level: 43 }] },
      { num: 7, leader: "Blaine", city: "Cinnabar Island", badge: "Volcano Badge", team: [{ name: "growlithe", level: 42 }, { name: "ponyta", level: 40 }, { name: "rapidash", level: 42 }, { name: "arcanine", level: 47 }] },
      { num: 8, leader: "Giovanni", city: "Viridian City", badge: "Earth Badge", team: [{ name: "rhyhorn", level: 45 }, { name: "dugtrio", level: 42 }, { name: "nidoqueen", level: 44 }, { name: "nidoking", level: 45 }, { name: "rhydon", level: 50 }] }
    ],
    elite: [
      { leader: "Lorelei", title: "Elite Four", team: [{ name: "dewgong", level: 52 }, { name: "cloyster", level: 51 }, { name: "slowbro", level: 52 }, { name: "jynx", level: 54 }, { name: "lapras", level: 54 }] },
      { leader: "Bruno", title: "Elite Four", team: [{ name: "onix", level: 53 }, { name: "hitmonchan", level: 55 }, { name: "hitmonlee", level: 55 }, { name: "onix", level: 53 }, { name: "machamp", level: 58 }] },
      { leader: "Agatha", title: "Elite Four", team: [{ name: "gengar", level: 54 }, { name: "haunter", level: 53 }, { name: "gengar", level: 58 }, { name: "arbok", level: 54 }, { name: "gengar", level: 58 }] },
      { leader: "Lance", title: "Elite Four", team: [{ name: "gyarados", level: 56 }, { name: "dragonair", level: 54 }, { name: "dragonair", level: 54 }, { name: "aerodactyl", level: 58 }, { name: "dragonite", level: 60 }] }
    ],
    champion: { leader: "Blue", title: "Champion", team: [{ name: "pidgeot", level: 61 }, { name: "alakazam", level: 59 }, { name: "rhydon", level: 61 }, { name: "gyarados", level: 61 }, { name: "arcanine", level: 63 }, { name: "venusaur", level: 65 }] }
  },
  crystal: {
    gyms: [
      { num: 1, leader: "Falkner", city: "Violet City", badge: "Zephyr Badge", team: [{ name: "pidgey", level: 7 }, { name: "pidgeotto", level: 9 }] },
      { num: 2, leader: "Bugsy", city: "Azalea Town", badge: "Hive Badge", team: [{ name: "metapod", level: 14 }, { name: "kakuna", level: 14 }, { name: "scyther", level: 16 }] },
      { num: 3, leader: "Whitney", city: "Goldenrod City", badge: "Plain Badge", team: [{ name: "clefairy", level: 18 }, { name: "miltank", level: 20 }] },
      { num: 4, leader: "Morty", city: "Ecruteak City", badge: "Fog Badge", team: [{ name: "gastly", level: 21 }, { name: "haunter", level: 21 }, { name: "haunter", level: 23 }, { name: "gengar", level: 25 }] },
      { num: 5, leader: "Chuck", city: "Cianwood City", badge: "Storm Badge", team: [{ name: "primeape", level: 27 }, { name: "poliwrath", level: 30 }] },
      { num: 6, leader: "Jasmine", city: "Olivine City", badge: "Mineral Badge", team: [{ name: "magnemite", level: 30 }, { name: "magnemite", level: 30 }, { name: "steelix", level: 35 }] },
      { num: 7, leader: "Pryce", city: "Mahogany Town", badge: "Glacier Badge", team: [{ name: "seel", level: 27 }, { name: "dewgong", level: 29 }, { name: "piloswine", level: 31 }] },
      { num: 8, leader: "Clair", city: "Blackthorn City", badge: "Rising Badge", team: [{ name: "dragonair", level: 37 }, { name: "dragonair", level: 37 }, { name: "dragonair", level: 37 }, { name: "kingdra", level: 40 }] }
    ],
    elite: [
      { leader: "Will", title: "Elite Four", team: [{ name: "xatu", level: 40 }, { name: "jynx", level: 41 }, { name: "exeggutor", level: 41 }, { name: "slowbro", level: 41 }, { name: "xatu", level: 42 }] },
      { leader: "Koga", title: "Elite Four", team: [{ name: "ariados", level: 40 }, { name: "venomoth", level: 41 }, { name: "forretress", level: 43 }, { name: "muk", level: 42 }, { name: "crobat", level: 44 }] },
      { leader: "Bruno", title: "Elite Four", team: [{ name: "hitmontop", level: 42 }, { name: "hitmonlee", level: 42 }, { name: "hitmonchan", level: 42 }, { name: "onix", level: 43 }, { name: "machamp", level: 46 }] },
      { leader: "Karen", title: "Elite Four", team: [{ name: "umbreon", level: 42 }, { name: "vileplume", level: 42 }, { name: "murkrow", level: 44 }, { name: "gengar", level: 45 }, { name: "houndoom", level: 47 }] }
    ],
    champion: { leader: "Lance", title: "Champion", team: [{ name: "gyarados", level: 44 }, { name: "dragonite", level: 47 }, { name: "dragonite", level: 47 }, { name: "aerodactyl", level: 46 }, { name: "charizard", level: 46 }, { name: "dragonite", level: 50 }] },
    secret: { leader: "Red", title: "Pokemon Trainer", team: [{ name: "pikachu", level: 81 }, { name: "espeon", level: 73 }, { name: "snorlax", level: 75 }, { name: "venusaur", level: 77 }, { name: "charizard", level: 77 }, { name: "blastoise", level: 77 }] }
  }
};
