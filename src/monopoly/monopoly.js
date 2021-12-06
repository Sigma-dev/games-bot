const Game = require('../game.js').Game;
const renderBoard = require('./board.js');
const { update_status, STATUS } = require('./status.js');
const { tryUpdate, getRandomInt, getRent } = require('../util.js');
const { handleTile } = require('./tile.js');
const monopolyInteraction = require('./interaction.js');
var dice = ['<:d1:877512394887282708>', '<:d2:877512394862116875>', '<:d3:877512393507352627>', '<:d4:877512392915968060>', '<:d5:877512391401824257>', '<:d6:877512390659411968>']


class Monopoly extends Game {
    async onStart() {
        this.tiles = require('./tiles.json');
        this.players = this.players.map(obj => ({ ...obj, position: 0, money: 1500 }));
        this.board = [];
        let playerNames = "";
        this.players.forEach(player => playerNames = playerNames.concat(" " + player.name + " ").concat(player.emoji));
        await this.channel.send("Game Started. Participants in Order:" + playerNames);
        this.turnIndex = 0;
        await renderBoard(this.channel, this.board, this.players);
        this.startTurn();
    }

    async startTurn() {
        let currentPlayer = this.getPlayer();
        if (!this.rollAgain)
            this.status_msg = await update_status(this.channel, this.status_msg, "".concat(currentPlayer.emoji) + " can throw the dice", STATUS.CAN_ROLL);
        else
            this.dice_msg = await update_status(this.channel, this.status_msg, "".concat(player.emoji) + " rolled a double and can throw the dice again", STATUS.CAN_ROLL);
    }

    async endTurn() {
        let currentPlayer = this.getPlayer();
        if (currentPlayer.lost) {
            let index = this.players.indexOf(currentPlayer);
            this.players.splice(index, 1);
        }
        else if (!this.rollAgain)
            this.turnIndex = (this.turnIndex + 1) % this.players.length;

        this.startTurn();
    }

    handleInteraction(id, username) {
        monopolyInteraction(this, id, username);
    }


    async throwDice(player) {
        let d1 = getRandomInt(6) + 1;
        let d2 = getRandomInt(6) + 1;

        this.dice_msg = await tryUpdate(this.channel, this.dice_msg, dice[d1 - 1] + dice[d2 - 1]);
        player.position = (player.position + (d1 + d2)) % 40;
        await renderBoard(this.channel, this.board, this.players);
        if (d1 == d2)
            this.rollAgain += 1;
        else
            this.rollAgain = 0;
        handleTile(this.tiles, this, player, d1 + d2);
    }

    getPlayer() {
        return this.players[this.turnIndex];
    }
}

module.exports = Monopoly;