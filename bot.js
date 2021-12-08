const Discord = require("discord.js");
const { Intents } = require("discord.js");
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const Queue = require("./src/game.js").Queue;
const channels = ["monopoly"];
const Games = [require('./src/monopoly/monopoly.js')]
const currentGames = {};
var events = require('events');
require('dotenv').config()
var em = new events.EventEmitter();

client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
    console.log("Bot Started");
});

client.on("messageCreate", (message) => {
    if (channels.includes(message.channel.name) && message.content.startsWith("Start ") && !currentGames[message.channel.name]) {    
      tryCreate(message);
    }
    if (channels.includes(message.channel.name) && !currentGames[message.channel.name] && message.content == "Help") {
        message.channel.send("To start a queue for the game, use 'Start x' where x is the number of seconds you want the queue to last https://github.com/Sigma-dev/games-bot");
    }
    if (message.channel.name === "monopoly" && message.content === "s")
        new Queue(message.channel, em, 15);
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
