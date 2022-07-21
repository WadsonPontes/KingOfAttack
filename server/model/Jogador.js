const uuid = require('uuid');
const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');

class Jogador {
	id;
	idsala;
	idpartida;
	p;
	nome;
	classe;
	max_vida;
	vida;
	dano;
	velocidade;
	x;
	y;
	largura;
	altura;
	angulo;
	escala;
	pose;
	quadro;
	duracao;
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
		this.nome = uuid.v4();
		let classes = ['cavaleiro', 'ninja', 'samurai', 'robo'];
		this.classe = classes[Math.floor((Math.random() * 4))];
		this.max_vida = 10000;
		this.vida = 10000;
		this.dano = 10;
		this.velocidade = 10;
		this.x = Math.floor((Math.random() * 800) + 1);
		this.y = 600; // Math.floor((Math.random() * 800) + 1);
		this.largura = 116;
		this.altura = 140;
		this.angulo = 0;
		this.escala = 1;
		this.pose = 'idle';
		this.quadro = 0;
		this.duracao = 0;
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
			classe: this.classe,
			max_vida: this.max_vida,
			vida: this.vida,
			dano: this.dano,
			velocidade: this.velocidade,
			x: this.x,
			y: this.y,
			largura: this.largura,
			altura: this.altura,
			angulo: this.angulo,
			escala: this.escala,
			pose: this.pose,
			quadro: this.quadro,
			duracao: this.duracao,
			tabuleiro: this.tabuleiro,
			tiros: this.tiros,
			esquadra: this.esquadra,
			cargo: this.cargo,
			estado: this.estado
		};
	}

	set(dados) {
		this.nome = dados.nome;
		this.classe = dados.classe;
		this.max_vida = dados.max_vida;
		this.vida = dados.vida;
		this.dano = dados.dano;
		this.velocidade = dados.velocidade;
		this.x = dados.x;
		this.y = dados.y;
		this.largura = dados.largura;
		this.altura = dados.altura;
		this.angulo = dados.angulo;
		this.escala = dados.escala;
		this.pose = dados.pose;
		this.quadro = dados.quadro;
		this.duracao = dados.duracao;
		this.tabuleiro = dados.tabuleiro;
		this.tiros = dados.tiros;
		this.esquadra = dados.esquadra;
		this.cargo = dados.cargo;
		this.estado = dados.estado;
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