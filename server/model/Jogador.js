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
	inventario;
	x;
	y;
	largura;
	altura;
	angulo;
	escala;
	pose;
	quadro;
	duracao;
	tiros;
	cargo;
	estado;
	ws;

	constructor(ws) {
		this.ws = ws;
		this.id = uuid.v4();
		this.nome = uuid.v4();
		let classes = ['cavaleiro', 'ninja', 'samurai', 'robo'];
		this.classe = classes[Math.floor((Math.random() * 4))];
		this.max_vida = 5000;
		this.vida = 5000;
		this.dano = 10;
		this.velocidade = 5;
		this.inventario = [];
		this.x = Math.floor((Math.random() * 800) + 1);
		this.y = 80; // Math.floor((Math.random() * 800) + 1);
		this.largura = 232;
		this.altura = 280;
		this.angulo = 0;
		this.escala = 1;
		this.pose = 'idle';
		this.quadro = 0;
		this.duracao = 0;
		this.estado = Estado.INICIAL;
	}

	get() {
		return {
			nome: this.nome,
			classe: this.classe,
			max_vida: this.max_vida,
			vida: this.vida,
			dano: this.dano,
			velocidade: this.velocidade,
			inventario: this.inventario,
			x: this.x,
			y: this.y,
			largura: this.largura,
			altura: this.altura,
			angulo: this.angulo,
			escala: this.escala,
			pose: this.pose,
			quadro: this.quadro,
			duracao: this.duracao,
			tiros: this.tiros,
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
		this.inventario = dados.inventario;
		this.x = dados.x;
		this.y = dados.y;
		this.largura = dados.largura;
		this.altura = dados.altura;
		this.angulo = dados.angulo;
		this.escala = dados.escala;
		this.pose = dados.pose;
		this.quadro = dados.quadro;
		this.duracao = dados.duracao;
		this.tiros = dados.tiros;
		this.cargo = dados.cargo;
		this.estado = dados.estado;
	}
}

module.exports = Jogador;