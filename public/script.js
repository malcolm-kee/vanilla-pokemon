(function app() {
  'use strict';

  function $(selector) {
    return document.querySelector(selector);
  }

  var currentPage = 1;
  var $loadPokemonBtn = $('#load-pokemon-btn');

  function getPokemons(page = currentPage, limit = 15) {
    return fetch(
      `https://pokemon-json.herokuapp.com/api/pokedex?_page=${page}&_limit=${limit}`
    ).then(function(res) {
      if (res.ok) {
        return res.json();
      }
      throw res.body;
    });
  }

  function createPokemonEl(pokemon) {
    const tmpl = $('#pokemon-record');
    const $el = document.importNode(tmpl.content, true);

    $el.querySelector('.pokemon-name').textContent = `#${pokemon.id} ${pokemon.name.english}`;
    $el.querySelector('.pokemon-thumbnail').setAttribute('src', pokemon.thumbnail);

    return $el;
  }

  function render(pokemons) {
    const $target = $('#pokemon-container');

    pokemons.forEach(function(pokemon) {
      const $pokemon = createPokemonEl(pokemon);
      $target.appendChild($pokemon);
    });

    return pokemons;
  }

  function loadPokemons() {
    $loadPokemonBtn.disabled = true;
    getPokemons()
      .then(render)
      .then(function(pokemons) {
        if (pokemons.length > 0) {
          currentPage++;
          $loadPokemonBtn.disabled = false;
        } else {
          $loadPokemonBtn.parentNode.removeChild($loadPokemonBtn);
        }
      });
  }

  $loadPokemonBtn.addEventListener('click', loadPokemons);
  loadPokemons();
})();
