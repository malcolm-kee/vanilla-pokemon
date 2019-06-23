(function characterApp(helpers) {
  'use strict';

  var ajax = helpers.ajax;
  var $ = helpers.$;
  var addClass = helpers.addClass;
  var removeClass = helpers.removeClass;
  var remove = helpers.remove;

  function createCharacterEl(character) {
    var tmpl = $('#character-record');
    var $el = document.importNode(tmpl.content, true);

    $el.querySelector('.character-name').textContent = character.name;
    $el.querySelector('.character-image').setAttribute('src', character.image);
    $el.querySelector('.character').dataset.characterId = character.id;

    return $el;
  }

  function renderCharacter(character) {
    $('#character-container').appendChild(createCharacterEl(character));
  }

  function createCharacter(character, onSuccess) {
    ajax('https://pokemon-json.herokuapp.com/api/characters', {
      method: 'POST',
      body: JSON.stringify(character),
      onSuccess: onSuccess
    });
  }

  function updateCharacter(character, onSuccess) {
    ajax('https://pokemon-json.herokuapp.com/api/characters/' + character.id, {
      method: 'PUT',
      body: JSON.stringify(character),
      onSuccess: onSuccess
    });
  }

  function resetForm() {
    $('#character-form .title').textContent = 'Create Character';
    $('#character-form #characterId').value = '';
    $('#character-form #characterName').value = '';
    $('#character-form #characterImage').value = '';
    $('#character-form button[type="submit"]').disabled = false;
    $('#character-form button[type="submit"]').textContent = 'Create';
  }

  function handleReset() {
    resetForm();
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    var $form = ev.target;
    var $name = $('#characterName');
    var $image = $('#characterImage');
    var $id = $('#characterId');
    var $submitBtn = $form.querySelector('button[type="submit"]');
    $submitBtn.disabled = true;

    var character = {
      id: $id.value,
      name: $name.value,
      image: $image.value
    };

    if (character.id) {
      updateCharacter(character, function onSuccess() {
        resetForm();
        loadCharacters();
      });
    } else {
      createCharacter(character, function onSuccess(newCharacter) {
        renderCharacter(newCharacter);
        resetForm();
      });
    }
  }

  function editCharacter(character) {
    ajax('https://pokemon-json.herokuapp.com/api/characters/' + character.characterId, {
      onSuccess: function(character) {
        $('#characterName').value = character.name;
        $('#characterImage').value = character.image;
        $('#characterId').value = character.id;
        $('#character-form .title').textContent = 'Edit Character';
        $('#character-form button[type="submit"]').textContent = 'Save';

        $('#characterName').focus();
      }
    });
  }

  function onCharacterClick(ev) {
    var target = ev.target;

    var $character = target.closest('.character');
    if ($character) {
      editCharacter($character.dataset);
    }
  }

  function loadCharacters() {
    var target = $('#character-container');

    addClass(target.querySelector('.loading-text'), 'is-shown');
    remove(target.querySelectorAll('.character'));

    ajax('https://pokemon-json.herokuapp.com/api/characters', {
      onSuccess: function(characters) {
        characters.forEach(renderCharacter);
        removeClass(target.querySelector('.loading-text'), 'is-shown');
      }
    });
  }

  loadCharacters();
  $('#character-form').addEventListener('submit', handleFormSubmit);
  $('#character-form').addEventListener('reset', handleReset);
  $('#character-container').addEventListener('click', onCharacterClick);
})(utils);
