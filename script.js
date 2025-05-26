// Variables globales para controlar estado del cuestionario
let documentoXML, preguntas, actual = 0;
let puntuacion = 0, tiempo = 0, temporizador;
let cuestionarioActivo = false;
let respuestaSeleccionada = null;

// Función para formatear tiempo en minutos y segundos (ej: 2m 08s)
function formatearTiempo(segundos) {
  const mins = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${mins}m ${segs < 10 ? '0' : ''}${segs}s`;
}

// Inicia el temporizador que actualiza el tiempo cada segundo
function iniciarTemporizador() {
  temporizador = setInterval(() => {
    tiempo++;
    document.getElementById("tiempo").innerText = `Tiempo: ${formatearTiempo(tiempo)}`;
  }, 1000);
}

// Controla la visibilidad de los botones según parámetros
function mostrarBotones({siguiente = true, corregir = true, finalizar = true} = {}) {
  document.getElementById("botonSiguiente").style.display = siguiente ? "inline-block" : "none";
  document.getElementById("botonCorregir").style.display = corregir ? "inline-block" : "none";
  document.getElementById("botonFinalizar").style.display = finalizar ? "inline-block" : "none";
}

// Reinicia variables para empezar un nuevo cuestionario
function reiniciarCuestionario() {
  actual = 0;
  puntuacion = 0;
  tiempo = 0;
  respuestaSeleccionada = null;
}

// Función principal para iniciar el cuestionario desde el menú principal
function iniciarCuestionario() {
  document.getElementById("menuPrincipal").style.display = "none";  // Oculta menú
  document.getElementById("cuestionario").style.display = "block";  // Muestra cuestionario
  document.getElementById("puntuacion").style.display = "none";     // Oculta puntuación inicial
  reiniciarCuestionario();
  cargarPreguntas(() => {
    cuestionarioActivo = true;
    iniciarTemporizador();
    mostrarPregunta();
  });
}

// Carga el archivo XML seleccionado y extrae las preguntas
function cargarPreguntas(callback) {
  const archivo = document.getElementById("idioma").value; // idioma = archivo XML
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    documentoXML = this.responseXML;
    preguntas = documentoXML.getElementsByTagName("question");
    callback();
  };
  xhttp.open("GET", archivo, true);
  xhttp.send();
}

// Muestra la pregunta actual con sus opciones en pantalla
function mostrarPregunta() {
  const pregunta = preguntas[actual];
  if (!pregunta) return;

  // Saber si es la última pregunta para controlar botones
  const esUltima = actual === preguntas.length - 1;
  mostrarBotones({siguiente: !esUltima, corregir: true, finalizar: true});

  respuestaSeleccionada = null; // Reinicia selección de respuesta

  // Extrae el texto del enunciado
  const enunciado = pregunta.getElementsByTagName("wording")[0].textContent;
  const opcionesElementos = pregunta.getElementsByTagName("choice");

  let html = `<h3>${actual + 1}. ${enunciado}</h3>`;

  // Genera los divs con las opciones, cada una con su función onclick
  for (let i = 0; i < opcionesElementos.length; i++) {
    const texto = opcionesElementos[i].textContent;
    const esCorrecta = opcionesElementos[i].getAttribute("correct") === "yes";
    html += `<div class="opcion" onclick="seleccionarRespuesta(this, ${esCorrecta})">${texto}</div>`;
  }

  // Inserta las opciones en el contenedor del cuestionario
  document.getElementById("contenedorPreguntas").innerHTML = html;
}

// Marca la opción seleccionada y guarda si es correcta o no
function seleccionarRespuesta(elemento, esCorrecta) {
  // Deselecciona cualquier opción previamente seleccionada
  const opciones = document.querySelectorAll(".opcion");
  opciones.forEach(op => {
    op.classList.remove("selected", "correcta", "incorrecta");
  });

  // Marca la opción clicada como seleccionada
  elemento.classList.add("selected");
  respuestaSeleccionada = { elemento, esCorrecta };
}

// Corrige la respuesta seleccionada, mostrando colores y ajustando puntuación
function corregirPregunta() {
  if (!respuestaSeleccionada) {
    alert("Por favor, selecciona una respuesta antes de corregir.");
    return;
  }

  const opciones = document.querySelectorAll(".opcion");

  if (respuestaSeleccionada.esCorrecta) {
    // Si es correcta, pinta en verde y suma puntuación
    respuestaSeleccionada.elemento.classList.add("correcta");
    puntuacion++;
  } else {
    // Si es incorrecta, pinta en rojo la seleccionada
    respuestaSeleccionada.elemento.classList.add("incorrecta");
    // Además marca la opción correcta en verde
    opciones.forEach(op => {
      if (!op.classList.contains("selected")) {
        // Compara el texto con la opción correcta del XML
        const pregunta = preguntas[actual];
        const opcionesElementos = pregunta.getElementsByTagName("choice");
        for (let i = 0; i < opcionesElementos.length; i++) {
          if (opcionesElementos[i].getAttribute("correct") === "yes" && opcionesElementos[i].textContent === op.textContent) {
            op.classList.add("correcta");
          }
        }
      }
    });
  }

  // Deshabilita clics en opciones para evitar cambios tras corregir
  opciones.forEach(op => op.onclick = null);
  // Muestra botón "Siguiente" y oculta "Corregir"
  document.getElementById("botonCorregir").style.display = "none";
  document.getElementById("botonSiguiente").style.display = "inline-block";
}

// Muestra la siguiente pregunta o finaliza si no hay más
function mostrarSiguiente() {
  actual++;
  if (actual < preguntas.length) {
    mostrarPregunta();
    // Después de avanzar, muestra "Corregir" y oculta "Siguiente"
    document.getElementById("botonCorregir").style.display = "inline-block";
    document.getElementById("botonSiguiente").style.display = "none";
  } else {
    finalizarCuestionario();
  }
}

// Finaliza el cuestionario, muestra puntuación y tiempo empleado
function finalizarCuestionario() {
  clearInterval(temporizador);  // Para temporizador
  cuestionarioActivo = false;
  document.getElementById("puntuacion").style.display = "block";
  document.getElementById("puntuacion").innerText = `Tu puntuación fue: ${puntuacion}/${preguntas.length}`;
  document.getElementById("tiempo").style.display = "none";

  // Limpia el contenedor de preguntas y muestra mensaje final
  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = `<h2>Fin del cuestionario</h2><p>Tiempo empleado: ${formatearTiempo(tiempo)}</p>`;

  // Oculta todos los botones
  document.getElementById("botonCorregir").style.display = "none";
  document.getElementById("botonSiguiente").style.display = "none";
  document.getElementById("botonFinalizar").style.display = "none";
}
