var dice = ['<:d1:877512394887282708>', '<:d2:877512394862116875>', '<:d3:877512393507352627>', '<:d4:877512392915968060>', '<:d5:877512391401824257>', '<:d6:877512390659411968>']

async function tryUpdate(channel, msg, newContent) {
    if (!msg) {
        return await channel.send(newContent);
    }
    if (msg.content != newContent) {
        return await msg.edit(newContent);
    }
    return msg;
}

function getRent(tile, roll, groupsNbs) {
    if (!tile.owner)
        tile.owner = null;
    if (tile.type == "property") {
        let rent;
        if (!tile.houseNb)
            rent = (tile.price / 10) - 4;
        if (tile.houseNb == 1)
            rent = (tile.price / 2) - 20;
        if (tile.houseNb == 2)
            rent = ((tile.price / 10) - 4) * 3;
        if (tile.houseNb == 3)
            rent = (((tile.price / 10) - 4) * 6 + 140) / 50 * 50;
        if (tile.houseNb == 4)
            rent = ((tile.price / 10) - 4) * 7 + 210;
        return (tile.ownner && tile.owner.ownedGroups[tile.group] == groupsNbs[tile.group]) ? rent * 2 : rent;
    }
    if (tile.type == "service") {
        if (tile.owner && tile.owner.ownedGroups[tile.group] == 2)
            return roll * 10;
        else
            return roll * 4;
    }
    if (tile.type == "station") {
        if (!tile.owner)
            return 25;
        if (tile.owner.ownedGroups[tile.group] == 4)
            return 200;
        else if (tile.owner.ownedGroups[tile.group] == 3)
            return 100;
        else if (tile.owner.ownedGroups[tile.group] == 2)
            return 50;
        else
            return 25;
    }
}

function getHousePrice(tile) {
    if (tile.group == "brown" || tile.group == "blue")
        return 50;
    if (tile.group == "purple" || tile.group == "orange")
        return 100;
    if (tile.group == "red" || tile.group == "yellow")
        return 150;
    if (tile.group == "green" || tile.group == "white")
        return 200;
}

function getRentText(tile) {
    if (tile.type == 'property')
        return ''
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function get_groupNbs(tiles) {
    let res = {};
    tiles.forEach(tile => {
        if (tile.group) {
            if (!res[tile.group])
                res[tile.group] = 0;
            res[tile.group] += 1;
        }
    });
    return res;
}

module.exports = { tryUpdate, getRandomInt, getRent, getHousePrice, get_groupNbs, dice };