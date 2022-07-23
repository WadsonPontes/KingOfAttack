const ws = new WebSocket('ws://' + location.host);
let e = {};
let tela = 'tela_inicial';
let modal = null;
let jogador;
let jogadores;
let itens;
let carregados = 0;

ws.onmessage = (evento) => {
    const dados = JSON.parse(evento.data);
    resetarMS();

    switch (dados.tipo) {
        case 'conexao':
            jogador = dados.jogador;
            mudarPara('tela_jogo');
            break;
        case 'entrar':
            verificarEntrarNoJogo(dados);
            break;
        case 'saguao':
            mainSaguao(dados);
            break;
        case 'sala':
            mainSala(dados);
            break;
        case 'jogar':
            verificarJogar(dados);
            break;
        case 'preparacao':
            mainPreparacao(dados);
            break;
        case 'partida':
            mainPartida(dados);
            break;
        default:
            break;
    }
}

ws.onerror = (erro) => {
    if (jogador) jogador.estado = 10 // DESCONECTADO;
    console.log(`Erro na conexão: ${erro}`);
}

ws.onclose = (id, descricao) => {
    if (jogador) jogador.estado = 10 // DESCONECTADO;
    console.log(`Conexão fechada: ${id} - ${descricao}`);
}

function mainSala(dados) {
    switch (dados.funcao) {
        case 'criar':
            verificarCriarSala(dados);
            break;
        case 'listar':
            listarSala(dados);
            break;
        case 'entrar':
            verificarEntrarSala(dados);
            break;
        case 'sair':
            verificarSairSala(dados);
            break;
        case 'deletar':
            verificarDeletarSala(dados);
            break;
        default:
            break;
    }
}

function mainPreparacao(dados) {
    switch (dados.funcao) {
        case 'listar':
            verificarPreparacao(dados);
            break;
        case 'pronto':
            verificarPronto(dados);
            break;
        case 'finalizar':
            verificarFinalizarPreparacao(dados);
            break;
        default:
            break;
    }
}

function mainPartida(dados) {
    switch (dados.funcao) {
        case 'listar':
            verificarJogo(dados);
            break;
        case 'movimentar':
            verificarMovimentacao(dados);
            break;
        case 'coletar':
            verificarColetar(dados);
            break;
        default:
            verificarMovimentacao(dados);
            break;
    }
}

function mainSaguao(dados) {
    switch (dados.funcao) {
        case 'listar':
            listarSaguao(dados);
            break;
        default:
            break;
    }
}

function listarSala(dados) {
    e.lista_sala.textContent = '';

    dados.jogadores.forEach((nome) => {
        const li = document.createElement('li');
        li.textContent = nome;
        e.lista_sala.appendChild(li); 
    });
}

function listarSaguao(dados) {
    e.lista_saguao.textContent = '';

    dados.salas.forEach((nome) => {
        const li = document.createElement('li');
        li.textContent = nome;
        li.onclick = () => entrarEmSala(nome);
        e.lista_saguao.appendChild(li); 
    });
}

function entrarEmSala(nome) {
    if (modal == 'modal_entrar_sala') {
        nome = e.campo_nome_entrar_sala.value;
        let codigo = e.campo_codigo_entrar_sala.value;

        iniciarMS();
        ws.send(JSON.stringify({
            tipo: 'sala',
            funcao: 'entrar',
            nome: nome,
            codigo: codigo
        }));
    }
    else if (modal == 'modal_entrar_sala_oculta') {
        nome = e.campo_nome_entrar_sala_oculta.value;
        let codigo = e.campo_codigo_entrar_sala_oculta.value;

        iniciarMS();
        ws.send(JSON.stringify({
            tipo: 'sala',
            funcao: 'entrar',
            nome: nome,
            codigo: codigo
        }));
    }
    else {
        e.campo_nome_entrar_sala.value = nome;

        iniciarMS();
        ws.send(JSON.stringify({
            tipo: 'sala',
            funcao: 'entrar',
            nome: nome
        }));
    }
}

