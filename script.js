let documentoXML, preguntas, actual = 0;
let puntuacion = 0, tiempo = 0, temporizador;
let cuestionarioActivo = false;
let respuestaSeleccionada = null;

function formatearTiempo(segundos) {
  const mins = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${mins}m ${segs < 10 ? '0' : ''}${segs}s`;
}

function actualizarEstado(puntos = 0, segundos = 0) {
  document.getElementById("tiempo").innerText = `Tiempo: ${formatearTiempo(segundos)}`;
}

function iniciarTemporizador() {
  temporizador = setInterval(() => {
    tiempo++;
    document.getElementById("tiempo").innerText = `Tiempo: ${formatearTiempo(tiempo)}`;
  }, 1000);
}

function mostrarBotones({siguiente = true, corregir = true, finalizar = true} = {}) {
  document.getElementById("botonSiguiente").classList.toggle("oculto", !siguiente);
  document.getElementById("botonCorregir").classList.toggle("oculto", !corregir);
  document.getElementById("botonFinalizar").classList.toggle("oculto", !finalizar);
}

function reiniciarCuestionario() {
  actual = 0;
  puntuacion = 0;
  tiempo = 0;
  respuestaSeleccionada = null;
  actualizarEstado();
}

function iniciarCuestionario() {
  document.getElementById("menuPrincipal").style.display = "none";
  document.getElementById("cuestionario").style.display = "block";
  document.getElementById("tiempo").style.display = "";

  cargarPreguntas(() => {
    cuestionarioActivo = true;
    reiniciarCuestionario();
    iniciarTemporizador();
    mostrarPregunta();
  });
}

function cargarPreguntas(callback) {
  const archivo = document.getElementById("idioma").value;
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    documentoXML = this.responseXML;
    preguntas = documentoXML.getElementsByTagName("question");
    callback();
  };
  xhttp.open("GET", archivo, true);
  xhttp.send();
}

function mostrarPregunta() {
  const pregunta = preguntas[actual];
  if (!pregunta) return;

  const esUltima = actual === preguntas.length - 1;
  mostrarBotones({siguiente: !esUltima, corregir: true, finalizar: true});

  const opciones = document.querySelectorAll(".opcion");
  opciones.forEach(op => op.classList.remove("correcta", "incorrecta", "selected"));

  const enunciado = pregunta.getElementsByTagName("wording")[0].textContent;
  const opcionesElementos = pregunta.getElementsByTagName("choice");

  let html = `<h3>${actual + 1}. ${enunciado}</h3>`;

  for (let i = 0; i < opcionesElementos.length; i++) {
    html += `<div class="opcion" onclick="seleccionarRespuesta(this, ${opcionesElementos[i].getAttribute("correct") === "yes"})">${opcionesElementos[i].textContent}</div>`;
  }

  document.getElementById("contenedorPreguntas").innerHTML = html;
}

function seleccionarRespuesta(elemento, esCorrecta) {
  const opciones = document.querySelectorAll(".opcion");
  opciones.forEach(op => op.classList.remove("selected"));

  elemento.classList.add("selected");
  respuestaSeleccionada = { elemento, esCorrecta };
}

function corregirPregunta() {
  if (respuestaSeleccionada === null) return;

  const opciones = document.querySelectorAll(".opcion");

  if (!respuestaSeleccionada.esCorrecta) {
    opciones.forEach(op => {
      if (op.textContent === obtenerRespuestaCorrecta()) {
        op.classList.add("correcta");
      }
    });
    respuestaSeleccionada.elemento.classList.add("incorrecta");
  } else {
    respuestaSeleccionada.elemento.classList.add("correcta");
  }

  opciones.forEach(op => op.onclick = null);
}

function obtenerRespuestaCorrecta() {
  const opciones = preguntas[actual].getElementsByTagName("choice");
  for (let i = 0; i < opciones.length; i++) {
    if (opciones[i].getAttribute("correct") === "yes") {
      return opciones[i].textContent;
    }
  }
}

function mostrarSiguiente() {
  if (respuestaSeleccionada && respuestaSeleccionada.esCorrecta) {
    puntuacion++;
  }

  actual++;
  if (actual < preguntas.length) {
    respuestaSeleccionada = null;
    mostrarPregunta();
  }
}

function finalizarCuestionario() {
  clearInterval(temporizador);
  cuestionarioActivo = false;

  if (respuestaSeleccionada !== null && respuestaSeleccionada.esCorrecta) {
    puntuacion++;
  }
  document.getElementById("puntuacion").style.display = "block";
  document.getElementById("puntuacion").innerText = `Tu puntuación fue: ${puntuacion}/${preguntas.length}`;
  document.getElementById("tiempo").style.display = "none";

  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = `
    <h2>Fin del cuestionario</h2>
    <p>Tiempo empleado: ${formatearTiempo(tiempo)}</p>
  `;

  ["botonCorregir", "botonFinalizar"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = "none";
  });

  const btnSiguiente = document.getElementById("botonSiguiente");
  btnSiguiente.textContent = "Reintentar cuestionario";
  btnSiguiente.onclick = () => window.location.href = "index.html";
  btnSiguiente.classList.remove("oculto");
}
