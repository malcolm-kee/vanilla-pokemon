(function app() {
  'use strict';

  function noop() {}

  function ajax(url, options) {
    var opts = options || {};
    var onSuccess = opts.onSuccess || noop;
    var onError = opts.onError || noop;
    var dataType = opts.dataType || 'json';
    var method = opts.method || 'GET';

    var request = new XMLHttpRequest();
    request.open(method, url);
    if (dataType === 'json') {
      request.overrideMimeType('application/json');
      request.responseType = 'json';
      request.setRequestHeader('Accept', 'application/json');
    }

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        onSuccess(request.response);
      } else {
        onError(request.response);
      }
    };

    request.onerror = onError;

    request.send(opts.body);
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function toggleClass($el, className) {
    $el && $el.classList.toggle(className);
  }

  var currentPage = 1;
  var $loadPokemonBtn = $('#load-pokemon-btn');
  var $pokemonContainer = $('#pokemon-container');

  function getPokemons(options) {
    const page = options.page || currentPage;
    const limit = options.limit || 15;

    ajax('https://pokemon-json.herokuapp.com/api/pokemons?_page=' + page + '&_limit=' + limit, {
      onSuccess: options.onSuccess,
      onError: options.onError
    });
  }

  function createPokemonEl(pokemon) {
    const tmpl = $('#pokemon-record');
    const $el = document.importNode(tmpl.content, true);

    $el.querySelector('.pokemon-name').textContent = `#${pokemon.id} ${pokemon.name}`;
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
    getPokemons({
      onSuccess: function(pokemons) {
        render(pokemons);

        if (pokemons.length > 0) {
          currentPage++;
          $loadPokemonBtn.disabled = false;
        } else {
          $loadPokemonBtn.parentNode.removeChild($loadPokemonBtn);
        }
      }
    });
  }

  function onPokemonClick(ev) {
    const $pokemon = ev.target.closest('.pokemon');

    toggleClass($pokemon && $pokemon.querySelector('.fav-icon'), 'is-empty');
  }

  loadPokemons();

  $loadPokemonBtn.addEventListener('click', loadPokemons);
  $pokemonContainer.addEventListener('click', onPokemonClick);
})();
