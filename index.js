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

    // Ignore bots
    if (message.author.bot) return;

    // Accept wl in any format
    if (message.content.toLowerCase() !== 'wl') return;

    // Optional channel lock
    if (
        process.env.WL_CHANNEL_ID &&
        message.channel.id !== process.env.WL_CHANNEL_ID
    ) return;

    try {

        const member = message.member;

        // Find role
        const role =
            message.guild.roles.cache.get(process.env.WL_ROLE_ID) ||
            message.guild.roles.cache.find(
                r => r.name === process.env.WL_ROLE_NAME
            );

        if (!role) {
            console.log('WL role not found');
            return;
        }

        // Already has role
        if (member.roles.cache.has(role.id)) {
            await message.react('✅');
            return;
        }

        // Give role
        await member.roles.add(role);

        // Green tick reaction
        await message.react('✅');

        // Reply message
        await message.reply({
            content: `You have been given the ${role.name} Role`
        });

        console.log(`Gave WL role to ${message.author.tag}`);

    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_TOKEN);
