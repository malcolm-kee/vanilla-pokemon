(function app(helpers) {
  'use strict';

  var noop = helpers.noop;
  var ajax = helpers.ajax;
  var $ = helpers.$;
  var toggleClass = helpers.toggleClass;
  var removeClass = helpers.removeClass;

  var $loadPokemonBtn = $('#load-pokemon-btn');
  var $pokemonContainer = $('#pokemon-container');

  var getPokemons = (function() {
    var currentPage = 1;

    return function getPokemonsCall(options) {
      var limit = options.limit || 15;
      var onSuccess = options.onSuccess || noop;

      ajax(
        'https://pokemon-json.herokuapp.com/api/pokemons?_page=' + currentPage + '&_limit=' + limit,
        {
          onSuccess: function(res) {
            currentPage++;
            onSuccess(res);
          },
          onError: options.onError
        }
      );
    };
  })();

  function createPokemonEl(pokemon) {
    var tmpl = $('#pokemon-record');
    var $el = document.importNode(tmpl.content, true);

    $el.querySelector('.pokemon-name').textContent = `#${pokemon.id} ${pokemon.name}`;
    $el.querySelector('.pokemon-thumbnail').setAttribute('src', pokemon.thumbnail);

    $el.querySelector('.pokemon').dataset.pokemonId = pokemon.id;

    return $el;
  }

  function render(pokemons) {
    var $target = $('#pokemon-container');

    pokemons.forEach(function(pokemon) {
      var $pokemon = createPokemonEl(pokemon);
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
          $loadPokemonBtn.disabled = false;
        } else {
          $loadPokemonBtn.parentNode.removeChild($loadPokemonBtn);
        }
      }
    });
  }

  function createPokemonDetails(pokemon) {
    var tmpl = $('#pokemon-details');
    var $el = document.importNode(tmpl.content, true);

    $el.querySelector('.pokemon-image').setAttribute('src', pokemon.image);
    $el.querySelector('.pokemon-names').textContent =
      pokemon.name &&
      pokemon.name.english + ' | ' + pokemon.name.japanese + ' | ' + pokemon.name.chinese;
    $el.querySelector('.pokemon-types').textContent = pokemon.type.join(', ');
    $el.querySelector('.pokemon-hp').textContent = pokemon.base.HP;
    $el.querySelector('.pokemon-atk').textContent = pokemon.base.Attack;
    $el.querySelector('.pokemon-def').textContent = pokemon.base.Defense;
    $el.querySelector('.pokemon-sp-atk').textContent = pokemon.base['Sp. Attack'];
    $el.querySelector('.pokemon-sp-def').textContent = pokemon.base['Sp. Defense'];
    $el.querySelector('.pokemon-speed').textContent = pokemon.base.Speed;

    return $el;
  }

  function focusPokemon(pokemon) {
    var pokemonId = pokemon.pokemonId;
    var $pokemonDialog = $('#pokemon-dialog');
    toggleClass($pokemonDialog.querySelector('.loading-text'), 'is-shown');
    toggleClass($pokemonDialog, 'is-open');

    ajax('https://pokemon-json.herokuapp.com/api/pokedex/' + pokemonId, {
      onSuccess: function(pokemon) {
        var $details = createPokemonDetails(pokemon);
        $pokemonDialog.querySelector('.pokemon-details').appendChild($details);
        toggleClass($pokemonDialog.querySelector('.loading-text'), 'is-shown');
      }
    });
  }

  function unFocusPokemon() {
    toggleClass($('#pokemon-dialog'), 'is-open');
    $('#pokemon-dialog').querySelector('.pokemon-details').innerHTML = '';
  }

  function onPokemonClick(ev) {
    var target = ev.target;

    if (target.classList.contains('fav-icon')) {
      var $pokemon = target.closest('.pokemon');
      toggleClass($pokemon && $pokemon.querySelector('.fav-icon'), 'is-empty');
    } else {
      var $pokemon = target.closest('.pokemon');
      if ($pokemon) {
        focusPokemon($pokemon.dataset);
      }
    }
  }

  loadPokemons();

  $loadPokemonBtn.addEventListener('click', loadPokemons);
  $pokemonContainer.addEventListener('click', onPokemonClick);
  $('#pokemon-dialog .cancel-btn').addEventListener('click', unFocusPokemon);
  $('#like-all-btn').addEventListener('click', function likeAllPokemons() {
    var allFavIcons = document.querySelectorAll('.pokemon .fav-icon');

    for (var index = 0; index < allFavIcons.length; index++) {
      var favIcon = allFavIcons[index];
      removeClass(favIcon, 'is-empty');
    }
  });
})(utils);
