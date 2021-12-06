const { getHousePrice, getRent } = require('../util.js');
const { update_status, STATUS } = require('./status.js');

function monopolyInteraction(game, id, username) {
    let player = game.getPlayer();
    let tile = game.tiles[player.position];
    if (username != player.name)
        return;
    if (id == "dice" && game.status == STATUS.CAN_ROLL) {
        game.status = STATUS.NONE;
        game.throwDice(player);
    }
    if (id == "skip" && game.status != STATUS.CAN_ROLL) {
        game.status = STATUS.NONE;
        game.endTurn();
    }
    if (id == "buy" && game.status == STATUS.CAN_BUY) {
        if (tile.owner) {
            update_status(game.channel, game.status_msg, "".concat(tile.owner.emoji) + " already owns " + tile.name, STATUS.NONE);
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
                update_status(game.channel, game.status_msg, "".concat(player.emoji) + " succesfully bought " + tile.name + " for " + tile.price + "$, rent starts at " + getRent(tile) + "$", STATUS.NONE);
            else
                update_status(game.channel, game.status_msg, "".concat(player.emoji) + " succesfully bought " + tile.name + " for " + tile.price + "$, rent starts at 4 times the dice roll", STATUS.NONE);
        }
        else {
            update_status(game.channel, game.status_msg, "".concat(player.emoji) + " doesn't have the " + tile.price + "$ required to buy " + tile.name + "...", STATUS.CAN_SKIP);
        }
    }
    if (id == "house" && STATUS.CAN_BUY_HOUSE) {
        if (player.money >= getHousePrice(tile)) {
            if (!tile.houseNb)
                tile.houseNb = 0;
            tile.houseNb += 1;
            if (tile.houseNb < 4)
            update_status(game.channel, game.status_msg,"".concat(player.emoji) + " bought a house for " + getHousePrice(tile) + "$ on " + tile.name + " upping the rent to " + getRent(tile) + "$", STATUS.CAN_SKIP);
            else
            update_status(game.channel, game.status_msg,"".concat(player.emoji) + " bought a hotel for " + getHousePrice(tile) + "$ on " + tile.name + " upping the rent to " + getRent(tile) + "$", STATUS.CAN_SKIP);

        }
        else {
            update_status(game.channel, game.status_msg,"".concat(player.emoji) + " doesn't have the " + getHousePrice(tile) + "$ required to buy a house on" + tile.name + "...", STATUS.CAN_SKIP);
        }
    }
}

module.exports = monopolyInteraction;