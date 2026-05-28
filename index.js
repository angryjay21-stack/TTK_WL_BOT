require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const validMessages = ['wl'];

    if (!validMessages.includes(message.content.toLowerCase())) return;

    if (process.env.WL_CHANNEL_ID &&
        message.channel.id !== process.env.WL_CHANNEL_ID) return;

    try {
        const member = message.member;

        const role =
            message.guild.roles.cache.get(process.env.WL_ROLE_ID) ||
            message.guild.roles.cache.find(
                r => r.name === process.env.WL_ROLE_NAME
            );

        if (!role) {
            console.log('WL role not found');
            return;
        }

        if (member.roles.cache.has(role.id)) {
            await message.react('✅');
            return;
        }

        await member.roles.add(role);

        await message.react('🎫');

        await message.reply({
            content: `You have been given the ${role.name} role.`
        });

        console.log(`Gave WL role to ${message.author.tag}`);

    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_TOKEN);
