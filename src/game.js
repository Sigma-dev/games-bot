const events = require('events');

class Game {
    onStart() { };

    constructor(channel, players) {
        this.channel = channel;
        this.players = players;
        this.playerNB = players.length;
        this.onStart();
    }

    handleInteraction(id, username){
        
    }
}

module.exports = Game;