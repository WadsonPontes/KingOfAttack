const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	validarNome: (objetos, nome) => {
		let res = {
			valido: true,
			mensagem: null
		};

		if (nome.trim() == '') {
			res.valido = false;
			res.mensagem = 'Campo nome não pode está vazio';
		}
		else if (nome != nome.trim()) {
			res.valido = false;
			res.mensagem = 'Nome não pode começar ou terminar com espaço';
		}
		else if (nome.length < 3) {
			res.valido = false;
			res.mensagem = 'Nome deve ter pelo menos 3 caracteres';
		}
		else if (nome.length > 20) {
			res.valido = false;
			res.mensagem = 'Nome deve ter no máximo 20 caracteres';
		}
		else {
			for (let prop in objetos) {
				let obj = objetos[prop];

				if (obj.nome == nome) {
					res.valido = false;
					res.mensagem = 'Este nome já está sendo usado';
					break;
				}
			}
		}

		return res;
	},

	validarEntradaEmSala: (GM, nome, codigo) => {
		let sala = GM.SalaController.getByNome(GM, nome);
		let res = {
			valido: true,
			mensagem: null,
			sala: sala
		};

		if (!sala) {
			res.valido = false;
			res.mensagem = 'Sala não existe';
		}
		else if (sala.codigo != '' && sala.codigo != codigo) {
			res.valido = false;
			res.mensagem = 'Código de acesso incorreto';
		}
		else if (sala.estado == Estado.JOGO) {
			res.valido = false;
			res.mensagem = 'Partida já começou, tente outra sala';
		}

		return res;
	},

	validarSairDeSala: (GM, jogador) => {
		let sala = GM.salas[jogador.idsala];
		let res = {
			valido: true,
			mensagem: null
		};

		if (jogador.cargo == Cargo.ADMINISTRADOR) {
			res.valido = false;
			res.mensagem = 'Você não pode sair da sala que você é administrador';
		}

		return res;
	},

	validarDeletarSala: (GM, jogador) => {
		let sala = GM.salas[jogador.idsala];
		let res = {
			valido: true,
			mensagem: null
		};

		if (jogador.cargo != Cargo.ADMINISTRADOR) {
			res.valido = false;
			res.mensagem = 'Você não é administrador e não pode excluir essa sala';
		}

		return res;
	},

	validarJogar: (GM, jogador) => {
		let sala = GM.salas[jogador.idsala];
		let res = {
			valido: true,
			mensagem: null
		};

		if (jogador.cargo != Cargo.ADMINISTRADOR) {
			res.valido = false;
			res.mensagem = 'Peça para um administrador começar a partida';
		}
		else if (sala.jogadores.length < 2) {
			res.valido = false;
			res.mensagem = 'Número de jogadores insuficiente para começar uma partida';
		}
		else if (sala.jogadores.length > 5) {
			res.valido = false;
			res.mensagem = 'Número de jogadores acima do permitido';
		}

		for (let jog of sala.jogadores) {
			if (jog.estado != Estado.SALA) {
				res.valido = false;
				res.mensagem = 'Alguém ainda não voltou para a sala';
				break;
			}
		}

		return res;
	},

	validarPrePreparacao: (GM, jogador) => {
		let res = {
			valido: true,
			mensagem: null
		};

		res.mensagem = 'Escolha uma posição para seu porta-aviões';

		return res;
	},

	validarPreparacao: (GM, jogador, dados) => {
		let i = dados.i;
		let j = dados.j;
		let tabuleiro = jogador.tabuleiro;
		let res = {
			valido: true,
			mensagem: null
		};

		switch (jogador.esquadra) {
			case 1:
				res.mensagem = 'Escolha uma posição para seu primeiro encouraçado';
				break;
			case 2:
				res.mensagem = 'Escolha uma posição para seu segundo encouraçado';
				break;
			case 3:
				res.mensagem = 'Escolha uma posição para seu primeiro hidroavião';
				break;
			case 4:
				res.mensagem = 'Escolha uma posição para seu segundo hidroavião';
				break;
			case 5:
				res.mensagem = 'Escolha uma posição para seu terceiro hidroavião';
				break;
			case 6:
				res.mensagem = 'Escolha uma posição para seu primeiro submarino';
				break;
			case 7:
				res.mensagem = 'Escolha uma posição para seu segundo submarino';
				break;
			case 8:
				res.mensagem = 'Escolha uma posição para seu terceiro submarino';
				break;
			case 9:
				res.mensagem = 'Escolha uma posição para seu quarto submarino';
				break;
			case 10:
				res.mensagem = 'Escolha uma posição para seu primeiro cruzador';
				break;
			case 11:
				res.mensagem = 'Escolha uma posição para seu segundo cruzador';
				break;
			case 12:
				res.mensagem = 'Escolha uma posição para seu terceiro cruzador';
				break;
			default:
				res.mensagem = 'Clique em PRONTO para começar';
				break;
		}

		switch (jogador.esquadra) {
			case 1:
				for (let k = 0; k < 5; ++k) {
					if (!GM.Util.validarCasa(tabuleiro, i, j+k)) {
						res.valido = false;
						res.mensagem = 'Movimento invalido';
					}
				}
				break;
			case 2:
			case 3:
				for (let k = 0; k < 4; ++k) {
					if (!GM.Util.validarCasa(tabuleiro, i, j+k)) {
						res.valido = false;
						res.mensagem = 'Movimento invalido';
					}
				}
				break;
			case 4:
			case 5:
			case 6:
				if (!GM.Util.validarCasa(tabuleiro, i, j)) {
					res.valido = false;
					res.mensagem = 'Movimento invalido';
				}
				else if (!GM.Util.validarCasa(tabuleiro, i+1, j+1)) {
					res.valido = false;
					res.mensagem = 'Movimento invalido';
				}
				else if (!GM.Util.validarCasa(tabuleiro, i+1, j-1)) {
					res.valido = false;
					res.mensagem = 'Movimento invalido';
				}
				break;
			case 7:
			case 8:
			case 9:
			case 10:
				if (!GM.Util.validarCasa(tabuleiro, i, j)) {
					res.valido = false;
					res.mensagem = 'Movimento invalido';
				}
				break;
			case 11:
			case 12:
			case 13:
				if (!GM.Util.validarCasa(tabuleiro, i, j)) {
					res.valido = false;
					res.mensagem = 'Movimento invalido';
				}
				else if (!GM.Util.validarCasa(tabuleiro, i, j+1)) {
					res.valido = false;
					res.mensagem = 'Movimento invalido';
				}
				break;
			default:
				break;
		}

		return res;
	},

	validarCasa(tabuleiro, i, j) {
		let valido = true;
		let t = tabuleiro.length-1;

		if (i < 0 || i > t || j < 0 || j > t || tabuleiro[i][j] > 0) {
			valido = false;
		}

		else if (i-1 >= 0 && i-1 <= t && tabuleiro[i-1][j] > 0) {
			valido = false;
		}
		else if (j+1 >= 0 && j+1 <= t && tabuleiro[i][j+1] > 0) {
			valido = false;
		}
		else if (i+1 >= 0 && i+1 <= t && tabuleiro[i+1][j] > 0) {
			valido = false;
		}
		else if (j-1 >= 0 && j-1 <= t && tabuleiro[i][j-1] > 0) {
			valido = false;
		}

		else if (i-1 >= 0 && i-1 <= t && j-1 >=0 && j-1 <= t && tabuleiro[i-1][j-1] > 0) {
			valido = false;
		}
		else if (j+1 >= 0 && j+1 <= t && i-1 >= 0 && i-1 <= t && tabuleiro[i-1][j+1] > 0) {
			valido = false;
		}
		else if (i+1 >= 0 && i+1 <= t && j+1 >= 0 && j+1 <= t && tabuleiro[i+1][j+1] > 0) {
			valido = false;
		}
		else if (j-1 >= 0 && j-1 <= t && i+1 >= 0 && i+1 <= t && tabuleiro[i+1][j-1] > 0) {
			valido = false;
		}

		return valido;
	}
}