const { handleChance, handleChest } = require('../chance_chest.js');
const { getRent, getHousePrice, get_groupNbs } = require('../util.js');
const { STATUS } = require('./status.js');

function isBuyable(type) {
    return (type == "property" || type == "station" || type == "service")
}

function handleTile(tiles, game, player, roll) {
    let tile = tiles[player.position];
    let groupNbs = get_groupNbs(tiles);
    let rent = getRent(tile, roll, groupNbs);

    if (isBuyable(tile.type)) {
        if (!tile.owner) {
            game.update_state("".concat(player.emoji) + " can try to buy " + tile.name + " for " + tile.price + '$ with his ' + player.money + '$', STATUS.CAN_BUY);
            game.status = STATUS.CAN_BUY;
        }
        else if (tile.owner != player) {
            if (player.money < rent) {
                tryToPay(tiles, game, player, rent);
            }
            else {
                player.money -= rent;
                tile.owner.money += rent;
                game.update_state("".concat(player.emoji) + " landed on " + tile.name + " and paid the " + rent + '$ rent to ' + "".concat(tile.owner.emoji) + ', leaving him with ' + player.money + '$', STATUS.NONE);
            }
        }
        else {
            if (tile.type === "property")
                if (player.ownedGroups[tile.group] === groupNbs[tile]) {
                    if (!tile.houseNb)
                        tile.houseNb = 0;
                    if (tile.houseNb < 4)
                        game.update_state("".concat(player.emoji) + " landed on " + tile.name + " with " + tile.houseNb + "houses and can buy an additionnal house for " + getHousePrice(tile) + "$" , STATUS.CAN_BUY_HOUSE);
                    else if (tile.houseNb == 4) 
                        game.update_state("".concat(player.emoji) + " landed on " + tile.name + " with " + tile.houseNb + "houses and can buy a hotel for " + getHousePrice(tile) + "$" , STATUS.CAN_BUY_HOUSE);
                    else
                    game.update_state("".concat(player.emoji) + " landed on " + tile.name + " with a hotel and a rent of" + rent + "$" , STATUS.NONE);
                }
                else {
                    game.update_state("".concat(player.emoji) + " landed on " + tile.name + " that he owns that has a rent of " + rent + "$" , STATUS.NONE);
                }
        }
    }
    else if (tile.type === "tax") {
        let cost = 100;

        if (player.money < cost) {
                tryToPay(tiles, game, player, cost);
        }
        else {
            player.money -= cost;
            game.bank += cost;
            game.update_state("".concat(player.emoji) + " landed on " + tile.name + " and paid a tax of " + cost + "$ to the bank" , STATUS.CAN_SKIP);
        }
    }
    else if (tile.type === "parking") {
        if (!game.bank)
            game.bank = 0;
        if (game.bank == 0)
            game.update_state("".concat(player.emoji) + " landed on the" + tile.name + "but there was no money to be won..." , STATUS.CAN_SKIP);
        else {
            game.update_state("".concat(player.emoji) + " landed on the" + tile.name + "and won " + game.bank + "$, leaving him with " + player.money + "$" , STATUS.CAN_SKIP);
            player.money += game.bank;
            game.bank = 0;
        
        }
    }
    else if (tile.type === "chance") {
        handleChance(game, player);
    }
    else if (tile.type === "chest") {
        handleChest(game, player);
    }
    else if (tile.type === "police") {
        player.position = 10;
        player.jailed = 3;
        game.render();
        game.update_state("".concat(playeR.emoji) + "got himself in prison", STATUS.CAN_SKIP)
    }
    else {
        game.update_state("Sorry " + "".concat(player.emoji) + "but the dev didn't do his job for that tile...", STATUS.CAN_SKIP);
        game.status = STATUS.CAN_SKIP;

    }


}

function tryToPay(tiles, game, player, rent) {
    let tile = tiles[player.position];
    let str = "";

    let pos = 0;
    while (player.money < rent || pos == 40) {
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
    if (player.money >= rent) {
        player.money -= rent;
        tile.owner.money += rent;
        game.update_state("".concat(player.emoji) + "landed on" + tile.name + "with not enough money and sold " + str + " to pay the " + rent + "$ rent, leaving him with " + player.money + "$", STATUS.CAN_SKIP);
    }
    else {
        game.update_state("".concat(player.emoji) + " landed on " + tile.name + " and cannot pay the " + rent + '$ even after selling all his properties with his ' + player.money + '$, he is now out of the game)', STATUS.CAN_SKIP);
        player.lost = true;
    }
}

module.exports = { handleTile };