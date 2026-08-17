/* INSERT COIN — Máquina de pistas · app.js
   Client-side only: localStorage. Sin backend. Honor system. */
(function () {
  'use strict';

  // ---------------- DATOS DEL LIBRO ----------------
  var NIVELES = [
    { n: 1, nombre: 'ASTRO BLASTER', clave: 'ESCUCHA', trans: 'NIVEL 1 SUPERADO — Las naves se apagan una a una. Un pasillo se abre entre los paneles.' },
    { n: 2, nombre: 'LABERINTO', clave: 'SIGUE', trans: 'NIVEL 2 SUPERADO — Las paredes azules se deshacen. El pasillo huele a metacrilato caliente.' },
    { n: 3, nombre: 'BLOQUES', clave: 'CORRE', trans: 'NIVEL 3 SUPERADO — Los bloques caen. El suelo tiembla. Sigues corriendo.' },
    { n: 4, nombre: 'SIMON', clave: 'ATREVETE', trans: 'NIVEL 4 SUPERADO — La cúpula se queda a oscuras. Los botones dejan de brillar.' },
    { n: 5, nombre: 'PLATAFORMAS', clave: 'PIENSA', trans: 'NIVEL 5 SUPERADO — El plano se pliega solo. Las plataformas se alinean.' },
    { n: 6, nombre: 'CRIPTA', clave: 'AVANZA', trans: 'NIVEL 6 SUPERADO — La inscripción se apaga. La cripta te deja pasar.' },
    { n: 7, nombre: 'VELOCIDAD', clave: 'TERMINA', trans: 'NIVEL 7 SUPERADO — El circuito se apaga. La carretera termina en una puerta.' },
    { n: 8, nombre: 'JEFE FINAL', clave: 'ESCAPATE', trans: 'FINAL DESBLOQUEADO — La última palabra es la llave. Elige tu salida: PUERTA o CABLE.' }
  ];

  var SECCIONES = {
    'PASILLO': 'Ruta registrada: PASILLO (segura). Créditos intactos.',
    'FUSIBLES': 'Ruta registrada: FUSIBLES (arriesgada). −2 créditos por entrar.',
    'SOMBRA': 'Ruta registrada: SOMBRA (segura). Créditos intactos.',
    'CEREZA': 'Ruta registrada: CEREZA (arriesgada). −2 créditos por entrar.',
    'MANTENIMIENTO': 'Ruta registrada: MANTENIMIENTO (segura). Créditos intactos.',
    'PASARELA': 'Ruta registrada: PASARELA (arriesgada). −2 créditos por subir.',
    'ESCALERA': 'Ruta registrada: ESCALERA (segura). Créditos intactos.',
    'CABINA': 'Ruta registrada: CABINA (arriesgada). −2 créditos por entrar.',
    'CUERDA': 'Ruta registrada: CUERDA (segura). Créditos intactos.',
    'BARRIL': 'Ruta registrada: BARRIL (arriesgada). −2 créditos por meter la mano.',
    'LINTERNA': 'Ruta registrada: LINTERNA (segura). Créditos intactos.',
    'POZO': 'Ruta registrada: POZO (arriesgada). −2 créditos por bajar.',
    'GASOLINERA': 'Ruta registrada: GASOLINERA (segura). Créditos intactos.',
    'BOXES': 'Ruta registrada: BOXES (arriesgada). −2 créditos por entrar.',
    'PUERTA': 'FINAL A desbloqueado — saliste del arcade. Malasaña, 1987. Huele a chicle y a fluorescentes calientes.',
    'CABLE': 'FINAL B desbloqueado — estás dentro de la pantalla. El libro se cierra... pero no para siempre.'
  };

  var BONUS = {
    'FUSIBLES': 'BONUS 1 — +1 CRÉDITO. La advertencia del manual era verdad.',
    '100110': 'BONUS 2 — +1 CRÉDITO. Las líneas muertas del listado.',
    '57': 'BONUS 3 — +1 CRÉDITO. La C y la E, en sus filas.',
    '26': 'BONUS 4 — +1 CRÉDITO. Las dos afirmaciones que mentían.',
    '10': 'BONUS 5/6 — +1 CRÉDITO. Código de bonus válido.',
    '48': 'BONUS 7 — +1 CRÉDITO. Las dos bombillas apagadas.'
  };

  var PISTAS = {
    1: {
      p1: 'Cada nave transmite dos señales distintas: una corta y una larga. La tabla del manual te dice qué significa cada combinación.',
      p2: 'Las naves 4 y 9 transmiten secuencias que no existen en la tabla: son interferencia. Las demás, en orden, forman la palabra.',
      sol: 'ESCUCHA — ●=E · ●●●=S · ▬●▬●=C · ●●▬=U · ▬●▬●=C · ●●●●=H · ●▬=A. Las naves 4 (●●●●●) y 9 (▬▬▬▬) son interferencia.'
    },
    2: {
      p1: 'Ejecuta el programa como si fueras la máquina: línea a línea, saltando cuando diga GOTO. Anota lo que imprime cada PRINT.',
      p2: 'El bucle de la línea 40 a la 90 se repite tres veces: A vale 4, luego 2, luego 0. Las líneas 100 y 170 no se ejecutan nunca.',
      sol: 'SIGUE — S(60) I(70) G(80) con A=4,2,0; al salir del bucle la 130 dobla B (2→8), la 150 hace A=0+8=8 → U(140) E(160).'
    },
    3: {
      p1: 'Tacha los ocho juegos de la lista. Cada uno está una sola vez, en línea recta, sin cruces.',
      p2: 'Las letras que quedan sin tachar están en las filas 5, 6 y 7. Léelas de arriba abajo.',
      sol: 'CORRE — C(fila 5) O(fila 6) R(fila 7) R(fila 7) E(fila 7).'
    },
    4: {
      p1: 'Dos afirmaciones no pueden ser verdad a la vez. Busca los símbolos que aparecen en dos posiciones distintas.',
      p2: 'Si el ★ estuviera en la 5, el ■ se quedaría sin posición. Si el ● estuviera en la 1, el ▲ se quedaría sin posición.',
      sol: 'ATREVETE — ▲1 ★2 ◆3 ●4 ■5 ♥6 ☼7 ♦8 → A T R E V E T E. Las falsas son la 2 y la 6.'
    },
    5: {
      p1: 'La Línea 1 es la clave de conversión: cada número primo es una letra según su posición en la lista (2=A, 3=B, 5=C…).',
      p2: 'Filtra los primos de la Línea 2: 2, 53, 23, 11, 43, 67. Sus letras, reordenadas, dan la palabra.',
      sol: 'PIENSA — 2=A · 53=P · 23=I · 11=E · 43=N · 67=S. Las demás estaciones (15, 49 y las ramas) son trampas.'
    },
    6: {
      p1: 'Cada letra grabada esconde siempre la misma letra real. Cuenta cuántas veces se repite cada letra del cifrado.',
      p2: 'La más repetida es la T (8 veces): es la E. Con eso, descifra las palabras de dos letras: TR, PS, MR, GT.',
      sol: 'AVANZA — «EL TIEMPO NO PERDONA AL QUE SE DETIENE, AVANZA». La última palabra es la clave.'
    },
    7: {
      p1: 'La partida te dice qué interruptores están cerrados: ★ y ▲. El ■ no. Evalúa cada puerta del esquema.',
      p2: 'Y exige los dos cerrados; O basta con uno. Las bombillas 4 y 8 se quedan apagadas.',
      sol: 'TERMINA — 1(★)=T · 2(★O■)=E · 3(★Y▲)=R · 5(▲)=M · 6(■O▲)=I · 7(★O▲)=N · 9(★O■O▲)=A.'
    },
    8: {
      p1: 'El tablero es el del nivel 1: fila, columna → letra. Y tus siete palabras clave te dan las iniciales.',
      p2: 'Las iniciales dan E-S-C-A-P-A-T. El tablero da la palabra completa: descifra los ocho pares del panel.',
      sol: 'ESCAPATE — (1,5)=E · (4,3)=S · (1,3)=C · (1,1)=A · (3,5)=P · (1,1)=A · (4,4)=T · (1,5)=E.'
    }
  };

  // ---------------- ESTADO (localStorage) ----------------
  var KEY = 'insertcoin_v1';
  var estado = cargar();

  function cargar() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { creditos: 10, niveles: {}, secciones: {}, bonus: {}, pistas: {} };
  }
  function guardar() {
    try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch (e) {}
  }

  // ---------------- UTILIDADES ----------------
  function normalizar(s) {
    return (s || '').toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]/g, '');
  }

  var $ = function (id) { return document.getElementById(id); };

  function mostrar(el, texto, tipo) {
    el.className = 'feedback' + (tipo ? ' ' + tipo : '');
    el.textContent = texto;
  }

  // ---------------- VALIDACIÓN ----------------
  function validar() {
    var codigo = normalizar($('entrada').value);
    var fb = $('feedback');
    if (!codigo) { mostrar(fb, 'Escribe un código.', 'err'); return; }

    // 1) palabra clave de nivel
    for (var i = 0; i < NIVELES.length; i++) {
      var niv = NIVELES[i];
      if (codigo === niv.clave) {
        if (estado.niveles[niv.n]) {
          mostrar(fb, 'Ya habías superado el NIVEL ' + niv.n + '.', 'ok');
          return;
        }
        estado.niveles[niv.n] = true;
        guardar();
        render();
        mostrar(fb, niv.trans + '\n+1 NIVEL · palabra clave correcta.', 'ok');
        return;
      }
    }

    // 2) código de sección (puede ser también código de bonus: FUSIBLES)
    if (SECCIONES[codigo]) {
      var ya = estado.secciones[codigo];
      estado.secciones[codigo] = true;
      var msj = SECCIONES[codigo] + (ya ? '\n(ya la habías registrado)' : '');
      if (BONUS[codigo] && !estado.bonus[codigo]) {
        estado.bonus[codigo] = true;
        estado.creditos += 1;
        msj += '\n' + BONUS[codigo];
      }
      guardar();
      render();
      mostrar(fb, msj, 'ok');
      return;
    }

    // 3) código de bonus
    if (BONUS[codigo]) {
      if (estado.bonus[codigo]) {
        mostrar(fb, 'Ese código de bonus ya lo has cobrado.', 'err');
        return;
      }
      estado.bonus[codigo] = true;
      estado.creditos += 1;
      guardar();
      render();
      mostrar(fb, BONUS[codigo], 'ok');
      return;
    }

    mostrar(fb, 'Código no reconocido. Revisa tu palabra clave, tu sección o tus bonus.', 'err');
  }

  // ---------------- PISTAS ----------------
  function comprar(tipo) {
    var n = parseInt($('nivel-pista').value, 10);
    var fb = $('pista-feedback');
    var coste = { p1: 2, p2: 3, sol: 5 }[tipo];
    var clavePista = n + '_' + tipo;

    if (!PISTAS[n]) { mostrar(fb, 'Nivel no disponible.', 'err'); return; }
    if (estado.pistas[clavePista]) {
      mostrar(fb, PISTAS[n][tipo], 'ok');
      return;
    }
    if (estado.creditos < coste) {
      mostrar(fb, 'Créditos insuficientes (' + coste + ' necesarios, tienes ' + estado.creditos + '). Resuelve un bonus o empieza otra partida.', 'err');
      return;
    }
    estado.creditos -= coste;
    estado.pistas[clavePista] = true;
    guardar();
    render();
    mostrar(fb, '−' + coste + ' créditos.\n\n' + PISTAS[n][tipo], 'ok');
  }

  // ---------------- RENDER ----------------
  function render() {
    $('creditos').textContent = estado.creditos;
    var resueltos = Object.keys(estado.niveles).filter(function (k) { return estado.niveles[k]; }).length;
    $('niveles').textContent = resueltos + '/8';

    // mapa
    var html = '';
    for (var i = 0; i < NIVELES.length; i++) {
      var niv = NIVELES[i];
      var cls = 'nivel';
      if (estado.niveles[niv.n]) cls += ' resuelto';
      else if (resueltos >= niv.n - 1) cls += ' activo';
      html += '<div class="' + cls + '"><span class="n">' + niv.n + '</span><span class="t">' + niv.nombre + '</span></div>';
    }
    $('niveles-lista').innerHTML = html;

    // selector de nivel para pistas
    var sel = $('nivel-pista');
    var actual = sel.value;
    sel.innerHTML = '';
    for (var j = 0; j < NIVELES.length; j++) {
      var op = document.createElement('option');
      op.value = NIVELES[j].n;
      op.textContent = 'NIVEL ' + NIVELES[j].n + ' — ' + NIVELES[j].nombre;
      sel.appendChild(op);
    }
    if (actual) sel.value = actual;

    // final desbloqueado
    if (estado.niveles['8']) {
      $('final').classList.remove('oculto');
    } else {
      $('final').classList.add('oculto');
    }
  }

  // ---------------- INIT ----------------
  function init() {
    $('btn-validar').addEventListener('click', validar);
    $('entrada').addEventListener('keydown', function (e) { if (e.key === 'Enter') validar(); });
    $('btn-p1').addEventListener('click', function () { comprar('p1'); });
    $('btn-p2').addEventListener('click', function () { comprar('p2'); });
    $('btn-sol').addEventListener('click', function () { comprar('sol'); });
    $('version').textContent = 'INSERT COIN · v1.0 · 1987';
    render();
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
  setTimeout(init, 300); // safety net
})();
