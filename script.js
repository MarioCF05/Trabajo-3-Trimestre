body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f1eb; /* Fondo claro */
  color: #4e3e28; /* Marrón oscuro elegante */
  margin: 0;
  padding: 0;
  text-align: center;
}

h1 {
  font-size: 2.5em;
  margin-top: 40px;
  color: #7a5c38; /* Tono madera refinado */
}

#menuPrincipal, #cuestionario {
  max-width: 720px;
  margin: 60px auto 40px;
  padding: 30px;
  background-color: #ffffff; /* Fondo claro */
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(122, 92, 56, 0.15); /* Sombra elegante */
}

select, button {
  font-size: 1em;
  padding: 12px 20px;
  margin: 15px 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background-color: #d4c2a5; /* Madera clara */
  color: #4e3e28;
  transition: all 0.25s ease-in-out;
}

button:hover, select:hover {
  background-color: #c7b08a;
}

#contenedorPreguntas h3 {
  font-size: 1.4em;
  margin-bottom: 20px;
  color: #4e3e28;
}

.opcion {
  background-color: #f3ede5;
  margin: 10px auto;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  max-width: 80%;
  border: 1px solid #dbcbb6;
  transition: background-color 0.3s, border 0.3s;
  user-select: none;
}

.opcion:hover {
  background-color: #e8dfd6;
}

.opcion.selected {
  background-color: #d4c2a5;
  border-color: #a88b5d;
  color: #3e2e10;
  font-weight: 600;
}

.opcion.correcta {
  background-color: #a4c896; /* Verde suave para correcta */
  border-color: #6a9c5a;
  color: #2e4e14;
  font-weight: 700;
}

.opcion.incorrecta {
  background-color: #d87a7a; /* Rojo suave para incorrecta */
  border-color: #a64545;
  color: #5a1a1a;
  font-weight: 700;
}

.oculto {
  display: none !important;
}

#tiempo {
  font-size: 1.1em;
  margin: 15px 0;
  color: #7a5c38;
  font-weight: 600;
}

#puntuacion {
  font-size: 1.5em;
  margin-top: 20px;
  color: #4e3e28;
  font-weight: 700;
}

/* Botones principales */
button {
  min-width: 140px;
  box-shadow: 0 2px 8px rgba(122, 92, 56, 0.3);
}

button:disabled {
  cursor: default;
  background-color: #e1d7c2;
  color: #a3957b;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 480px) {
  #menuPrincipal, #cuestionario {
    margin: 30px 10px;
    padding: 20px;
  }
  
  .opcion {
    max-width: 95%;
    font-size: 1em;
  }
}
