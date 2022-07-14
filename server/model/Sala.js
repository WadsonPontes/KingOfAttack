const uuid = require('uuid');
const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');

class Sala {
	id;
	idpartida;
	nome;
	jogadores;
	codigo;
	listada;
	estado;

	constructor(jogador, dados) {
		this.id = uuid.v4();
		this.nome = dados.nome;
		this.codigo = dados.codigo;
		this.listada = dados.listada;
		this.estado = Estado.INICIAL;
		this.init(jogador);
	}

	init(jogador) {
		jogador.idsala = this.id;
		jogador.cargo = Cargo.ADMINISTRADOR;
		jogador.p = 0;
		jogador.estado = Estado.SALA;
		this.jogadores = [jogador];
	}

	addUsuario(jogador) {
		jogador.idsala = this.id;
		jogador.cargo = Cargo.USUARIO;
		jogador.p = this.jogadores.length;
		jogador.estado = Estado.SALA;
		this.jogadores.push(jogador);
	}

	delUsuario(jogador, estado) {
		jogador.idsala = null;
		jogador.cargo = null;
		jogador.p = null;

		if (estado) {
			jogador.estado = estado;
		}
		else {
			jogador.estado = Estado.SAGUAO;
		}

		let encontrado = false;
		
		for (let i = 0; i < this.jogadores.length; ++i) {
			if (this.jogadores[i].id == jogador.id) {
				encontrado = true;
			}
			else if (encontrado) {
				--this.jogadores[i].p;
				this.jogadores[i-1] = this.jogadores[i];
			}
		}

		this.jogadores.pop();
	}

	getJogadores() {
		let jogadores = [];

		for (let jogador of this.jogadores) {
			jogadores.push(jogador.get());
		}

		return jogadores;
	}

	get() {
		return {
			nome: this.nome,
			jogadores: this.getJogadores(),
			estado: this.estado
		};
	}
}

module.exports = Sala;