function sairDaSala() {
    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'sair'
    }));
}

function deletarSala() {
    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'deletar'
    }));
}

function carregarSala() {
    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'listar'
    }));
}

function carregarSaguao() {
    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'saguao',
        funcao: 'listar'
    }));
}

function carregarPreparacao() {
    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'preparacao',
        funcao: 'listar'
    }));
}

function carregarJogo() {
    iniciarMS();
    loop();
    ws.send(JSON.stringify({
        tipo: 'partida',
        funcao: 'listar'
    }));
}

function verificarJogo(dados) {
    if (dados.estado == 'erro') {
        e.erro_jogo.textContent = dados.mensagem;
    }
    else {
        jogadores = dados.jogadores;
        itens = dados.itens;
    }
}

function verificarMovimentacao(dados) {
    if (dados.estado == 'erro') {
        e.erro_jogo.textContent = dados.mensagem;
    }
    else {
        
    }
}

function verificarColetar(dados) {
    if (dados.estado == 'erro') {
        e.erro_jogo.textContent = dados.mensagem;
    }
    else {
        let item = dados.item;
        jogador.inventario.push(item);

        switch (item.quadro) {
            case 'cura':
                jogador.vida = Math.min(jogador.vida + item.cura, jogador.max_vida);
                break;
            case 'velocidade':
                jogador.velocidade += item.velocidade;
                break;
            case 'forca':
                jogador.dano += item.forca;
                break;
            default:
                break;
        }
    }
}

