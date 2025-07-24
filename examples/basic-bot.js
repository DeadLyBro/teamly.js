const { Client } = require('@deadlybro/teamly.js');
require('dotenv').config();

const TOKEN = process.env.BOT_TOKEN; // Get token from environment variables

const client = new Client(TOKEN);

client.on('ready', (user) => {
    console.log(`Logged in as ${user.username}`);
});

client.on('messageCreate', async (message) => {
    if (message.content?.toLowerCase() === '!ping') {
        let startTime = new Date(message.createdAt).getTime();

        let reply = await client.reply(message.channelId, message.id, `Pong <@${message.createdBy.id}>!`);

        let endTime = new Date(reply.createdAt).getTime();
        let latency = endTime - startTime;

        await client.editMessage(reply.channelId, reply.id, undefined, {
            embeds: [{
                title: '🏓 Pong!',
                description: `Latency: ${latency}ms`,
                color: 0x00ff00
            }]
        });
    }

    if (message.content?.toLowerCase() === '!embed') {
        await client.sendEmbed(message.channelId, undefined, [{
            title: 'Welcome!',
            description: 'Hello from DeadLyBro\'s Teamly.js!\n\nThis is an example embed.',
            color: 0x00FF00,
            footer: {
                text: 'Teamly.js Bot',
                icon_url: 'https://example.com/icon.png'
            }
        }]);
    }
});

client.on('userLeftTeam', async (user) => {
    await client.sendEmbed('CHANNEL_ID', undefined, [{
        title: 'User Left',
        description: `User ${user.username} left the team.`,
        color: 0xff0000
    }]);
});

client.login();