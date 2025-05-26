let documentoXML, preguntas, actual = 0;
let puntuacion = 0, tiempo = 0, temporizador;
let cuestionarioActivo = false;
let respuestaSeleccionada = null;

// Formatea el tiempo en "Xm YYs"
function formatearTiempo(segundos) {
  const mins = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${mins}m ${segs < 10 ? '0' : ''}${segs}s`;
}

// Actualiza el contador de tiempo en pantalla
function actualizarEstado(puntos = 0, segundos = 0) {
  document.getElementById("tiempo").innerText = `Tiempo: ${formatearTiempo(segundos)}`;
}

// Inicia el temporizador del cuestionario
function iniciarTemporizador() {
  temporizador = setInterval(() => {
    tiempo++;
    document.getElementById("tiempo").innerText = `Tiempo: ${formatearTiempo(tiempo)}`;
  }, 1000);
}

// Muestra u oculta botones según el estado del cuestionario
function mostrarBotones({siguiente = true, corregir = true, finalizar = true} = {}) {
  document.getElementById("botonSiguiente").style.display = siguiente ? "inline-block" : "none";
  document.getElementById("botonCorregir").style.display = corregir ? "inline-block" : "none";
  document.getElementById("botonFinalizar").style.display = finalizar ? "inline-block" : "none";
}

// Reinicia el cuestionario a su estado inicial
function reiniciarCuestionario() {
  actual = 0;
  puntuacion = 0;
  tiempo = 0;
  respuestaSeleccionada = null;
  actualizarEstado();
}

// Inicia el cuestionario al pulsar "Comenzar"
function iniciarCuestionario() {
  document.getElementById("menuPrincipal").style.display = "none";
  document.getElementById("cuestionario").style.display = "block";
  document.getElementById("tiempo").style.display = "block";

  cargarPreguntas(() => {
    cuestionarioActivo = true;
    reiniciarCuestionario();
    iniciarTemporizador();
    mostrarPregunta();
  });
}

// Carga el archivo XML con las preguntas
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

// Muestra una pregunta y sus opciones
function mostrarPregunta() {
  const pregunta = preguntas[actual];
  if (!pregunta) return;

  const esUltima = actual === preguntas.length - 1;
  mostrarBotones({ siguiente: !esUltima, corregir: true, finalizar: esUltima });

  const enunciado = pregunta.getElementsByTagName("wording")[0].textContent;
  const opcionesElementos = pregunta.getElementsByTagName("choice");

  // Creamos el contenido de la pregunta
  let html = `<h3>${actual + 1}. ${enunciado}</h3>`;
  for (let i = 0; i < opcionesElementos.length; i++) {
    html += `<div class="opcion">${opcionesElementos[i].textContent}</div>`;
  }

  document.getElementById("contenedorPreguntas").innerHTML = html;

  // Asignamos eventos de click con JS (NO inline)
  const opciones = document.querySelectorAll(".opcion");
  opciones.forEach((opcion, i) => {
    const esCorrecta = opcionesElementos[i].getAttribute("correct") === "yes";
    opcion.addEventListener("click", () => seleccionarRespuesta(opcion, esCorrecta));
  });
}

//  Marca una opción como seleccionada
function seleccionarRespuesta(elemento, esCorrecta) {
  const opciones = document.querySelectorAll(".opcion");
  opciones.forEach(op => op.classList.remove("selected"));

  elemento.classList.add("selected");
  respuestaSeleccionada = { elemento, esCorrecta };
}

//  Corrige la respuesta seleccionada y muestra visualmente si fue correcta o no
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

  // Desactiva clics una vez corregido
  opciones.forEach(op => op.style.pointerEvents = "none");
}

// Devuelve el texto de la respuesta correcta actual
function obtenerRespuestaCorrecta() {
  const opciones = preguntas[actual].getElementsByTagName("choice");
  for (let i = 0; i < opciones.length; i++) {
    if (opciones[i].getAttribute("correct") === "yes") {
      return opciones[i].textContent;
    }
  }
}

//  Muestra la siguiente pregunta
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

//  Finaliza el cuestionario y muestra resultado
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

  // Ocultamos botones de control y cambiamos el de "Siguiente" a "Reintentar"
  document.getElementById("botonCorregir").style.display = "none";
  document.getElementById("botonFinalizar").style.display = "none";

  const btnSiguiente = document.getElementById("botonSiguiente");
  btnSiguiente.textContent = "Reintentar cuestionario";
  btnSiguiente.onclick = () => window.location.href = "index.html";
  btnSiguiente.style.display = "inline-block";
}
