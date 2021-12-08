class Queue {
    channel;
    constructor(channel, em, time) {
        this.channel = channel;

        this.startQueue(em, time);
    }

    async startQueue(em, time) {
        var message = await this.channel.send("Queue ending in " + time.toString() + " seconds, Queue up by reacting with any emoji");
        const collector = message.createReactionCollector({ time: time * 1000 });

        collector.on('end', collected => {
            let users = [];
            collected.forEach(function (reaction) {
                const emoji = reaction._emoji;
                const userInfo = Array.from(reaction.users.cache, ([, value]) => (value))[0];
                const user = {
                    name: userInfo.username,
                    id: userInfo.id,
                    emoji: emoji,
                }
                users.push(user);
            });
            if (users.length < 1)
                return;
            em.emit('StartGame', { channel: this.channel, players: users });
        });
    }
}

module.exports = Queue;