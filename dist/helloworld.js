'use strict';

var CharacterForm = React.createClass({
  displayName: 'CharacterForm',

  getInitialState: function getInitialState() {
    return { charName: '', charRace: '' };
  },
  handleCharNameChange: function handleCharNameChange(e) {
    this.setState({ charName: e.target.value });
  },
  handleCharRaceChange: function handleCharRaceChange(e) {
    this.setState({ charRace: e.target.value });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var name = this.state.charName.trim();
    var race = this.state.charRace.trim();
    if (!name || !race) {
      return;
    }
    this.props.onCharacterSubmit({ charName: name, charRace: race });
    this.setState({ charName: '', charRace: '' });
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'character_form', onSubmit: this.handleSubmit },
      React.createElement('input', {
        type: 'text',
        value: this.state.charName,
        onChange: this.handleCharNameChange,
        className: 'character_form__field',
        id: 'character_name',
        placeholder: 'Character Name'
      }),
      '// @todo: Make this a select field.',
      React.createElement('input', {
        type: 'text',
        value: this.state.charRace,
        onChange: this.handleCharRaceChange,
        className: 'character_form__field',
        id: 'character_race',
        placeholder: 'Race'
      }),
      React.createElement('input', { type: 'submit', value: 'Post' })
    );
  }
});

var ContentContainer = React.createClass({
  displayName: 'ContentContainer',

  getInitialState: function getInitialState() {
    return {
      charName: '',
      charRace: '',
      strength: '',
      dexterity: '',
      constitution: '',
      wisdom: '',
      intelligence: '',
      charisma: ''
    };
  },
  handleCharacterSubmit: function handleCharacterSubmit(character) {
    var contentContainer = this;
    contentContainer.setState({ charName: character.charName });
    contentContainer.setState({ charRace: character.charRace });

    $.get('https://cdn.contentful.com/spaces/w9ovy2etwf4d/entries?access_token=3bc79bd452e58b482459ae5f9419685330742c2adfd394e0872f7b84a73fa9cc&content_type=race&fields.raceName=' + character.charRace, function (data, status) {
      // We should have only one result for each race:

      // Set attributes: roll 4d6, remove lowest value, add.
      var rollTheDice = function rollTheDice() {
        var die1 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        var die2 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        var die3 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        var die4 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

        var attrRolls = [die1, die2, die3, die4];
        var lowestRoll = Math.min.apply(null, attrRolls);
        attrRolls.splice(attrRolls.indexOf(lowestRoll), 1);

        var total = 0;

        for (var i = 0; i < attrRolls.length; i++) {
          total = attrRolls[i] + total;
        }

        return total;
      };

      contentContainer.setState({ strength: data.items[0].fields.strBonus + rollTheDice() });
      contentContainer.setState({ dexterity: data.items[0].fields.dexBonus + rollTheDice() });
      contentContainer.setState({ constitution: data.items[0].fields.conBonus + rollTheDice() });
      contentContainer.setState({ wisdom: data.items[0].fields.wisBonus + rollTheDice() });
      contentContainer.setState({ intelligence: data.items[0].fields.chaBonus + rollTheDice() });
      contentContainer.setState({ charisma: data.items[0].fields.chaBonus + rollTheDice() });
    });

    console.log(this.state);
    // contentContainer.setState({charisma: contentContainer.state.chaMod + contentContainer.state.charisma});
  },
  render: function render() {
    return React.createElement(
      'main',
      { className: 'main' },
      React.createElement(
        'h1',
        null,
        'Character Priors & Particulars'
      ),
      React.createElement(CharacterForm, { onCharacterSubmit: this.handleCharacterSubmit }),
      React.createElement(
        'h2',
        null,
        this.state.charName,
        ' the ',
        this.state.charRace
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Strength:'
        ),
        ' ',
        this.state.strength
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Dexterity:'
        ),
        ' ',
        this.state.dexterity
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Constitution:'
        ),
        ' ',
        this.state.constitution
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Wisdom:'
        ),
        ' ',
        this.state.wisdom
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Intelligence:'
        ),
        ' ',
        this.state.intelligence
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Charisma:'
        ),
        ' ',
        this.state.charisma
      )
    );
  }
});

ReactDOM.render(
//  React.createElement('h1', null, 'Hello, world!'),
React.createElement(ContentContainer, null), document.getElementById('content'));
//# sourceMappingURL=helloworld.js.map
