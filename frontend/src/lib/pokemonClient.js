import { PokemonClient } from 'pokenode-ts';

// Initialize the library
const client = new PokemonClient();

// We export a "clean" api object that avoids the "undefined" errors
export const api = {
  pokemon: client.pokemon,
  move: client.move,
  evolution: client.evolution,
  game: client.game,
  // Helper to bypass school filters for any sprite
  getSprite: (id, type = 'official') => {
    if (type === 'shiny') {
      return `/cdn-sprites/pokemon/other/official-artwork/shiny/${id}.png`;
    }
    if (type === 'icon') {
      return `/cdn-sprites/pokemon/versions/generation-viii/icons/${id}.png`;
    }
    return `/cdn-sprites/pokemon/other/official-artwork/${id}.png`;
  }
};