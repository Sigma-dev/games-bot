const { getRent, getHousePrice } = require('../util.js');
const { update_status, STATUS } = require('./status.js');

function get_groupNbs(tiles) {
    let res = {};
    tiles.forEach(tile => {
        if (tile.group) {
            if (!res[tile.group])
                res[tile.group] = 0;
            res[tile.group] += 1;
        }
    });
    console.log(res);
    return res;
}
function isBuyable(type) {
    return (type == "property" || type == "station" || type == "service")
}

function handleTile(tiles, game, player, roll) {
    let tile = tiles[player.position];
    let groupNbs = get_groupNbs(tiles);

    if (isBuyable(tile.type)) {
        if (!tile.owner) {
            update_status(game.channel, game.status_msg, "".concat(player.emoji) + " can try to buy " + tile.name + " for " + tile.price + '$ with his ' + player.money + '$', STATUS.CAN_BUY);
            game.status = STATUS.CAN_BUY;
        }
        else if (tile.owner != player) {
            if (player.money < getRent(tile)) {
                tryToPay(tiles, game, player, roll);
            }
            else {
                player.money -= getRent(tile, roll);
                update_status(game.channel, game.status_msg, "".concat(player.emoji) + " arrived on " + tile.name + " and paid the " + getRent(tile, roll) + '$ rent to ' + "".concat(tile.owner.emoji) + ', leaving him with ' + player.money + '$', STATUS.NONE);
            }
        }
        else {
            if (tile.type === "property")
                if (player.ownedGroups[tile.group] === groupNbs[tile]) {
                    if (!tile.houseNb)
                        tile.houseNb = 0;
                    if (tile.houseNb < 4)
                        update_status(game.channel, game.status_msg, "".concat(player.emoji) + " arrived on " + tile.name + " with " + tile.houseNb + "houses and can buy an additionnal house for " + getHousePrice(tile) + "$" , STATUS.CAN_BUY_HOUSE);
                    else if (tile.houseNb == 4) 
                        update_status(game.channel, game.status_msg, "".concat(player.emoji) + " arrived on " + tile.name + " with " + tile.houseNb + "houses and can buy a hotel for " + getHousePrice(tile) + "$" , STATUS.CAN_BUY_HOUSE);
                    else
                    update_status(game.channel, game.status_msg, "".concat(player.emoji) + " arrived on " + tile.name + " with a hotel and a rent of" + getRent(tile) + "$" , STATUS.NONE);
                }
                else {
                    update_status(game.channel, game.status_msg, "".concat(player.emoji) + " arrived on " + tile.name + " that he owns that has a rent of" + getRent(tile) + "$" , STATUS.NONE);
                }
        }
    }
    else {
        update_status(game.channel, game.status_msg, "Sorry " + "".concat(player.emoji) + "but the dev didn't do his job for that tile...", STATUS.CAN_SKIP);
        game.status = STATUS.CAN_SKIP;

    }


}

function tryToPay(tiles, game, player, roll) {
    let tile = tiles[player.position];
    let toPay = getRent(tile, roll);
    let str = "";

    let pos = 0;
    while (player.money < toPay || pos == 40) {
        if (tiles[pos].owner == player) {
            if (!tile.houseNb)
                tile.houseNb = 0;
            let housesMoney = tile.houseNb * (getHousePrice(tile) / 2);
            let tileMoney = tile.price / 2;
            player.money += housesMoney + tileMoney;
            str += tile.name + " for " + (housesMoney + tileMoney) + "$,"
        }
        pos++;
    }
    if (player.money >= toPay) {
        player.money -= toPay;
        tile.owner.money += toPay;
        update_status(game.channel, game.status_msg, "".concat(player.emoji) + " sold " + str + " to pay the " + toPay + "$ rent, leaving him with " + player.money + "$", STATUS.CAN_SKIP);
    }
    else {
        update_status(game.channel, game.status_msg, "".concat(player.emoji) + " arrived on " + tile.name + " and cannot pay the " + getRent(tile, roll) + '$ even after selling all his properties with his ' + player.money + '$, he is now out of the game)', STATUS.CAN_SKIP);
        player.lost = true;
    }
}

module.exports = { handleTile };