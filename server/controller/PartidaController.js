const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	main: (GM, ws, dados, jogador) => {
		switch (dados.funcao) {
			case 'listar':
				GM.PreparacaoController.listar(GM, ws, dados, jogador);
				break;
			default:
				break;
		}
	},

	jogar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarJogar(GM, jogador);

		if (res.valido) {
			let partida = new Partida(GM.salas[jogador.idsala]);

			for (let jog of partida.jogadores) {
				jog.ws.send(JSON.stringify({
					tipo: 'jogar',
					estado: 'sucesso',
					jogador: jog.get()
				}));
			}

			GM.partidas[partida.id] = partida;
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'jogar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	listar: (GM, ws, dados, jogador) => {
		// let res = GM.Util.validarPrePreparacao(GM, jogador);
		let partida = GM.partidas[jogador.idpartida];
		let res = {
			valido: true,
			mensagem: ''
		}

		if (res.valido) {
			for (let jog of partida.jogadores) {
		        jog.ws.send(JSON.stringify({
		            tipo: 'partida',
		            funcao: 'listar',
		            estado: 'sucesso',
		            mensagem: res.mensagem,
		            jogador: jog.get()
		        }));
		    }
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'partida',
				funcao: 'listar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	}
}