function loop() {
    contar();
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);

    if (jogadores) {
        for (let jog of jogadores) {
            if (jog.nome != jogador.nome && jog.pose == 'attack' && jog.quadro >= 5 && jog.quadro <= 7) {
                if ((jog.x + jog.largura/2 > jogador.x && jog.x + jog.largura/2 < jogador.x + jogador.largura) || (jog.escala == 1 && jog.x + jog.largura > jogador.x && jog.x + jog.largura < jogador.x + jogador.largura) || (jog.escala == -1 && jog.x < jogador.x + jogador.largura && jog.x > jogador.x)) {
                    jogador.vida = Math.max(jogador.vida - jog.dano, 0);

                    if (jogador.vida == 0 && jogador.pose != 'dead') {
                        jogador.pose = 'dead';
                        jogador.quadro = 0;
                        jogador.escala = -jog.escala;
                        jogador.estado = 12; // DERROTADO
                    }
                }
            }
        }
    }

    if (carregados > 89) {
        let img = e.mapa;
        e.ctx.save();
        e.ctx.translate((e.canvas.width/2) - ((jogador.largura * (e.canvas.width/1920))/2) - (1000 + jogador.x) * (e.canvas.width/1920), (e.canvas.height - (2000 * (e.canvas.width/1920))));
        e.ctx.drawImage(img, 0, 0, (4000) * (e.canvas.width/1920), 2000 * (e.canvas.width/1920));
        e.ctx.restore();

        if (itens) {
            for (let item of itens) {
                let img = e[item.pose][item.quadro];

                e.ctx.save();
                e.ctx.translate((e.canvas.width/2) - ((jogador.largura * (e.canvas.width/1920))/2) + (item.x - jogador.x) * (e.canvas.width/1920), (e.canvas.height - (item.altura * (e.canvas.width/1920)) - item.y * (e.canvas.width/1920)));
                e.ctx.rotate(item.angulo * Math.PI / 180);
                e.ctx.scale(item.escala, 1);
                e.ctx.drawImage(img, 0, 0, (item.largura * item.escala) * (e.canvas.width/1920), item.altura * (e.canvas.width/1920));
                e.ctx.restore();
            }
        }

        if (jogadores) {
            for (let jog of jogadores) {
                if (jog.nome != jogador.nome) {
                    let img = e[jog.classe][jog.pose][jog.quadro];

                    e.ctx.save();
                    e.ctx.translate((e.canvas.width/2) - ((jogador.largura * (e.canvas.width/1920))/2) + (jog.x - jogador.x) * (e.canvas.width/1920), (e.canvas.height - (jog.altura * (e.canvas.width/1920)) - jog.y * (e.canvas.width/1920)));
                    e.ctx.rotate(jog.angulo * Math.PI / 180);
                    e.ctx.scale(jog.escala, 1);
                    e.ctx.drawImage(img, 0, 0, (jog.largura * jog.escala) * (e.canvas.width/1920), jog.altura * (e.canvas.width/1920));
                    e.ctx.restore();
                }
            }
        }

        if (jogador) {
            let img = e[jogador.classe][jogador.pose][jogador.quadro];
            e.ctx.save();
            e.ctx.translate((e.canvas.width/2) - ((jogador.largura * (e.canvas.width/1920))/2), (e.canvas.height - (jogador.altura * (e.canvas.width/1920)) - jogador.y * (e.canvas.width/1920)));
            e.ctx.rotate(jogador.angulo * Math.PI / 180);
            e.ctx.scale(jogador.escala, 1);
            e.ctx.drawImage(img, 0, 0, (jogador.largura * jogador.escala) * (e.canvas.width/1920), jogador.altura * (e.canvas.width/1920));
            e.ctx.restore();
        }
    }

    if (jogador && performance.now() - jogador.duracao > 30) {
        if (jogador.pose == 'attack' && jogador.quadro == 9) {
            jogador.pose = 'idle';
            jogador.quadro = 0;
        }
        else if (jogador.pose == 'dead' && jogador.quadro == 9) {

        }
        else {
            jogador.quadro = (jogador.quadro + 1) % 10;
        }
        
        jogador.duracao = performance.now();
    }

    if (jogador) {
        e.ctx.fillStyle = '#FF0000';
        e.ctx.fillRect((e.canvas.width / 2) - 100, 10, 200, 25);
        // e.ctx.fillRect(10, 10, 200, 25);

        e.ctx.fillStyle = '#00FF00';
        e.ctx.fillRect((e.canvas.width / 2) - 100, 10, (jogador.vida / jogador.max_vida) * 200, 25);
        // e.ctx.fillRect(10, 10, (jogador.vida / jogador.max_vida) * 200, 25);

        for (let i = 0; i < jogador.inventario.length; ++i) {
            let item = jogador.inventario[i];
            let img = e[item.pose][item.quadro];

            e.ctx.drawImage(img, (e.canvas.width / 2) - (jogador.inventario.length * 33 / 2) + i * 35, 40, 25, 25);
            // e.ctx.drawImage(img, 220 + i * 35, 10, 25, 25);
        }

        e.ctx.textAlign = 'end';
        e.ctx.textBaseline = 'top';
        e.ctx.fillStyle = '#fff';
        e.ctx.font = `900 ${Math.min(Math.max(18 * (e.canvas.width/1920), 12), 18)}px Arial`;
        e.ctx.fillText(`FPS: ${fps()}`, e.canvas.width - 50 - (50 * ((e.canvas.width)/1920)), 10);
        e.ctx.fillText(`${ms()} ms`, e.canvas.width - 10, 10);

        if (jogador.pose == 'attack' && jogador.quadro >= 5 && jogador.quadro <= 7) {
            if (itens) {
                for (let item of itens) {
                    if (item.pose == 'caixote') {
                        if ((jogador.x + jogador.largura/2 > item.x && jogador.x + jogador.largura/2 < item.x + item.largura) || (jogador.escala == 1 && jogador.x + jogador.largura > item.x && jogador.x + jogador.largura < item.x + item.largura) || (jogador.escala == -1 && jogador.x < item.x + item.largura && jogador.x > item.x)) {

                            if (jogador.estado != 10 /* DESCONECTADO */) {
                                iniciarMS();
                                ws.send(JSON.stringify({
                                    tipo: 'partida',
                                    funcao: 'dano',
                                    subfuncao: 'jogador_em_item',
                                    jogador: jogador,
                                    item: item
                                }));
                            }
                        }
                    }
                }
            }
        }

        if (itens) {
            for (let item of itens) {
                if (item.pose == 'item') {
                    if (jogador.x + jogador.largura/2 >= item.x && jogador.x + jogador.largura/2 <= item.x + item.largura) {
                        
                        if (jogador.estado != 10 /* DESCONECTADO */) {
                            iniciarMS();
                            ws.send(JSON.stringify({
                                tipo: 'partida',
                                funcao: 'coletar',
                                jogador: jogador,
                                item: item
                            }));
                        }
                    }
                }
            }
        }
    }

    if (jogador && jogador.estado != 10 /* DESCONECTADO */) {
        iniciarMS();
        ws.send(JSON.stringify({
            tipo: 'partida',
            funcao: 'movimentar',
            jogador: jogador
        }));
    }
    else if (jogador && jogador.estado == 10 /* DESCONECTADO */) {
        e.ctx.textAlign = 'center';
        e.ctx.textBaseline = 'middle';
        e.ctx.fillStyle = '#000';
        e.ctx.font = `900 ${80 * (e.canvas.width/1920)}px Arial`;
        e.ctx.fillText('DESCONECTADO', e.canvas.width/2, e.canvas.height/2);
        e.ctx.fillStyle = '#fff';
        e.ctx.font = `900 ${76 * (e.canvas.width/1920)}px Arial`;
        e.ctx.fillText('DESCONECTADO', e.canvas.width/2, e.canvas.height/2);
    }

    window.requestAnimationFrame(loop);
    // setTimeout(loop, 0);
}

