const { getRandomInt } = require('../util.js');
const {STATUS} = require('./status.js');

let chances = [
    {    text:"Go to the start (Collect 200$)", type:"to_start"},
    {    text:"Go back 3 spaces", type:"back_3"},
    {    text:"Get out of jail for free)", type:"free_jail"},
]

let chests = [
    {    text:"Go to the start (Collect 200$)", type:"to_start"},
    {    text:"Bank error, you get 200$", type:"bank_error"},
    {    text:"Get out of jail for free)", type:"free_jail"},
]

function handleChance(game, player) {
    let chance = chances[getRandomInt(0, chances.length)];

    if (chance.type == "to_start") {
        player.position = 0;
        player.money += 200;
        game.render();
        game.update_state("You drew: '" + chance.text + "'", STATUS.CAN_SKIP);
    }
    if (chance.type == "back_3") {
        player.position = (player.position - 3) % 40;
        game.render();
        game.update_state("You drew: '" + chance.text + "'", STATUS.CAN_SKIP);
    }
    if (chance.type == "free_jail") {
        if (!player.freeJail)
            player.freeJail = 0;            
        player.freeJail += 1;
        game.update_state("You drew: '" + chance.text + "'", STATUS.CAN_SKIP);
    }
}

function handleChest(game, player) {
    let chest = chances[getRandomInt(0, chests.length)];
    if (chest.type == "to_start") {
        player.position = 0;
        player.money += 200;
        game.render();
        game.update_state("You drew: '" + chest.text + "'", STATUS.CAN_SKIP);
    }
    if (chest.type == "bank_error") {
        player.money += 200;
        game.render();
        game.update_state("You drew: '" + chest.text + "'", STATUS.CAN_SKIP);
    }
    if (chest.type == "free_jail") {
        if (!player.freeJail)
            player.freeJail = 0;            
        player.freeJail += 1;
        game.update_state("You drew: '" + chest.text + "'", STATUS.CAN_SKIP);
    }
}

module.exports = { handleChance, handleChest }