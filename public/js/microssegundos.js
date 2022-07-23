let v = {};
v.fps = 0;
v.ms = 0;
v.fps_contador = 0;
v.ms_contador = 0;
v.ms_cumulado = 0;
v.fps_microssegundos = 0;
v.ms_microssegundos = 0;
v.ms_cumulado_microssegundos = 0;
v.quadros_microssegundos = 0;
v.tempo_microssegundos = 0;

// Chame essa função dentro do game loop
function contar() {
	v.fps_contador++;
	resetarFPS();
	
}

// Caso tipo == 'tempo': Retorna true se já tiver passado o tempo valor
// Caso tipo == 'quadros': Retorna true se já passou um frame, dado que o jogo terá valor quadros
function passou(tipo, valor) {
	if (tipo == 'tempo') return resetarTempo(valor);
	if (tipo == 'quadros') return resetarQuadros(valor);
}

function fps() {
	return v.fps;
}

function ms() {
	return v.ms;
}

function iniciarMS() {
	v.ms_microssegundos = microssegundos();
}

function resetarMS() {
	v.ms_cumulado += Math.round(microssegundos() - v.ms_microssegundos);
	++v.ms_contador;

	if (microssegundos() - v.ms_cumulado_microssegundos >= 1000) {
		v.ms = Math.round(v.ms_cumulado / Math.max(v.ms_contador, 1));
		v.ms_cumulado = 0;
		v.ms_contador = 0;
		v.ms_cumulado_microssegundos = microssegundos();
	}
}

function resetarFPS() {
	if (microssegundos() - v.fps_microssegundos >= 1000) {
		let sub = microssegundos() - v.fps_microssegundos;
		v.fps = Math.round((v.fps_contador * 1000) / (sub));
		// v.fps = v.fps_contador;
		v.fps_contador = 0;
		v.fps_microssegundos = microssegundos();
	}
}

function resetarTempo(tempo) {
	if (microssegundos() - v.tempo_microssegundos >= tempo) {
		v.tempo_microssegundos = microssegundos();
		return true;
	}
	return false;
}

function resetarQuadros(quadros) {
	if (microssegundos() - v.quadros_microssegundos >= 1000 / Math.max(quadros, 1)) {
		v.quadros_microssegundos = microssegundos();
		return true;
	}
	return false;
}

function microssegundos() {
	return performance.now() || performance.webkitNow();
}