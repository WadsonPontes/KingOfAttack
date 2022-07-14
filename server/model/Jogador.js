const uuid = require('uuid');
const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');

class Jogador {
	id;
	idsala;
	idpartida;
	p;
	nome;
	tabuleiro;
	tiros;
	esquadra;
	cargo;
	estado;
	ws;
	dimensao = 15;

	constructor(ws) {
		this.ws = ws;
		this.id = uuid.v4();
		this.esquadra = 1;
		this.estado = Estado.INICIAL;
		this.init();
	}

	init() {
		this.tabuleiro = [];
		this.tiros = [];

		for (let i = 0; i < this.dimensao; ++i) {
			this.tabuleiro[i] = [];
			this.tiros[i] = [];

			for (let j = 0; j < this.dimensao; ++j) {
				this.tabuleiro[i][j] = 0;
				this.tiros[i][j] = 0;
			}
		}
	}

	get() {
		return {
			nome: this.nome,
			tabuleiro: this.tabuleiro,
			tiros: this.tiros,
			esquadra: this.esquadra,
			cargo: this.cargo,
			estado: this.estado
		};
	}

	addEsquedra(dados) {
		let i = dados.i;
		let j = dados.j;

		switch (this.esquadra) {
			case 1:
				for (let k = 0; k < 5; ++k) {
					this.tabuleiro[i][j+k] = this.esquadra;
				}
				break;
			case 2:
			case 3:
				for (let k = 0; k < 4; ++k) {
					this.tabuleiro[i][j+k] = this.esquadra;
				}
				break;
			case 4:
			case 5:
			case 6:
				this.tabuleiro[i][j] = this.esquadra;
				this.tabuleiro[i+1][j+1] = this.esquadra;
				this.tabuleiro[i+1][j-1] = this.esquadra;
				break;
			case 7:
			case 8:
			case 9:
			case 10:
				this.tabuleiro[i][j] = this.esquadra;
				break;
			case 11:
			case 12:
			case 13:
				this.tabuleiro[i][j] = this.esquadra;
				this.tabuleiro[i][j+1] = this.esquadra;
				break;
			default:
				break;
		}

		++this.esquadra;
	}
}

module.exports = Jogador;