const Game = require('../game.js').Game;
const renderBoard = require('./board.js');
const { update_status, STATUS } = require('./status.js');
const { tryUpdate, getRandomInt } = require('../util.js');
const { handleTile } = require('./tile.js');
const monopolyInteraction = require('./interaction.js');

class Monopoly extends Game {
    async onStart() {
        this.tiles = require('./tiles.json');
        this.players = this.players.map(obj => ({ ...obj, position: 0, money: 1500 }));
        this.board = [];
        let playerNames = "";
        this.players.forEach(player => playerNames = playerNames.concat(" " + player.name + " ").concat(player.emoji));
        await this.channel.send("Game Started. Participants in Order:" + playerNames);
        this.turnIndex = 0;
        await this.render();
        this.startTurn();
    }

    async startTurn() {
        let currentPlayer = this.getPlayer();
        if (currentPlayer.jailed) {
            await this.update_state("".concat(currentPlayer.emoji) + " is in prison, they can either try to get a double, pay 200$, or use a get out of jail card if they have one...", STATUS.IN_JAIL);
        }
        if (!this.rollAgain)
            this.status_msg = await this.update_state("".concat(currentPlayer.emoji) + " can throw the dice", STATUS.CAN_ROLL);
        else
            this.dice_msg = await this.update_state("".concat(player.emoji) + " rolled a double and can throw the dice again", STATUS.CAN_ROLL);
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

    async render() {
        await renderBoard(this.channel, this.board, this.players);
    }

    async update_state(str, status) {
        this.status = status;
        await update_status(this.channel, this.status_msg, str , status);
    }
}

module.exports = Monopoly;