function teclou(event) {
    if (jogador && jogador.escala != 10 /* DESCONECTADO */) {
        switch (jogador.estado) {
            case 1: /* INICIAL */ {
                switch (event.key) {
                    case 'Enter':
                        entrarNoJogo();
                        break;
                    default:
                        break;
                }
                break;
            }

            case 6: /* JOGO */ {
                switch (event.key) {
                    // case 'w':
                    // case 'ArrowUp':
                    //     jogador.y -= jogador.velocidade;
                    //     jogador.pose = 'walk';
                    //     break;

                    // case 's':
                    // case 'ArrowDown':
                    //     jogador.y += jogador.velocidade;
                    //     jogador.pose = 'walk';
                    //     break;

                    case 'a':
                    case 'ArrowLeft':
                        jogador.x = Math.max(jogador.x - jogador.velocidade, 0);
                        jogador.escala = -1;
                        jogador.pose = 'walk';
                        break;

                    case 'd':
                    case 'ArrowRight':
                        jogador.x = Math.min(jogador.x + jogador.velocidade, 2000 - jogador.largura);
                        jogador.escala = 1;
                        jogador.pose = 'walk';
                        break;

                    case ' ':
                        jogador.pose = 'attack';
                        break;

                    default:
                        break;
                }

                iniciarMS();
                ws.send(JSON.stringify({
                    tipo: 'partida',
                    funcao: 'movimentar',
                    jogador: jogador
                }));

                break;
            }

            default: {
                break;
            }
        }
    }
}

function desteclou(event) {
    if (jogador && jogador.escala != 10 /* DESCONECTADO */) {
        switch (jogador.estado) {
            case 6: /* JOGO */ {
                switch (event.key) {
                    case 'w':
                    case 'ArrowUp':
                    case 's':
                    case 'ArrowDown':
                    case 'a':
                    case 'ArrowLeft':
                    case 'd':
                    case 'ArrowRight':
                        jogador.pose = 'idle';
                        break;

                    default:
                        break;
                }

                iniciarMS();
                ws.send(JSON.stringify({
                    tipo: 'partida',
                    funcao: 'movimentar',
                    jogador: jogador
                }));

                break;
            }

            default: {
                break;
            }
        }
    }
}

