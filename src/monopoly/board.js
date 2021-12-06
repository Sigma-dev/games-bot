const {tryUpdate} = require('../util.js');
//const v = '⬛';
const v = '<:empty:917015632631975967>';
const tiles = require('./tiles.json');
//const tiles = tilesFile;

function get_emoji_at_pos(players, pos, nb) {
    let count = 0;

    for (let i = 0; i < players.length; i++)
        if (players[i].position == pos) {
            if (count == nb)
                return players[i].emoji;
            count++;
        }
}

function get_nb_at_pos(players, pos) {
    let res = 0;

    for (let i = 0; i < players.length; i++)
        if (players[i].position == pos)
            res += 1;
    return res;
}

async function update_top_line(channel, msg, players, line_h) {
    let start_pos = 20;
    let line = `${v.repeat(4)}`;
    for (let i = 0; i < 11; i++) {
        let nb = get_nb_at_pos(players, start_pos + i);
        let char = (nb > 3 - line_h) ? get_emoji_at_pos(players, start_pos + i, 3 - line_h) : `${v}`;
        line = line.concat(char);
    }
    return await tryUpdate(channel, msg, line);
}

async function new_update_middle_line(channel, msg, players, start_pos) {
    let line = '';
    let real = `${tiles[19 - start_pos ].emoji}${v.repeat(9)}${tiles[31 + start_pos].emoji}`//TAG
    let nb = get_nb_at_pos(players, 19 - start_pos);
    for (let i = 0; i < 4; i++) {
        let char = (nb > 3 - i) ? get_emoji_at_pos(players, 19 - start_pos, 3 - i) : `${v}`;
        line = line.concat(char);
    }
    line = line.concat(real);
    nb = get_nb_at_pos(players, 31 + start_pos);
    for (let i = 0; i < 4; i++) {
        let char = (nb > i) ? get_emoji_at_pos(players, 31 + start_pos , i) : `${v}`;
        line = line.concat(char);
    }
    return await tryUpdate(channel, msg, line);
}

async function update_bottom_line(channel, msg, players, line_h) {
    let start_pos = 10;
    let line = `${v.repeat(4)}`;
    for (let i = 0; i < 11; i++) {
        let nb = get_nb_at_pos(players, start_pos - i);
        let char = (nb > line_h) ? get_emoji_at_pos(players, start_pos - i, line_h) : `${v}`;
        line = line.concat(char);
    }
     return await tryUpdate(channel, msg, line);
}

async function print_static_top(channel) {
    let end = `${v.repeat(4)}`;
    for (let i = 20; i < 31; i++)
        end += tiles[i].emoji;
    end += `${v.repeat(4)}`;
    return await channel.send(end);
}

async function print_static_bottom(channel) {
    let end = `${v.repeat(4)}`;
    for (let i = 10; i >= 0; i--)
        end += tiles[i].emoji;
    end += `${v.repeat(4)}`;
    return await channel.send(end);
}

async function renderBoard(channel, board, players) {
    for (let i = 0; i < 4; i++)
         board[i] = await update_top_line(channel, board[i], players, i);
    if (!board[4])
        board[4] = await print_static_top(channel);
    for (let i = 0; i < 9; i++)
        board[5 + i] = await new_update_middle_line(channel, board[5 + i], players, i);
    if (!board[14])
        board[14] = await print_static_bottom(channel);
    for (let i = 0; i < 4; i++)
        board[15 + i] = await update_bottom_line(channel, board[15 + i], players, i);
}

module.exports = renderBoard;