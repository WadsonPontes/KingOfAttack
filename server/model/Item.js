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
	cura;
	velocidade;
	forca;
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
		this.id = uuid.v4();
		this.nome = 'caixote';
		this.max_vida = 1000;
		this.vida = 700;
		this.cura = 1000;
		this.velocidade = 10;
		this.forca = 10;
		this.largura = 100;
		this.altura = 100;
		this.x = Math.floor((Math.random() * (2000 - this.largura)) + 1);
		this.y = 90;
		this.angulo = 0;
		this.escala = 1;
		this.pose = 'caixote';
		this.quadro = 0;
		this.duracao = 0;
		this.estado = Estado.INICIAL;
	}

	get() {
		return {
			id: this.id,
			nome: this.nome,
			max_vida: this.max_vida,
			vida: this.vida,
			cura: this.cura,
			velocidade: this.velocidade,
			forca: this.forca,
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
		this.id = dados.id;
		this.nome = dados.nome;
		this.max_vida = dados.max_vida;
		this.vida = dados.vida;
		this.cura = dados.cura;
		this.velocidade = dados.velocidade;
		this.forca = dados.forca;
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

	receberDano(jogador) {
		if (this.pose == 'caixote') {
			this.vida = Math.max(this.vida - jogador.dano, 0);
			this.quadro = 3 - Math.round((this.vida/this.max_vida) * 3);

			if (this.vida == 0) {
				this.sortearItem();
			}
		}
	}

	sortearItem() {
		this.pose = 'item';

		let itens = ['cura', 'velocidade', 'forca'];
		this.quadro = itens[Math.floor((Math.random() * 3))];
		this.duracao = performance.now();
	}

	coletar(partida) {
		for (let i = 0; i < partida.itens.length; ++i) {
            if (this.id == partida.itens[i].id) {
            	partida.itens.splice(i, 1);
            	break;
            }
        }
	}
}

module.exports = Item;