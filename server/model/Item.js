const uuid = require('uuid');
const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');

class Item {
	id;
	idsala;
	idpartida;
	nome;
	max_vida;
	vida;
	x;
	y;
	largura;
	altura;
	angulo;
	escala;
	pose;
	quadro;
	duracao;
	estado;

	constructor() {
		this.nome = 'caixote';
		this.max_vida = 500;
		this.vida = 500;
		this.x = Math.floor((Math.random() * 800) + 1);
		this.y = 660; // Math.floor((Math.random() * 800) + 1);
		this.largura = 70;
		this.altura = 70;
		this.angulo = 0;
		this.escala = 1;
		this.pose = 'caixote';
		this.quadro = 0;
		this.duracao = 0;
		this.estado = Estado.INICIAL;
	}

	get() {
		return {
			nome: this.nome,
			max_vida: this.max_vida,
			vida: this.vida,
			x: this.x,
			y: this.y,
			largura: this.largura,
			altura: this.altura,
			angulo: this.angulo,
			escala: this.escala,
			pose: this.pose,
			quadro: this.quadro,
			duracao: this.duracao,
			estado: this.estado
		};
	}

	set(dados) {
		this.nome = dados.nome;
		this.max_vida = dados.max_vida;
		this.vida = dados.vida;
		this.x = dados.x;
		this.y = dados.y;
		this.largura = dados.largura;
		this.altura = dados.altura;
		this.angulo = dados.angulo;
		this.escala = dados.escala;
		this.pose = dados.pose;
		this.quadro = dados.quadro;
		this.duracao = dados.duracao;
		this.estado = dados.estado;
	}
}

module.exports = Item;