function verificarPreparacao(dados) {
    if (dados.estado == 'erro') {
        e.erro_preparacao.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        listarPreparacao(dados.mensagem);
    }
}

function verificarFinalizarPreparacao(dados) {
    if (dados.estado == 'erro') {
        
    }
    else {
        mudarPara('tela_jogo');
    }
}

function verificarPronto(dados) {
    jogador = dados.jogador;
    e.comando_preparacao.textContent = dados.mensagem;

    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'preparacao',
        funcao: 'finalizar'
    }));
}

function listarJogo(mensagem) {
    let tabuleiro = jogador.tabuleiro;
    let tiros = jogador.tiros;
    e.tabuleiro_jogo.textContent = '';
    e.tiros_jogo.textContent = '';
    e.erro_jogo.textContent = '';
    e.comando_jogo.textContent = mensagem;

    for (let i = 0; i < tabuleiro.length; ++i) {
        const tr = document.createElement('tr');
        e.tabuleiro_jogo.appendChild(tr);

        for (let j = 0; j < tabuleiro[i].length; ++j) {
            const td = document.createElement('td');
            td.classList.add(`cor-${tabuleiro[i][j]}`);
            tr.appendChild(td);
        }
    }

    for (let i = 0; i < tiros.length; ++i) {
        const tr = document.createElement('tr');
        e.tiros_jogo.appendChild(tr);

        for (let j = 0; j < tiros[i].length; ++j) {
            const td = document.createElement('td');
            td.classList.add(`cor-${tiros[i][j]}`);
            td.onclick = () => atacar(i, j);
            tr.appendChild(td);
        }
    }
}

function atacar(i, j) {
    
}

function listarPreparacao(mensagem) {
    let tabuleiro = jogador.tabuleiro;
    e.tabuleiro_preparacao.textContent = '';
    e.erro_preparacao.textContent = '';
    e.comando_preparacao.textContent = mensagem;

    for (let i = 0; i < tabuleiro.length; ++i) {
        const tr = document.createElement('tr');
        e.tabuleiro_preparacao.appendChild(tr);

        for (let j = 0; j < tabuleiro[i].length; ++j) {
            const td = document.createElement('td');
            td.classList.add(`cor-${tabuleiro[i][j]}`);
            td.onclick = () => posicionarEsquadra(i, j);
            tr.appendChild(td);
        }
    }

    if (jogador.esquadra > 13) {
        e.botao_pronto.classList.remove('invisivel');
        e.botao_pronto.disabled = false;
    }
}

function pronto() {
    e.botao_pronto.disabled = true;

    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'preparacao',
        funcao: 'pronto'
    }));
}

function posicionarEsquadra(i, j) {
    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'preparacao',
        funcao: 'posicionar',
        i: i,
        j: j
    }));
}

function verificarEntrarNoJogo(dados) {
    if (dados.estado == 'erro') {
        e.erro_nome.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_saguao');
    }
}

function verificarCriarSala(dados) {
    if (dados.estado == 'erro') {
        e.erro_criar_sala.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_sala');
    }
}

function verificarJogar(dados) {
    if (dados.estado == 'erro') {
        e.erro_sala.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_jogo');
    }
}

function verificarEntrarSala(dados) {
    if (dados.estado == 'erro') {
        if (modal == 'modal_entrar_sala') {
            e.erro_entrar_sala.textContent = dados.mensagem;
        }
        else if (modal == 'modal_entrar_sala_oculta') {
            e.erro_entrar_sala_oculta.textContent = dados.mensagem;
        }
        else {
            abrirModal('modal_entrar_sala');
        }
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_sala');
    }
}

