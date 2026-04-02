// frontend/src/data/typeData.js

export const TYPE_COLOR = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705898",
  steel: "#B7B7CE", fairy: "#D685AD"
};

export const TYPE_CHART = {
  normal: { weak_to: ["fighting"], resists: [], immune_to: ["ghost"] },
  fire: { weak_to: ["water", "ground", "rock"], resists: ["fire", "grass", "ice", "bug", "steel", "fairy"], immune_to: [] },
  water: { weak_to: ["electric", "grass"], resists: ["fire", "water", "ice", "steel"], immune_to: [] },
  electric: { weak_to: ["ground"], resists: ["electric", "flying", "steel"], immune_to: [] },
  grass: { weak_to: ["fire", "ice", "poison", "flying", "bug"], resists: ["water", "electric", "grass", "ground"], immune_to: [] },
  ice: { weak_to: ["fire", "fighting", "rock", "steel"], resists: ["ice"], immune_to: [] },
  fighting: { weak_to: ["flying", "psychic", "fairy"], resists: ["bug", "rock", "dark"], immune_to: [] },
  poison: { weak_to: ["ground", "psychic"], resists: ["grass", "fighting", "poison", "bug", "fairy"], immune_to: [] },
  ground: { weak_to: ["water", "grass", "ice"], resists: ["poison", "rock"], immune_to: ["electric"] },
  flying: { weak_to: ["electric", "ice", "rock"], resists: ["grass", "fighting", "bug"], immune_to: ["ground"] },
  psychic: { weak_to: ["bug", "ghost", "dark"], resists: ["fighting", "psychic"], immune_to: [] },
  bug: { weak_to: ["fire", "flying", "rock"], resists: ["grass", "fighting", "ground"], immune_to: [] },
  rock: { weak_to: ["water", "grass", "fighting", "ground", "steel"], resists: ["normal", "fire", "poison", "flying"], immune_to: [] },
  ghost: { weak_to: ["ghost", "dark"], resists: ["poison", "bug"], immune_to: ["normal", "fighting"] },
  dragon: { weak_to: ["ice", "dragon", "fairy"], resists: ["fire", "water", "electric", "grass"], immune_to: [] },
  dark: { weak_to: ["fighting", "bug", "fairy"], resists: ["ghost", "dark"], immune_to: ["psychic"] },
  steel: { weak_to: ["fire", "fighting", "ground"], resists: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"], immune_to: ["poison"] },
  fairy: { weak_to: ["poison", "steel"], resists: ["fighting", "bug", "dark"], immune_to: ["dragon"] }
};
