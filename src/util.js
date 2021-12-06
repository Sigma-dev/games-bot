async function tryUpdate(channel, msg, newContent) {
    if (!msg) {
        return await channel.send(newContent);
    }
    if (msg.content != newContent) {
        return await msg.edit(newContent);
    }
    return msg;
}

function getRent(tile, roll) {
    if (tile.type == "property") {
        if (!tile.houseNb)
            return (tile.price / 10) - 4;
        if (tile.houseNb == 1)
            return (tile.price / 2) - 20;
        if (tile.houseNb == 2)
            return ((tile.price / 10) - 4) * 3;
        if (tile.houseNb == 3)
            return (((tile.price / 10) - 4) * 6 + 140) % 50 * 50;
        if (tile.houseNb == 4)
            return ((tile.price / 10) - 4) * 7 + 210;
    }
    if (tile.type == "service") {
        if (tile.owner.servicesOwned == 2)
            return roll * 10;
        else
            return roll * 4;
    }
    if (tile.type == "station") {
        if (tile.owner.stationsOwned == 4)
            return 200;
        else if (tile.owner.stationsOwned == 3)
            return 100;
        else if (tile.owner.stationsOwned == 2)
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


module.exports = { tryUpdate, getRandomInt, getRent, getHousePrice };