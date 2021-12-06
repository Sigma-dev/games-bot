const Discord = require("discord.js");
const { Intents } = require("discord.js");
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const Queue = require("./src/game.js").Queue;
const channels = ["monopoly"];
const Games = [require('./src/monopoly/monopoly.js')]
const currentGames = {};
var events = require('events');
var em = new events.EventEmitter();

/*
console.log(Games[0].name);
console.log(Games[0].constructor.name);
console.log(typeof(Games[0]));
console.log(Games[0].prototype);
*/
client.login("Nzk5MDUwMzg1OTU1MzU2NzUz.X_97qQ.xPxjggtu4Bx5yn3QV9-_8B1DY08");

client.on("ready", () => {
    console.log("Bot Started");
});

client.on("messageCreate", (message) => {
    if (channels.includes(message.channel.name) && message.content.startsWith("Start ") && !currentGames[message.channel.name]) {    
      tryCreate(message)
    }
    if (message.channel.name === "monopoly" && message.content === "s")
        new Queue(message.channel, em, 3);
});
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    let game = currentGames[interaction.message.channel.name];
    if (game)
        game.handleInteraction(interaction.customId, interaction.user.username);
    interaction.deferUpdate()
});

em.on('StartGame', function(data) {
    let game = Games.find(game => game.name.toLowerCase() == data.channel.name)
    currentGames[data.channel.name] = new game(data.channel, data.players);
    
});

function tryCreate(message){
    var time = parseInt(message.content.slice(6));
    if (time)
       var queue = new Queue(message.channel, em, time);
    else
        message.channel.send('Retry with a valid waiting period to continue');
}
