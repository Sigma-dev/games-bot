const { getHousePrice, getRent, get_groupNbs, dice } = require('../util.js');
const { STATUS, update_status } = require('./status.js');
const { handleTile } = require('./tile.js');

function monopolyInteraction(game, id, username) {
    let groupNbs = get_groupNbs(game.tiles);
    let player = game.getPlayer();
    let tile = game.tiles[player.position];
    if (username != player.name)
        return;
    if (id == "dice" && game.status == STATUS.CAN_ROLL) {
        game.status = STATUS.CAN_SKIP;
        game.throwDice(player);
    }
    if (id == "skip" && game.status != STATUS.CAN_ROLL) {
        game.status = STATUS.CAN_SKIP;
        game.endTurn();
    }
    if (id == "buy" && game.status == STATUS.CAN_BUY) {
        if (tile.owner) {
            this.update_state("".concat(tile.owner.emoji) + " already owns " + tile.name, STATUS.CAN_SKIP);
            return;
        }
        if (player.money >= tile.price) {
            player.money -= tile.price;
            tile.owner = player;
            if (!player.ownedGroups)
                player.ownedGroups = {};
            if (!player.ownedGroups[tile.group])
                player.ownedGroups[tile.group] = 0;
            player.ownedGroups[tile.group] += 1;
            if (tile.type == 'station')
                player.stationsOwned += 1;
            if (tile.type == 'service')
                player.servicesOwned += 1;
            if (tile.type != 'service')
                game.update_state("".concat(player.emoji) + " succesfully bought " + tile.name + " for " + tile.price + "$, rent starts at " + getRent(tile, 0, groupNbs) + "$", STATUS.CAN_SKIP);
            else
                game.update_state("".concat(player.emoji) + " succesfully bought " + tile.name + " for " + tile.price + "$, rent starts at 4 times the dice roll", STATUS.CAN_SKIP);
        }
        else {
            game.update_state("".concat(player.emoji) + " doesn't have the " + tile.price + "$ required to buy " + tile.name + "...", STATUS.CAN_SKIP);
        }
    }
    if (id == "house" && game.status == STATUS.CAN_BUY_HOUSE) {
        if (player.money >= getHousePrice(tile)) {
            if (!tile.houseNb)
                tile.houseNb = 0;
            tile.houseNb += 1;
            if (tile.houseNb < 4)
                game.update_state("".concat(player.emoji) + " bought a house for " + getHousePrice(tile) + "$ on " + tile.name + " upping the rent to " + getRent(tile, 0, groupNbs) + "$", STATUS.CAN_SKIP);
            else
                game.update_state("".concat(player.emoji) + " bought a hotel for " + getHousePrice(tile) + "$ on " + tile.name + " upping the rent to " + getRent(tile, 0, groupNbs) + "$", STATUS.CAN_SKIP);
        }
        else {
            game.update_state("".concat(player.emoji) + " doesn't have the " + getHousePrice(tile) + "$ required to buy a house on" + tile.name + "...", STATUS.CAN_SKIP);
        }
    }
    if (game.status == STATUS.IN_JAIL) {
        if (id == "dice") {
            let d1 = getRandomInt(6) + 1;
            let d2 = getRandomInt(6) + 1;

            this.dice_msg = tryUpdate(this.channel, this.dice_msg, dice[d1 - 1] + dice[d2 - 1]);
            if (d1 == d2) {
                player.position = (player.position + d1 + d2) % 40;
                handleTile(games.tiles, game, player, d1 + d2);
            }
            else {
                game.update_state("".concat(player.emoji) + " didn't get a double...", STATUS.CAN_SKIP);
            }
        }
        if (id == "pay") {
            if (player.money >= 200) {
                player.money -= 200;
                game.update_state("".concat(player.emoji) + " paid 200$ to get out of jail", STATUS.CAN_SKIP);
            }
            else {
                game.update_state("".concat(player.emoji) + " doesn't have 200$ bucks (loser)", STATUS.IN_JAIL);
            }
        }
        if (id == "free") {
            if (player.freeJail) {
                player.freeJail -= 1;
                game.update_state("".concat(player.emoji) + " used his out of jail card to get out", STATUS.CAN_SKIP);
            }
            else {
                game.update_state("".concat(player.emoji) + " doesn't have a get out of jail card to get out...", STATUS.IN_JAIL);
            }
        }
    }
}

module.exports = monopolyInteraction;