function verificarSairSala(dados) {
    if (dados.estado == 'erro') {
        abrirModal('modal_deletar_sala');
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_saguao');
    }
}

function verificarDeletarSala(dados) {
    if (dados.estado == 'erro') {
        e.erro_deletar_sala.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_saguao');
    }
}

function entrarNoJogo() {
    let nome = e.campo_nome.value;

    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'entrar', 
        nome: nome
    }));
}

function jogar() {
    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'jogar'
    }));
}

function criarSala() {
    let nome = e.campo_nome_criar_sala.value;
    let codigo = e.campo_codigo_criar_sala.value;
    let listada = (e.campo_visibilidade_criar_sala.value === 'true');

    iniciarMS();
    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'criar',
        nome: nome,
        codigo: codigo,
        listada: listada
    }));
}

function abrirModal(nome) {
    fecharModal();

    modal = nome;
    e[modal].showModal();
}

function fecharModal() {
    if (modal) {
        e[modal].close();
        modal = null;
    }
}

function mudarPara(nova) {
    fecharModal();

    e[nova].classList.remove('desligado');
    e[tela].classList.add('desligado');
    tela = nova;

    switch (tela) {
        case 'tela_saguao':
            carregarSaguao();
            break;
        case 'tela_sala':
            carregarSala();
            break;
        case 'tela_preparacao':
            carregarPreparacao();
            break;
        case 'tela_jogo':
            carregarJogo();
            break;
        default:
            break;
    }
}

function redimensionar() {
    e.canvas.width = window.innerWidth;
    e.canvas.height = window.innerHeight;
}

