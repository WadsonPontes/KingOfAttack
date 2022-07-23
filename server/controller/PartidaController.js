const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	main: (GM, ws, dados, jogador) => {
		switch (dados.funcao) {
			case 'listar':
				GM.PartidaController.listar(GM, ws, dados, jogador);
				break;
			case 'movimentar':
				GM.PartidaController.movimentar(GM, ws, dados, jogador);
				break;
			case 'dano':
				GM.PartidaController.dano(GM, ws, dados, jogador);
				break;
			case 'coletar':
				GM.PartidaController.coletar(GM, ws, dados, jogador);
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
		            jogadores: partida.getJogadores(),
		            itens: partida.getItens()
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
	},

	movimentar: (GM, ws, dados, jogador) => {
		// let res = GM.Util.validarMovimentacao(GM, jogador, dados);
		let partida = GM.partidas[jogador.idpartida];
		let res = {
			valido: true,
			mensagem: ''
		}

		jogador.set(dados.jogador);

		if (res.valido) {
			jogador.ws.send(JSON.stringify({
	            tipo: 'partida',
	            funcao: 'movimentar',
	            estado: 'sucesso',
	            mensagem: res.mensagem
	        }));

	        GM.PartidaController.listar(GM, ws, dados, jogador);
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'partida',
				funcao: 'movimentar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	dano: (GM, ws, dados, jogador) => {
		switch (dados.subfuncao) {
			case 'jogador_em_item':
				GM.PartidaController.danoJogadorEmItem(GM, ws, dados, jogador);
				break;
			default:
				break;
		}
	},

	danoJogadorEmItem: (GM, ws, dados, jogador) => {
		// let res = GM.Util.validardanoJogadorEmItem(GM, jogador, dados);
		let partida = GM.partidas[jogador.idpartida];
		let item = partida.getItem(dados.item);
		let res = {
			valido: true,
			mensagem: ''
		}

		if (item) item.receberDano(jogador);

		if (item && res.valido) {
			jogador.ws.send(JSON.stringify({
	            tipo: 'partida',
	            funcao: 'dano',
	            subfuncao: 'jogador_em_item',
	            estado: 'sucesso',
	            mensagem: res.mensagem
	        }));

	        GM.PartidaController.listar(GM, ws, dados, jogador);
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'partida',
				funcao: 'dano',
	            subfuncao: 'jogador_em_item',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	coletar: (GM, ws, dados, jogador) => {
		// let res = GM.Util.validarColeta(GM, jogador, dados);
		let partida = GM.partidas[jogador.idpartida];
		let item = partida.getItem(dados.item);
		let res = {
			valido: true,
			mensagem: ''
		}

		if (item && performance.now() - item.duracao > 1000) item.coletar(partida);

		if (item && performance.now() - item.duracao > 1000 && res.valido) {
			jogador.ws.send(JSON.stringify({
	            tipo: 'partida',
	            funcao: 'coletar',
	            estado: 'sucesso',
	            mensagem: res.mensagem,
	            item: item.get()
	        }));

			GM.PartidaController.listar(GM, ws, dados, jogador);
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'partida',
				funcao: 'coletar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	}
}