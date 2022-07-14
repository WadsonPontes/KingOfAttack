const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	main: (GM, ws, dados, jogador) => {
		switch (dados.funcao) {
			case 'listar':
				GM.SalaController.listar(GM, GM.salas[jogador.idsala]);
				break;
			case 'criar':
				GM.SalaController.criar(GM, ws, dados, jogador);
				break;
			case 'entrar':
				GM.SalaController.entrar(GM, ws, dados, jogador);
				break;
			case 'sair':
				GM.SalaController.sair(GM, ws, jogador);
				break;
			case 'deletar':
				GM.SalaController.deletar(GM, ws, jogador);
				break;
			default:
				break;
		}
	},

	criar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarNome(GM.salas, dados.nome);

		if (res.valido) {
			let sala = new Sala(jogador, dados);

			ws.send(JSON.stringify({
				tipo: 'sala',
				funcao: 'criar',
				estado: 'sucesso',
				jogador: jogador.get()
			}));

			GM.salas[sala.id] = sala;
			GM.SaguaoController.listarAll(GM);
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'sala',
				funcao: 'criar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	entrar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarEntradaEmSala(GM, dados.nome, dados.codigo);

		if (res.valido) {
			res.sala.addUsuario(jogador);

			ws.send(JSON.stringify({
				tipo: 'sala',
				funcao: 'entrar',
				estado: 'sucesso',
				jogador: jogador.get()
			}));
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'sala',
				funcao: 'entrar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	sair: (GM, ws, jogador) => {
		let res = GM.Util.validarSairDeSala(GM, jogador);

		if (res.valido) {
			let sala = GM.salas[jogador.idsala];

			sala.delUsuario(jogador);

			ws.send(JSON.stringify({
				tipo: 'sala',
				funcao: 'sair',
				estado: 'sucesso',
				jogador: jogador.get()
			}));

			GM.SalaController.listar(GM, sala);
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'sala',
				funcao: 'sair',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	deletar: (GM, ws, jogador) => {
		let res = GM.Util.validarDeletarSala(GM, jogador);

		if (res.valido) {
	    	let sala = GM.salas[jogador.idsala];

	    	while (sala.jogadores.length) {
	    		let jog = sala.jogadores[sala.jogadores.length-1];

	    		sala.delUsuario(jog);

	    		jog.ws.send(JSON.stringify({
					tipo: 'sala',
					funcao: 'deletar',
					estado: 'sucesso',
					jogador: jogador.get()
				}));
	    	}

	    	delete GM.salas[sala.id];
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'sala',
				funcao: 'deletar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	sairOuDel: (GM, ws, jogador) => {
		let resDel = GM.Util.validarDeletarSala(GM, jogador);
		let resSai = GM.Util.validarSairDeSala(GM, jogador);

		if (resDel.valido) {
			GM.SalaController.deletar(GM, ws, jogador);
		}
		else {
			GM.SalaController.sair(GM, ws, jogador);
		}
	},

	listar: (GM, sala) => {
	    let jogadores = [];

	    for (jog of sala.jogadores) {
	        jogadores.push(jog.nome);
	    }

	    for (jog of sala.jogadores) {
	        jog.ws.send(JSON.stringify({
	            tipo: 'sala',
	            funcao: 'listar',
	            jogadores: jogadores
	        }));
	    }
	},

	getByNome: (GM, nome) => {
		let res = null;

		for (prop in GM.salas) {
	        let sala = GM.salas[prop];

	        if (sala.nome == nome) {
	        	res = sala;
	        	break;
	        }
	    }

	    return res;
	}
}