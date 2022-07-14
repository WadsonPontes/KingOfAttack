const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	entrarNoJogo: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarNome(GM.jogadores, dados.nome);

		if (res.valido) {
			jogador.nome = dados.nome;
			jogador.estado = Estado.SAGUAO;

			ws.send(JSON.stringify({
				tipo: 'entrar',
				estado: 'sucesso',
				jogador: jogador.get()
			}));
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'entrar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	main: (GM, ws, dados, jogador) => {
		switch (dados.funcao) {
			case 'listar':
				GM.SaguaoController.listar(GM, ws, jogador);
				break;
			default:
				break;
		}
	},

	listar: (GM, ws, jogador) => {
	    let salas = [];

	    for (prop in GM.salas) {
	    	let sala = GM.salas[prop];

	        if (sala.listada) {
	            salas.push(sala.nome);
	        }
	    }

	    ws.send(JSON.stringify({
            tipo: 'saguao',
            funcao: 'listar',
            salas: salas
        }));
	},

	listarAll: (GM) => {
	    let salas = [];

	    for (prop in GM.salas) {
	    	let sala = GM.salas[prop];

	        if (sala.listada) {
	            salas.push(sala.nome);
	        }
	    }

	    for (prop in GM.jogadores) {
	    	let jogador = GM.jogadores[prop];

	    	if (jogador.estado == Estado.SAGUAO) {
	    		jogador.ws.send(JSON.stringify({
		            tipo: 'saguao',
		            funcao: 'listar',
		            salas: salas
		        }));
	    	}
	    }
	}
}