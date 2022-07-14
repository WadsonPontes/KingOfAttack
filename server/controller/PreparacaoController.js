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
			case 'posicionar':
				GM.PreparacaoController.posicionar(GM, ws, dados, jogador);
				break;
			case 'pronto':
				GM.PreparacaoController.pronto(GM, ws, dados, jogador);
				break;
			case 'finalizar':
				GM.PreparacaoController.finalizar(GM, ws, dados, jogador);
				break;
			default:
				break;
		}
	},

	listar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarPrePreparacao(GM, jogador);

		if (res.valido) {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'sucesso',
				mensagem: res.mensagem,
				jogador: jogador.get()
			}));
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	posicionar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarPreparacao(GM, jogador, dados);

		if (res.valido) {
			jogador.addEsquedra(dados);

			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'sucesso',
				mensagem: res.mensagem,
				jogador: jogador.get()
			}));
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	pronto: (GM, ws, dados, jogador) => {
		// let res = GM.Util.validarPronto(GM, jogador, dados);
		let res = {
			valido: true,
			mensagem: 'Esperando oponente...'
		}

		if (res.valido) {
			jogador.estado = Estado.PRONTO;

			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'pronto',
				estado: 'sucesso',
				mensagem: res.mensagem,
				jogador: jogador.get()
			}));
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'pronto',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	finalizar: (GM, ws, dados, jogador) => {
		// let res = GM.Util.validarPronto(GM, jogador, dados);
		let res = {
			valido: true,
			mensagem: 'Esperando oponente...'
		}

		if (res.valido) {
			let prontos = true;

			for (let jog of GM.partidas[jogador.idpartida].jogadores) {
				if (jog.estado != Estado.PRONTO) {
					prontos = false;
				}
			}

			if (prontos) {
				for (let jog of GM.partidas[jogador.idpartida].jogadores) {
					jog.estado = Estado.JOGO;
				}

				ws.send(JSON.stringify({
					tipo: 'preparacao',
					funcao: 'finalizar',
					estado: 'sucesso'
				}));
			}
			else {
				ws.send(JSON.stringify({
					tipo: 'preparacao',
					funcao: 'finalizar',
					estado: 'erro',
					mensagem: res.mensagem
				}));
			}
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'finalizar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	}
}