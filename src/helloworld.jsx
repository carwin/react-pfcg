var CharacterForm = React.createClass({
  getInitialState: function() {
    return {charName: '', charRace: ''};
  },
  handleCharNameChange: function(e) {
    this.setState({charName: e.target.value});
  },
  handleCharRaceChange: function(e) {
    this.setState({charRace: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.charName.trim();
    var race = this.state.charRace.trim();
    if (!name || !race) {
      return;
    }
    this.props.onCharacterSubmit({charName: name, charRace: race});
    this.setState({charName: '', charRace: ''});
  },
  render: function() {
    return(
      <form className="character_form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.charName}
          onChange={this.handleCharNameChange}
          className="character_form__field"
          id="character_name"
          placeholder="Character Name"
        />
        // @todo: Make this a select field.
        <input
          type="text"
          value={this.state.charRace}
          onChange={this.handleCharRaceChange}
          className="character_form__field"
          id="character_race"
          placeholder="Race"
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});


var ContentContainer = React.createClass({
  getInitialState: function() {
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
  handleCharacterSubmit: function(character) {
    var contentContainer = this;
    contentContainer.setState({charName: character.charName});
    contentContainer.setState({charRace: character.charRace});

    $.get('https://cdn.contentful.com/spaces/w9ovy2etwf4d/entries?access_token=3bc79bd452e58b482459ae5f9419685330742c2adfd394e0872f7b84a73fa9cc&content_type=race&fields.raceName='+character.charRace, function(data, status) {
      // We should have only one result for each race:

      // Set attributes: roll 4d6, remove lowest value, add.
      var rollTheDice = function() {
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

      }

      contentContainer.setState({strength: data.items[0].fields.strBonus + rollTheDice()});
      contentContainer.setState({dexterity: data.items[0].fields.dexBonus + rollTheDice()});
      contentContainer.setState({constitution: data.items[0].fields.conBonus + rollTheDice()});
      contentContainer.setState({wisdom: data.items[0].fields.wisBonus + rollTheDice()});
      contentContainer.setState({intelligence: data.items[0].fields.chaBonus + rollTheDice()});
      contentContainer.setState({charisma: data.items[0].fields.chaBonus + rollTheDice()});

    });



    console.log(this.state);
    // contentContainer.setState({charisma: contentContainer.state.chaMod + contentContainer.state.charisma});

  },
  render: function() {
    return(
    <main className="main">
      <h1>Character Priors & Particulars</h1>
      <CharacterForm onCharacterSubmit={this.handleCharacterSubmit} />
      <h2>{this.state.charName}</h2>
      <p><b>Strength:</b> {this.state.strength}</p>
      <p><b>Dexterity:</b> {this.state.dexterity}</p>
      <p><b>Constitution:</b> {this.state.constitution}</p>
      <p><b>Wisdom:</b> {this.state.wisdom}</p>
      <p><b>Intelligence:</b> {this.state.intelligence}</p>
      <p><b>Charisma:</b> {this.state.charisma}</p>
    </main>
    );
  }
});


ReactDOM.render(
//  React.createElement('h1', null, 'Hello, world!'),
  <ContentContainer />,
  document.getElementById('content')
);
