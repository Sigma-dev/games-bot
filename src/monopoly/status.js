const { MessageButton, MessageActionRow } = require('discord.js');
const { tryUpdate } = require('../util.js');
const buttons = [new MessageButton()
    .setCustomId('dice')
    .setLabel('')
    .setStyle('PRIMARY')
    .setEmoji('🎲'),
new MessageButton()
    .setCustomId('buy')
    .setLabel('')
    .setStyle('PRIMARY')
    .setEmoji('🛒'),
new MessageButton()
    .setCustomId('house')
    .setLabel('')
    .setStyle('PRIMARY')
    .setEmoji('🏠'),
new MessageButton()
    .setCustomId('skip')
    .setLabel('')
    .setStyle('PRIMARY')
    .setEmoji('⏩'),
new MessageButton()
    .setCustomId('pay')
    .setLabel('')
    .setStyle('PRIMARY')
    .setEmoji('💸'),
new MessageButton()
    .setCustomId('free')
    .setLabel('')
    .setStyle('PRIMARY')
    .setEmoji('🏃')
]

const STATUS = {
    NONE:'none',
    CAN_ROLL:'canRoll',
    CAN_BUY:'canBuy',
    CAN_BUY_HOUSE:'canBuyHouse',
    CAN_SKIP:'canSkip',
    IN_JAIL:'inJail'
}

function getButton(id) {
    return buttons.find(button => button.customId === id);
}

async function update_status(channel, msg, txt, status) {
    let row;
    if (status == STATUS.NONE) 
        return await tryUpdate(channel, msg, txt);
    if (status == STATUS.CAN_ROLL) {
        row = new MessageActionRow().addComponents(
            //buttons[0]
            getButton('dice')
        );
    }
    if (status == STATUS.CAN_BUY) {
        row = new MessageActionRow().addComponents(
            getButton('buy'),
            getButton('skip')
        );
    }
    if (status == STATUS.CAN_BUY_HOUSE) {
        row = new MessageActionRow().addComponents(
            getButton('house'),
            getButton('skip')
        );
    }
    if (status == STATUS.CAN_SKIP) {
        row = new MessageActionRow().addComponents(
            getButton('skip')
        );
    }
    if (status == STATUS.IN_JAIL) {
        row = new MessageActionRow().addComponents(
            getButton('dice'),
            getButton('pay'),
            getButton('free'),
        );
    }
    return await tryUpdate(channel, msg, ({ content: txt, components: [row] }));
}

module.exports = { update_status, STATUS };