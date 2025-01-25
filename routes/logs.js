const express = require('express');
const Log = require('./models/Log'); // Ajuste para o caminho correto do modelo
const router = express.Router();

// Página principal com todos os logs
router.get('/', async (req, res) => {
    try {
        const logs = await Log.find();
        res.render('logs', { logs });
    } catch (err) {
        console.error('Erro ao buscar logs:', err);
        res.status(500).send('Erro ao carregar os logs.');
    }
});

// API para buscar logs de um jogador específico
router.get('/:player', async (req, res) => {
    try {
        const logs = await Log.find({ playerName: req.params.player });
        if (logs.length > 0) {
            res.json(logs);
        } else {
            res.status(404).json({ error: 'Jogador não encontrado.' });
        }
    } catch (err) {
        console.error('Erro ao buscar logs do jogador:', err);
        res.status(500).json({ error: 'Erro ao buscar os logs.' });
    }
});

module.exports = router;
