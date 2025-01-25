const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    playerName: String,
    logCount: { type: Number, default: 1 }, // Número de execuções do jogador
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
