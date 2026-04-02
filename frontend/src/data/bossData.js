// frontend/src/data/bossData.js

export const BOSS_DATA = {
  emerald: {
    gyms: [
      { num: 1, leader: "Roxanne", city: "Rustboro City", badge: "Stone Badge", team: [
        { name: "geodude", level: 12, ability: "Rock Head", moves: ["tackle", "defense-curl", "rock-throw", "rock-tomb"] },
        { name: "geodude", level: 12, ability: "Rock Head", moves: ["tackle", "defense-curl", "rock-throw", "rock-tomb"] },
        { name: "nosepass", level: 15, item: "oran-berry", ability: "Sturdy", moves: ["tackle", "harden", "block", "rock-tomb"] }
      ]},
      { num: 2, leader: "Brawly", city: "Dewford Town", badge: "Knuckle Badge", team: [
        { name: "machop", level: 17, ability: "Guts", moves: ["karate-chop", "low-kick", "seismic-toss", "bulk-up"] },
        { name: "meditite", level: 17, ability: "Pure Power", moves: ["focus-punch", "light-screen", "reflect", "bulk-up"] },
        { name: "makuhita", level: 19, item: "sitrus-berry", ability: "Thick Fat", moves: ["arm-thrust", "vital-throw", "reversal", "bulk-up"] }
      ]},
      { num: 3, leader: "Wattson", city: "Mauville City", badge: "Dynamo Badge", team: [
        { name: "voltorb", level: 20, ability: "Soundproof", moves: ["rollout", "spark", "selfdestruct", "shock-wave"] },
        { name: "electrike", level: 20, ability: "Static", moves: ["quick-attack", "howl", "shock-wave", "thunder-wave"] },
        { name: "magneton", level: 22, ability: "Magnet Pull", moves: ["supersonic", "sonic-boom", "thunder-wave", "shock-wave"] },
        { name: "manectric", level: 24, item: "sitrus-berry", ability: "Static", moves: ["quick-attack", "howl", "shock-wave", "thunder-wave"] }
      ]},
      { num: 4, leader: "Flannery", city: "Lavaridge Town", badge: "Heat Badge", team: [
        { name: "numel", level: 24, ability: "Oblivious", moves: ["overheat", "take-down", "magnitude", "sunny-day"] },
        { name: "slugma", level: 24, ability: "Magma Armor", moves: ["overheat", "smog", "light-screen", "sunny-day"] },
        { name: "camerupt", level: 26, ability: "Magma Armor", moves: ["overheat", "tackle", "attract", "sunny-day"] },
        { name: "torkoal", level: 29, item: "white-herb", ability: "White Smoke", moves: ["overheat", "body-slam", "flamethrower", "sunny-day"] }
      ]},
      { num: 5, leader: "Norman", city: "Petalburg City", badge: "Balance Badge", team: [
        { name: "spinda", level: 27, ability: "Own Tempo", moves: ["teeter-dance", "psybeam", "facade", "encore"] },
        { name: "vigoroth", level: 27, ability: "Vital Spirit", moves: ["slash", "facade", "encore", "faint-attack"] },
        { name: "linoone", level: 29, ability: "Pickup", moves: ["slash", "belly-drum", "facade", "headbutt"] },
        { name: "slaking", level: 31, item: "sitrus-berry", ability: "Truant", moves: ["yawn", "counter", "facade", "faint-attack"] }
      ]},
      { num: 6, leader: "Winona", city: "Fortree City", badge: "Feather Badge", team: [
        { name: "swablu", level: 29, ability: "Natural Cure", moves: ["perish-song", "mirror-move", "safeguard", "aerial-ace"] },
        { name: "tropius", level: 29, ability: "Chlorophyll", moves: ["solar-beam", "sunny-day", "synthesis", "aerial-ace"] },
        { name: "pelipper", level: 30, ability: "Keen Eye", moves: ["water-gun", "supersonic", "protect", "aerial-ace"] },
        { name: "skarmory", level: 31, ability: "Keen Eye", moves: ["sand-attack", "steel-wing", "aerial-ace", "agility"] },
        { name: "altaria", level: 33, item: "oran-berry", ability: "Natural Cure", moves: ["dragon-breath", "dragon-dance", "earthquake", "aerial-ace"] }
      ]},
      { num: 7, leader: "Tate & Liza", city: "Mossdeep City", badge: "Mind Badge", team: [
        { name: "claydol", level: 41, ability: "Levitate", moves: ["earthquake", "ancient-power", "psychic", "light-screen"] },
        { name: "xatu", level: 41, ability: "Synchronize", moves: ["psychic", "sunny-day", "confuse-ray", "calm-mind"] },
        { name: "lunatone", level: 42, item: "sitrus-berry", ability: "Levitate", moves: ["light-screen", "psychic", "hypnosis", "calm-mind"] },
        { name: "solrock", level: 42, item: "sitrus-berry", ability: "Levitate", moves: ["sunny-day", "solar-beam", "psychic", "flamethrower"] }
      ]},
      { num: 8, leader: "Juan", city: "Sootopolis City", badge: "Rain Badge", team: [
        { name: "luvdisc", level: 41, ability: "Swift Swim", moves: ["water-pulse", "attract", "sweet-kiss", "flail"] },
        { name: "whiscash", level: 41, ability: "Oblivious", moves: ["rain-dance", "water-pulse", "earthquake", "amnesia"] },
        { name: "sealeo", level: 43, ability: "Thick Fat", moves: ["aurora-beam", "water-pulse", "encore", "body-slam"] },
        { name: "crawdaunt", level: 43, ability: "Hyper Cutter", moves: ["water-pulse", "crabhammer", "taunt", "leer"] },
        { name: "kingdra", level: 46, item: "chesto-berry", ability: "Swift Swim", moves: ["water-pulse", "double-team", "ice-beam", "rest"] }
      ]}
    ],
    elite: [
      { leader: "Sidney", title: "Elite Four", team: [
        { name: "mightyena", level: 46, ability: "Intimidate", moves: ["roar", "double-edge", "sand-attack", "crunch"] },
        { name: "shiftry", level: 48, ability: "Chlorophyll", moves: ["torment", "double-team", "swagger", "extrasensory"] },
        { name: "cacturne", level: 46, ability: "Sand Veil", moves: ["leech-seed", "faint-attack", "needles", "cotton-spore"] },
        { name: "crawdaunt", level: 48, ability: "Hyper Cutter", moves: ["swords-dance", "surf", "facade", "knock-off"] },
        { name: "absol", level: 49, item: "sitrus-berry", ability: "Pressure", moves: ["aerial-ace", "rock-slide", "swords-dance", "slash"] }
      ]},
      { leader: "Phoebe", title: "Elite Four", team: [
        { name: "dusclops", level: 48, ability: "Pressure", moves: ["shadow-punch", "confuse-ray", "curse", "protect"] },
        { name: "banette", level: 49, ability: "Insomnia", moves: ["shadow-ball", "grudge", "toxic", "will-o-wisp"] },
        { name: "sableye", level: 50, ability: "Keen Eye", moves: ["shadow-ball", "faint-attack", "double-team", "night-shade"] },
        { name: "banette", level: 49, ability: "Insomnia", moves: ["shadow-ball", "psychic", "thunderbolt", "facade"] },
        { name: "dusclops", level: 51, item: "sitrus-berry", ability: "Pressure", moves: ["shadow-ball", "ice-beam", "rock-slide", "earthquake"] }
      ]},
      { leader: "Glacia", title: "Elite Four", team: [
        { name: "sealeo", level: 50, ability: "Thick Fat", moves: ["encore", "ice-ball", "body-slam", "hail"] },
        { name: "glalie", level: 50, ability: "Inner Focus", moves: ["ice-beam", "light-screen", "crunch", "icy-wind"] },
        { name: "sealeo", level: 52, ability: "Thick Fat", moves: ["attract", "double-edge", "blizzard", "hail"] },
        { name: "glalie", level: 52, ability: "Inner Focus", moves: ["ice-beam", "shadow-ball", "explosion", "hail"] },
        { name: "walrein", level: 53, item: "sitrus-berry", ability: "Thick Fat", moves: ["surf", "body-slam", "ice-beam", "sheer-cold"] }
      ]},
      { leader: "Drake", title: "Elite Four", team: [
        { name: "shelgon", level: 52, ability: "Rock Head", moves: ["rock-tomb", "dragon-claw", "protect", "double-edge"] },
        { name: "altaria", level: 54, ability: "Natural Cure", moves: ["dragon-dance", "dragon-breath", "aerial-ace", "double-edge"] },
        { name: "kingdra", level: 53, ability: "Swift Swim", moves: ["smokescreen", "dragon-dance", "surf", "body-slam"] },
        { name: "flygon", level: 53, ability: "Levitate", moves: ["dragon-breath", "earthquake", "crunch", "flamethrower"] },
        { name: "salamence", level: 55, item: "sitrus-berry", ability: "Intimidate", moves: ["dragon-claw", "crunch", "flamethrower", "rock-slide"] }
      ]},
    ],
    champion: { leader: "Wallace", title: "Champion", team: [
      { name: "wailord", level: 57, ability: "Water Veil", moves: ["water-spout", "double-edge", "blizzard", "earthquake"] },
      { name: "tentacruel", level: 55, ability: "Clear Body", moves: ["toxic", "hydro-pump", "sludge-bomb", "ice-beam"] },
      { name: "ludicolo", level: 56, ability: "Swift Swim", moves: ["giga-drain", "surf", "leech-seed", "double-team"] },
      { name: "whiscash", level: 56, ability: "Oblivious", moves: ["earthquake", "surf", "amnesia", "hyper-beam"] },
      { name: "gyarados", level: 56, ability: "Intimidate", moves: ["dragon-dance", "earthquake", "hyper-beam", "surf"] },
      { name: "milotic", level: 58, item: "lum-berry", ability: "Marvel Scale", moves: ["recover", "surf", "ice-beam", "toxic"] }
    ]}
  },
  firered: {
    gyms: [
      { num: 1, leader: "Brock", city: "Pewter City", badge: "Boulder Badge", team: [
        { name: "geodude", level: 12, ability: "Rock Head", moves: ["tackle", "defense-curl"] }, 
        { name: "onix", level: 14, ability: "Rock Head", moves: ["tackle", "bind", "bide", "rock-tomb"] }
      ]},
      { num: 2, leader: "Misty", city: "Cerulean City", badge: "Cascade Badge", team: [
        { name: "staryu", level: 18, ability: "Illuminate", moves: ["tackle", "harden", "recover", "water-pulse"] }, 
        { name: "starmie", level: 21, item: "oran-berry", ability: "Illuminate", moves: ["water-pulse", "rapid-spin", "recover", "swift"] }
      ]},
      { num: 3, leader: "Lt. Surge", city: "Vermilion City", badge: "Thunder Badge", team: [
        { name: "voltorb", level: 21, ability: "Soundproof", moves: ["tackle", "screech", "sonic-boom", "shock-wave"] }, 
        { name: "pikachu", level: 18, ability: "Static", moves: ["quick-attack", "double-team", "thunder-wave", "shock-wave"] }, 
        { name: "raichu", level: 24, item: "oran-berry", ability: "Static", moves: ["quick-attack", "double-team", "shock-wave", "thunder-wave"] }
      ]},
      { num: 4, leader: "Erika", city: "Celadon City", badge: "Rainbow Badge", team: [
        { name: "victreebel", level: 29, ability: "Chlorophyll", moves: ["stun-spore", "acid", "poison-powder", "giga-drain"] }, 
        { name: "tangela", level: 24, ability: "Chlorophyll", moves: ["ingrain", "constrict", "poison-powder", "giga-drain"] }, 
        { name: "vileplume", level: 29, item: "sitrus-berry", ability: "Chlorophyll", moves: ["sleep-powder", "acid", "stun-spore", "giga-drain"] }
      ]},
      { num: 5, leader: "Koga", city: "Fuchsia City", badge: "Soul Badge", team: [
        { name: "koffing", level: 37, ability: "Levitate", moves: ["sludge", "smokescreen", "toxic", "selfdestruct"] }, 
        { name: "muk", level: 39, ability: "Stench", moves: ["sludge", "minimize", "toxic", "acid-armor"] }, 
        { name: "koffing", level: 37, ability: "Levitate", moves: ["sludge", "smokescreen", "toxic", "selfdestruct"] }, 
        { name: "weezing", level: 43, item: "sitrus-berry", ability: "Levitate", moves: ["tackle", "sludge", "toxic", "explosion"] }
      ]},
      { num: 6, leader: "Sabrina", city: "Saffron City", badge: "Marsh Badge", team: [
        { name: "kadabra", level: 38, ability: "Synchronize", moves: ["psybeam", "reflect", "recover", "calm-mind"] }, 
        { name: "mr-mime", level: 37, ability: "Soundproof", moves: ["barrier", "psybeam", "baton-pass", "calm-mind"] }, 
        { name: "venomoth", level: 38, ability: "Shield Dust", moves: ["psybeam", "gust", "leech-life", "supersonic"] }, 
        { name: "alakazam", level: 43, item: "sitrus-berry", ability: "Synchronize", moves: ["psychic", "recover", "future-sight", "calm-mind"] }
      ]},
      { num: 7, leader: "Blaine", city: "Cinnabar Island", badge: "Volcano Badge", team: [
        { name: "growlithe", level: 42, ability: "Intimidate", moves: ["bite", "roar", "take-down", "fire-blast"] }, 
        { name: "ponyta", level: 40, ability: "Flash Fire", moves: ["bounce", "fire-spin", "stomp", "fire-blast"] }, 
        { name: "rapidash", level: 42, ability: "Flash Fire", moves: ["bounce", "fire-spin", "stomp", "fire-blast"] }, 
        { name: "arcanine", level: 47, item: "sitrus-berry", ability: "Intimidate", moves: ["bite", "roar", "take-down", "fire-blast"] }
      ]},
      { num: 8, leader: "Giovanni", city: "Viridian City", badge: "Earth Badge", team: [
        { name: "rhyhorn", level: 45, ability: "Lightning Rod", moves: ["rock-blast", "scary-face", "take-down", "earthquake"] }, 
        { name: "dugtrio", level: 42, ability: "Sand Veil", moves: ["sand-tomb", "slash", "mud-slap", "earthquake"] }, 
        { name: "nidoqueen", level: 44, ability: "Poison Point", moves: ["body-slam", "double-kick", "poison-sting", "earthquake"] }, 
        { name: "nidoking", level: 45, ability: "Poison Point", moves: ["thrash", "double-kick", "poison-sting", "earthquake"] }, 
        { name: "rhydon", level: 50, item: "sitrus-berry", ability: "Lightning Rod", moves: ["rock-blast", "scary-face", "take-down", "earthquake"] }
      ]}
    ],
    elite: [
      { leader: "Lorelei", title: "Elite Four", team: [
        { name: "dewgong", level: 52, ability: "Thick Fat", moves: ["surf", "ice-beam", "hail", "safeguard"] }, 
        { name: "cloyster", level: 51, ability: "Shell Armor", moves: ["spikes", "dive", "hail", "protect"] }, 
        { name: "slowbro", level: 52, ability: "Oblivious", moves: ["surf", "ice-beam", "yawn", "amnesia"] }, 
        { name: "jynx", level: 54, ability: "Oblivious", moves: ["lovely-kiss", "ice-punch", "attract", "double-slap"] }, 
        { name: "lapras", level: 54, item: "sitrus-berry", ability: "Water Absorb", moves: ["body-slam", "confuse-ray", "surf", "ice-beam"] }
      ]},
      { leader: "Bruno", title: "Elite Four", team: [
        { name: "onix", level: 53, ability: "Rock Head", moves: ["rock-tomb", "earthquake", "iron-tail", "roar"] }, 
        { name: "hitmonchan", level: 55, ability: "Keen Eye", moves: ["mach-punch", "rock-tomb", "sky-uppercut", "counter"] }, 
        { name: "hitmonlee", level: 55, ability: "Limber", moves: ["mega-kick", "facade", "brick-break", "foresight"] }, 
        { name: "onix", level: 53, ability: "Rock Head", moves: ["rock-tomb", "earthquake", "iron-tail", "double-edge"] }, 
        { name: "machamp", level: 58, item: "sitrus-berry", ability: "Guts", moves: ["cross-chop", "rock-tomb", "scary-face", "bulk-up"] }
      ]},
      { leader: "Agatha", title: "Elite Four", team: [
        { name: "gengar", level: 54, ability: "Levitate", moves: ["confuse-ray", "shadow-punch", "double-team", "toxic"] }, 
        { name: "golbat", level: 56, ability: "Inner Focus", moves: ["poison-fang", "confuse-ray", "air-cutter", "bite"] }, 
        { name: "haunter", level: 53, ability: "Levitate", moves: ["curse", "mean-look", "dream-eater", "hypnosis"] }, 
        { name: "arbok", level: 58, ability: "Intimidate", moves: ["bite", "sludge-bomb", "iron-tail", "screech"] }, 
        { name: "gengar", level: 60, item: "sitrus-berry", ability: "Levitate", moves: ["shadow-ball", "sludge-bomb", "nightmare", "hypnosis"] }
      ]},
      { leader: "Lance", title: "Elite Four", team: [
        { name: "gyarados", level: 58, ability: "Intimidate", moves: ["dragon-rage", "twister", "bite", "hyper-beam"] }, 
        { name: "dragonair", level: 56, ability: "Shed Skin", moves: ["outrage", "safeguard", "thunder-wave", "hyper-beam"] }, 
        { name: "dragonair", level: 56, ability: "Shed Skin", moves: ["outrage", "safeguard", "thunder-wave", "hyper-beam"] }, 
        { name: "aerodactyl", level: 60, ability: "Rock Head", moves: ["wing-attack", "ancient-power", "scary-face", "hyper-beam"] }, 
        { name: "dragonite", level: 62, item: "sitrus-berry", ability: "Inner Focus", moves: ["outrage", "wing-attack", "safeguard", "hyper-beam"] }
      ]}
    ],
    champion: { leader: "Blue", title: "Champion", team: [
      { name: "pidgeot", level: 61, ability: "Keen Eye", moves: ["aerial-ace", "feather-dance", "sand-attack", "whirlwind"] }, 
      { name: "alakazam", level: 59, ability: "Synchronize", moves: ["psychic", "reflect", "future-sight", "recover"] }, 
      { name: "rhydon", level: 61, ability: "Lightning Rod", moves: ["earthquake", "rock-tomb", "scary-face", "leer"] }, 
      { name: "exeggutor", level: 61, ability: "Chlorophyll", moves: ["giga-drain", "egg-bomb", "sleep-powder", "light-screen"] }, 
      { name: "gyarados", level: 63, ability: "Intimidate", moves: ["hydro-pump", "dragon-rage", "twister", "bite"] }, 
      { name: "charizard", level: 65, item: "sitrus-berry", ability: "Blaze", moves: ["fire-blast", "aerial-ace", "slash", "fire-spin"] }
    ]}
  },
  crystal: {
    gyms: [
      { num: 1, leader: "Falkner", city: "Violet City", badge: "Zephyr Badge", team: [
        { name: "pidgey", level: 7, ability: "Keen Eye", moves: ["tackle", "mud-slap"] }, 
        { name: "pidgeotto", level: 9, ability: "Keen Eye", moves: ["tackle", "mud-slap", "gust"] }
      ]},
      { num: 2, leader: "Bugsy", city: "Azalea Town", badge: "Hive Badge", team: [
        { name: "metapod", level: 14, ability: "Shed Skin", moves: ["tackle", "string-shot", "harden"] }, 
        { name: "kakuna", level: 14, ability: "Shed Skin", moves: ["poison-sting", "string-shot", "harden"] }, 
        { name: "scyther", level: 16, ability: "Swarm", moves: ["quick-attack", "leer", "fury-cutter"] }
      ]},
      { num: 3, leader: "Whitney", city: "Goldenrod City", badge: "Plain Badge", team: [
        { name: "clefairy", level: 18, ability: "Cute Charm", moves: ["encore", "double-slap", "mimic", "metronome"] }, 
        { name: "miltank", level: 20, item: "lum-berry", ability: "Thick Fat", moves: ["stomp", "attract", "milk-drink", "rollout"] }
      ]},
      { num: 4, leader: "Morty", city: "Ecruteak City", badge: "Fog Badge", team: [
        { name: "gastly", level: 21, ability: "Levitate", moves: ["lick", "spite", "mean-look", "curse"] }, 
        { name: "haunter", level: 21, ability: "Levitate", moves: ["hypnosis", "dream-eater", "curse", "night-shade"] }, 
        { name: "haunter", level: 23, ability: "Levitate", moves: ["hypnosis", "dream-eater", "curse", "night-shade"] }, 
        { name: "gengar", level: 25, ability: "Levitate", moves: ["hypnosis", "dream-eater", "shadow-ball", "mean-look"] }
      ]},
      { num: 5, leader: "Chuck", city: "Cianwood City", badge: "Storm Badge", team: [
        { name: "primeape", level: 27, ability: "Vital Spirit", moves: ["leer", "rage", "karate-chop", "dynamic-punch"] }, 
        { name: "poliwrath", level: 30, ability: "Water Absorb", moves: ["surf", "mind-reader", "hypnosis", "dynamic-punch"] }
      ]},
      { num: 6, leader: "Jasmine", city: "Olivine City", badge: "Mineral Badge", team: [
        { name: "magnemite", level: 30, ability: "Sturdy", moves: ["thunderbolt", "supersonic", "sonic-boom", "thunder-wave"] }, 
        { name: "magnemite", level: 30, ability: "Sturdy", moves: ["thunderbolt", "supersonic", "sonic-boom", "thunder-wave"] }, 
        { name: "steelix", level: 35, ability: "Rock Head", moves: ["screech", "sunny-day", "rock-throw", "iron-tail"] }
      ]},
      { num: 7, leader: "Pryce", city: "Mahogany Town", badge: "Glacier Badge", team: [
        { name: "seel", level: 27, ability: "Thick Fat", moves: ["headbutt", "icy-wind", "aurora-beam", "rest"] }, 
        { name: "dewgong", level: 29, ability: "Thick Fat", moves: ["headbutt", "icy-wind", "aurora-beam", "rest"] }, 
        { name: "piloswine", level: 31, ability: "Oblivious", moves: ["icy-wind", "fury-attack", "blizzard", "rest"] }
      ]},
      { num: 8, leader: "Clair", city: "Blackthorn City", badge: "Rising Badge", team: [
        { name: "dragonair", level: 37, ability: "Shed Skin", moves: ["thunder-wave", "surf", "slam", "dragon-breath"] }, 
        { name: "dragonair", level: 37, ability: "Shed Skin", moves: ["thunder-wave", "thunderbolt", "slam", "dragon-breath"] }, 
        { name: "dragonair", level: 37, ability: "Shed Skin", moves: ["thunder-wave", "ice-beam", "slam", "dragon-breath"] }, 
        { name: "kingdra", level: 40, item: "dragon-fang", ability: "Swift Swim", moves: ["smokescreen", "surf", "hyper-beam", "dragon-breath"] }
      ]}
    ],
    elite: [
      { leader: "Will", title: "Elite Four", team: [
        { name: "xatu", level: 40, ability: "Synchronize", moves: ["quick-attack", "future-sight", "confuse-ray", "psychic"] }, 
        { name: "jynx", level: 41, ability: "Oblivious", moves: ["double-slap", "ice-punch", "lovely-kiss", "psychic"] }, 
        { name: "exeggutor", level: 41, ability: "Chlorophyll", moves: ["reflect", "leech-seed", "egg-bomb", "psychic"] }, 
        { name: "slowbro", level: 41, ability: "Oblivious", moves: ["curse", "amnesia", "body-slam", "psychic"] }, 
        { name: "xatu", level: 42, ability: "Synchronize", moves: ["quick-attack", "future-sight", "confuse-ray", "psychic"] }
      ]},
      { leader: "Koga", title: "Elite Four", team: [
        { name: "ariados", level: 40, ability: "Swarm", moves: ["double-team", "spider-web", "baton-pass", "giga-drain"] }, 
        { name: "venomoth", level: 41, ability: "Shield Dust", moves: ["supersonic", "gust", "toxic", "psychic"] }, 
        { name: "forretress", level: 43, ability: "Sturdy", moves: ["protect", "swift", "explosion", "spikes"] }, 
        { name: "muk", level: 42, ability: "Stench", moves: ["minimize", "acid-armor", "toxic", "sludge-bomb"] }, 
        { name: "crobat", level: 44, ability: "Inner Focus", moves: ["double-team", "quick-attack", "wing-attack", "toxic"] }
      ]},
      { leader: "Bruno", title: "Elite Four", team: [
        { name: "hitmontop", level: 42, ability: "Intimidate", moves: ["pursuit", "quick-attack", "dig", "detect"] }, 
        { name: "hitmonlee", level: 42, ability: "Limber", moves: ["swagger", "double-kick", "hi-jump-kick", "foresight"] }, 
        { name: "hitmonchan", level: 42, ability: "Keen Eye", moves: ["thunder-punch", "ice-punch", "fire-punch", "mach-punch"] }, 
        { name: "onix", level: 43, ability: "Rock Head", moves: ["bind", "earthquake", "rock-slide", "sandstorm"] }, 
        { name: "machamp", level: 46, ability: "Guts", moves: ["rock-slide", "foresight", "vital-throw", "cross-chop"] }
      ]},
      { leader: "Karen", title: "Elite Four", team: [
        { name: "umbreon", level: 42, ability: "Synchronize", moves: ["sand-attack", "confuse-ray", "faint-attack", "mean-look"] }, 
        { name: "vileplume", level: 42, ability: "Chlorophyll", moves: ["stun-spore", "acid", "moonlight", "petal-dance"] }, 
        { name: "murkrow", level: 44, ability: "Insomnia", moves: ["quick-attack", "whirlwind", "pursuit", "faint-attack"] }, 
        { name: "gengar", level: 45, ability: "Levitate", moves: ["curse", "lick", "spite", "destiny-bond"] }, 
        { name: "houndoom", level: 47, ability: "Early Bird", moves: ["roar", "pursuit", "flamethrower", "crunch"] }
      ]}
    ],
    champion: { leader: "Lance", title: "Champion", team: [
      { name: "gyarados", level: 44, ability: "Intimidate", moves: ["flail", "rain-dance", "surf", "hyper-beam"] }, 
      { name: "dragonite", level: 47, ability: "Inner Focus", moves: ["thunder-wave", "twister", "thunder", "hyper-beam"] }, 
      { name: "dragonite", level: 47, ability: "Inner Focus", moves: ["thunder-wave", "twister", "blizzard", "hyper-beam"] }, 
      { name: "aerodactyl", level: 46, ability: "Rock Head", moves: ["wing-attack", "rock-slide", "ancient-power", "hyper-beam"] }, 
      { name: "charizard", level: 46, ability: "Blaze", moves: ["flamethrower", "wing-attack", "slash", "hyper-beam"] }, 
      { name: "dragonite", level: 50, item: "sitrus-berry", ability: "Inner Focus", moves: ["fire-blast", "safeguard", "outrage", "hyper-beam"] }
    ]},
    secret: { leader: "Red", title: "Pokemon Trainer", team: [
      { name: "pikachu", level: 81, item: "light-ball", ability: "Static", moves: ["charm", "quick-attack", "thunderbolt", "thunder"] }, 
      { name: "espeon", level: 73, ability: "Synchronize", moves: ["mud-slap", "reflect", "swift", "psychic"] }, 
      { name: "snorlax", level: 75, item: "leftovers", ability: "Thick Fat", moves: ["amnesia", "snore", "rest", "body-slam"] }, 
      { name: "venusaur", level: 77, ability: "Overgrow", moves: ["sunny-day", "giga-drain", "synthesis", "solar-beam"] }, 
      { name: "charizard", level: 77, ability: "Blaze", moves: ["flamethrower", "wing-attack", "slash", "fire-spin"] }, 
      { name: "blastoise", level: 77, ability: "Torrent", moves: ["rain-dance", "surf", "blizzard", "hydro-pump"] }
    ]}
  }
};
