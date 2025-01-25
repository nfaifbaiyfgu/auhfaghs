// app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Carregar variáveis de ambiente
const path = require('path');
const Log = require('./models/Log');
const bot = require('./bot/bot');

// Verificar variáveis de ambiente
if (!process.env.TOKEN || !process.env.MONGO_URI || !process.env.LOG_CHANNEL_ID) {
    console.error('Erro: Certifique-se de que todas as variáveis de ambiente estão configuradas.');
    process.exit(1);
}

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    });

// Iniciar o bot
bot.start();

// Criar servidor Express
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rota para exibir logs com pesquisa
app.get('/logs', async (req, res) => {
    const searchTerm = req.query.search || ''; // Termo de busca
    let logs;

    try {
        if (searchTerm) {
            // Buscar logs que correspondem ao nome do jogador
            logs = await Log.find({ playerName: { $regex: searchTerm, $options: 'i' } });
        } else {
            // Buscar todos os logs
            logs = await Log.find();
        }
        res.render('logs', { logs, searchTerm });
    } catch (err) {
        console.error('Erro ao buscar logs:', err);
        res.status(500).send('Erro ao buscar logs');
    }
});

// Iniciar o servidor Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
