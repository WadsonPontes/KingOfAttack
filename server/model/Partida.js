const uuid = require('uuid');
const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Item = require('./Item.js');

class Partida {
    id;
    idsala;
    jogadores;
    itens;
    vez;
    estado;

    constructor(sala) {
        this.id = uuid.v4();
        this.idsala = sala.id;
        this.jogadores = sala.jogadores;
        this.itens = [];
        this.vez = 0;
        this.estado = Estado.PREPARACAO;
        this.init(sala);
    }

    init(sala) {
        sala.estado = Estado.JOGO;
        sala.idpartida = this.id;

        for (let jogador of sala.jogadores) {
            jogador.idpartida = this.id;
            jogador.estado = Estado.JOGO;
        }

        this.gerarItens();
    }

    gerarItens() {
        for (let i = 0; i < 5; ++i) {
            let sobreposto;
            let item;

            do {
                sobreposto = false;
                item = new Item();

                for (let itm of this.itens) {
                    if ((itm.x + itm.largura >= item.x && itm.x + itm.largura <= item.x + item.largura) || (itm.x <= item.x + item.largura && itm.x >= item.x)) {
                        sobreposto = true;
                    }
                }
            } while (sobreposto);

            this.itens.push(item);
        }
    }

    getJogadores() {
        let res = [];

        for (let jog of this.jogadores) {
            res.push(jog.get());
        }

        return res;
    }

    getItens() {
        let res = [];

        for (let item of this.itens) {
            res.push(item.get());
        }

        return res;
    }

    getItem(item) {
        for (let itm of this.itens) {
            if (itm.id == item.id) {
                return itm;
            }
        }

        return null;
    }

    delUsuario(jogador) {
        jogador.idpartida = null;

        let encontrado = false;
        
        for (let i = 0; i < this.jogadores.length; ++i) {
            if (this.jogadores[i].id == jogador.id) {
                encontrado = true;
            }
            else if (encontrado) {
                this.jogadores[i-1] = this.jogadores[i];
            }
        }

        this.jogadores.pop();
    }

    deletar(GM) {
        GM.salas[this.idsala].idpartida = null;

        for (let jogador of this.jogadores) {
            jogador.idpartida = null;
            jogador.vida = jogador.max_vida;
            jogador.dano = jogador.dano_inicial;
            jogador.velocidade = jogador.velocidade_inicial;
            jogador.inventario = [];
            jogador.estado = Estado.SALA;
        }

        delete GM.partidas[this.id];
    }
}

module.exports = Partida;