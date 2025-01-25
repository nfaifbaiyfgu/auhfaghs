const { Client, GatewayIntentBits } = require('discord.js');
const Log = require('../models/Log');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Bot logado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.channel.id === process.env.LOG_CHANNEL_ID && message.embeds.length > 0) {
        const embed = message.embeds[0];
        const playerName = extractPlayerName(embed.description);

        if (playerName) {
            // Verificar se já existe um log para o jogador
            const log = await Log.findOne({ playerName });
            
            if (log) {
                // Se o log já existe, apenas incrementa a quantidade
                log.logCount += 1;
                await log.save();
                console.log(`Log atualizado para ${playerName}:`, log);
            } else {
                // Se não existir, cria um novo log com a contagem de 1
                const newLog = new Log({ playerName, logCount: 1 });
                await newLog.save();
                console.log(`Novo log criado para ${playerName}:`, newLog);
            }
        }
    }
});

function extractPlayerName(description) {
    const match = description.match(/👤︱\*\*Player:\*\* ([^\n]+)/);
    return match ? match[1] : null;
}

module.exports = {
    start: () => client.login(process.env.TOKEN),
};