function main() {
    e.tela_inicial = document.querySelector('#tela-inicial');
    e.tela_saguao = document.querySelector('#tela-saguao');
    e.tela_sala = document.querySelector('#tela-sala');
    e.tela_preparacao = document.querySelector('#tela-preparacao');
    e.tela_jogo = document.querySelector('#tela-jogo');
    e.tela_resultado = document.querySelector('#tela-resultado');

    e.campo_nome = document.querySelector('#campo-nome');
    e.erro_nome = document.querySelector('#erro-nome');

    e.lista_saguao = document.querySelector('#lista-saguao');

    e.lista_sala = document.querySelector('#lista-sala');

    e.modal_criar_sala = document.querySelector('#modal-criar-sala');
    e.campo_nome_criar_sala = document.querySelector('#campo-nome-criar-sala');
    e.campo_codigo_criar_sala = document.querySelector('#campo-codigo-criar-sala');
    e.campo_visibilidade_criar_sala = document.querySelector('#campo-visibilidade-criar-sala');
    e.erro_criar_sala = document.querySelector('#erro-criar-sala');

    e.modal_entrar_sala = document.querySelector('#modal-entrar-sala');
    e.campo_nome_entrar_sala = document.querySelector('#campo-nome-entrar-sala');
    e.campo_codigo_entrar_sala = document.querySelector('#campo-codigo-entrar-sala');
    e.erro_entrar_sala = document.querySelector('#erro-entrar-sala');

    e.modal_entrar_sala_oculta = document.querySelector('#modal-entrar-sala-oculta');
    e.campo_nome_entrar_sala_oculta = document.querySelector('#campo-nome-entrar-sala-oculta');
    e.campo_codigo_entrar_sala_oculta = document.querySelector('#campo-codigo-entrar-sala-oculta');
    e.erro_entrar_sala_oculta = document.querySelector('#erro-entrar-sala-oculta');

    e.modal_deletar_sala = document.querySelector('#modal-deletar-sala');
    e.erro_deletar_sala = document.querySelector('#erro-deletar-sala');

    e.erro_saguao = document.querySelector('#erro-saguao');
    e.erro_sala = document.querySelector('#erro-sala');
    e.erro_preparacao = document.querySelector('#erro-preparacao');
    e.erro_jogo = document.querySelector('#erro-jogo');

    e.tabuleiro_preparacao = document.querySelector('#tabuleiro-preparacao');
    e.comando_preparacao = document.querySelector('#comando-preparacao');

    e.botao_pronto = document.querySelector('#botao-pronto');

    e.tabuleiro_jogo = document.querySelector('#tabuleiro-jogo');
    e.tiros_jogo = document.querySelector('#tiros-jogo');
    e.comando_jogo = document.querySelector('#comando-jogo');

    e.canvas = document.querySelector('canvas');
    e.ctx = e.canvas.getContext('2d');
    redimensionar();

    // CAVALEIRO

    e.cavaleiro = {};

    e.cavaleiro.idle = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/cavaleiro/png/original/Idle (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.cavaleiro.idle.push(img);
    }

    e.cavaleiro.walk = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/cavaleiro/png/original/Run (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.cavaleiro.walk.push(img);
    }

    e.cavaleiro.attack = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/cavaleiro/png/original/Attack (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.cavaleiro.attack.push(img);
    }

    e.cavaleiro.dead = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/cavaleiro/png/original/Dead (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.cavaleiro.dead.push(img);
    }

    // NINJA

    e.ninja = {};

    e.ninja.idle = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/ninja/png/Idle__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.ninja.idle.push(img);
    }

    e.ninja.walk = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/ninja/png/Run__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.ninja.walk.push(img);
    }

    e.ninja.attack = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/ninja/png/Attack__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.ninja.attack.push(img);
    }

    e.ninja.dead = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/ninja/png/Dead__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.ninja.dead.push(img);
    }


    // SAMURAI

    e.samurai = {};

    e.samurai.idle = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/samurai/png/Idle__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.samurai.idle.push(img);
    }

    e.samurai.walk = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/samurai/png/Run__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.samurai.walk.push(img);
    }

    e.samurai.attack = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/samurai/png/Attack__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.samurai.attack.push(img);
    }

    e.samurai.dead = [];
    for (let i = 0; i <= 9; ++i) {
        let img = new Image();
        img.src = `img/samurai/png/Dead__00${i}.png`;
        img.addEventListener('load', () => ++carregados, false);
        e.samurai.dead.push(img);
    }


    // ROBÔ

    e.robo = {};

    e.robo.idle = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/robo/png/Idle (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.robo.idle.push(img);
    }

    e.robo.walk = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/robo/png/Run (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.robo.walk.push(img);
    }

    e.robo.attack = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/robo/png/Melee (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.robo.attack.push(img);
    }

    e.robo.dead = [];
    for (let i = 1; i <= 10; ++i) {
        let img = new Image();
        img.src = `img/robo/png/Dead (${i}).png`;
        img.addEventListener('load', () => ++carregados, false);
        e.robo.dead.push(img);
    }

    // CAIXOTE

    e.caixote = [];
    for (let i = 1; i <= 4; ++i) {
        let img = new Image();
        img.src = `img/caixote/caixote_00${i}.jpg`;
        img.addEventListener('load', () => ++carregados, false);
        e.caixote.push(img);
    }

    // ITENS

    e.item = {};

    e.item.cura = new Image();
    e.item.cura.src = `img/itens/cura.png`;
    e.item.cura.addEventListener('load', () => ++carregados, false);

    e.item.velocidade = new Image();
    e.item.velocidade.src = `img/itens/velocidade.png`;
    e.item.velocidade.addEventListener('load', () => ++carregados, false);

    e.item.forca = new Image();
    e.item.forca.src = `img/itens/forca.png`;
    e.item.forca.addEventListener('load', () => ++carregados, false);

    // MAPA

    e.mapa = new Image();
    e.mapa.src = `img/mapa/mapa.png`;
    e.mapa.addEventListener('load', () => ++carregados, false);

    document.addEventListener('keydown', teclou);
    document.addEventListener('keyup', desteclou);
    window.addEventListener('resize', redimensionar);
}

main();