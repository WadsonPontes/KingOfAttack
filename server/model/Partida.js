const uuid = require('uuid');
const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');

class Partida {
    id;
    idsala;
    jogadores;
    vez;
    estado;

    constructor(sala) {
        this.id = uuid.v4();
        this.idsala = sala.id;
        this.jogadores = sala.jogadores;
        this.vez = 0;
        this.estado = Estado.PREPARACAO;
        this.init(sala);
    }

    init(sala) {
        sala.estado = Estado.JOGO;
        sala.idpartida = this.id;

        for (let jogador of sala.jogadores) {
            jogador.idpartida = this.id;
            jogador.estado = Estado.PREPARACAO;
        }
    }
}

module.exports = Partida;