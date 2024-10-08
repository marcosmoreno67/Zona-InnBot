import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    // Aumentar y disminuir letra y tamaño de contenedor
    let fontSize = 1.2;
    const maxFontSize = 2.2;
    const minFontSize = 1;
    let containerWidthPercentage = 50;
    const maxContainerWidthPercentage = 100;
    const minContainerWidthPercentage = 50;

    document.getElementById('aumentarLetra').addEventListener('click', function () {
        if (fontSize < maxFontSize) {
            fontSize += 0.2;
            document.body.style.fontSize = fontSize + 'em';
            document.getElementById("nombreSelect").style.fontSize = fontSize + 'em';
        }
        if (containerWidthPercentage < maxContainerWidthPercentage) {
            containerWidthPercentage += 5;
            document.querySelector('.container').style.width = containerWidthPercentage + '%';
        }
    });

    document.getElementById('disminuirLetra').addEventListener('click', function () {
        if (fontSize > minFontSize) {
            fontSize -= 0.2;
            document.body.style.fontSize = fontSize + 'em';
            document.getElementById("nombreSelect").style.fontSize = fontSize + 'em';
        }
        if (containerWidthPercentage > minContainerWidthPercentage) {
            containerWidthPercentage -= 5;
            document.querySelector('.container').style.width = containerWidthPercentage + '%';
        }
    });

    const select = document.getElementById("nombreSelect");
    const input = document.getElementById("nombreManual");
    select.addEventListener('click', function() {
        input.value = select.value;
    });

    const preguntas = document.querySelectorAll('.pregunta');
    let preguntaActual = 0;
    document.getElementById('iniciar').addEventListener('click', function () {
        let edadInput = document.getElementById('edad').value;
        if (edadInput !== '' && !isNaN(edadInput)) {
            let edad = parseInt(edadInput, 10); // Convertir a número entero
            if (document.getElementById('nombreManual').value !== '' && edad >= 8 && edad <= 13) {
                mostrarSiguientePregunta();
            } else {
                alert('La edad debe estar entre 8 y 13.');
            }
        } else {
            alert('Por favor, ingresa una edad válida.');
        }
    });

    document.querySelectorAll('.carita').forEach(function (el) {
        el.addEventListener('click', function () {
            let input = el.closest('.pregunta').querySelector('input[type="hidden"]');
            input.value = el.getAttribute('data-value');
            mostrarSiguientePregunta();
        });
    });

    function mostrarSiguientePregunta() {
        preguntas[preguntaActual].style.display = 'none';
        preguntaActual++;

        if (preguntaActual < preguntas.length) {
            preguntas[preguntaActual].style.display = 'block';
            actualizarBarraProgreso();
        } else {
            document.getElementById('enviar').style.display = 'block';
        }
    }

    document.querySelectorAll('.Regresar').forEach(function (re) {
        re.addEventListener('click', function () {
            if (preguntaActual > 1) {
                preguntas[preguntaActual].style.display = 'none';
                preguntaActual -= 2;
                mostrarSiguientePregunta();
            }
        });
    });

    function actualizarBarraProgreso() {
        const progreso = (preguntaActual / (preguntas.length - 1)) * 100;
        document.getElementById('barra').style.width = progreso + '%';
    }
    // https://zonamark-585d0-default-rtdb.firebaseio.com/
    // https:/"zonamark-585d0.appspot.com
    // Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyA4rztw2QNuhy1FV9qoozCZkwOfz3jyLvk",
        authDomain: "zonamark-585d0.firebaseapp.com",
        projectId: "zonamark-585d0",
        storageBucket: "zonamark-585d0-default-rtdb.firebaseio.com",
        messagingSenderId: "706009012982",
        appId: "1:706009012982:web:ec38aeee29e73426602ad7"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    document.getElementById('encuesta').addEventListener('submit', function (event) {
        event.preventDefault();
        const datos = {
            userId: Date.now(),
            nombre: document.getElementById('nombreManual').value,
            edad: parseInt(document.getElementById('edad').value,10),
            pregunta1: document.querySelector('input[name="pregunta1"]').value,
            pregunta2: document.querySelector('input[name="pregunta2"]').value,
            pregunta3: document.querySelector('input[name="pregunta3"]').value,
            pregunta4: document.querySelector('input[name="pregunta4"]').value,
            pregunta5: document.querySelector('input[name="pregunta5"]').value,
            pregunta6: document.querySelector('input[name="pregunta6"]').value
        };

        // Enviar datos a Firebase
        set(ref(db, 'encuestas/' + datos.userId), datos)
            .then(() => {
                document.getElementById('enviar').style.display = 'none';
                alert('Datos guardados exitosamente');
            })
            .catch((error) => {
                alert('Error al guardar datos: ' + error.message);
            });
    });
});

document.getElementById("RecargarPag").addEventListener("click", function() {
    location.reload(true); // Recargar la página
});

document.addEventListener('DOMContentLoaded', function() {
    const nombreSelect = document.getElementById('nombreSelect');
    const nombreManual = document.getElementById('nombreManual');
    // Función para verificar si la lista de nombres está vacía

    function esListaVacia(nombres) {
        // Filtramos los nombres que no sean cadenas vacías
        const nombresValidos = nombres.filter(nombre => nombre.trim() !== "");
        // Si no hay nombres válidos, es una lista vacía
        return nombresValidos.length === 0;
    }
    // Leer archivo nombres.json usando Fetch API
    fetch('nombres.json')
        .then(response => response.json())
        .then(data => {
        const nombres    = data.nombres || [];
        if (esListaVacia(nombres)) {
        // Si el archivo está vacío, mostrar el campo de texto para         escribir el nombre
            nombreManual.style.display = 'inline-block';
            nombreSelect.style.display = 'none';
            nombreManual.required = true;
        } else {
        // Si el archivo tiene datos, llenar el select con los nombres
            nombres.forEach(nombre => {
                if (nombre.trim() !== ""){
                    const option = document.createElement('option');
                    option.value = nombre;
                    option.textContent = nombre;
                    nombreSelect.appendChild(option);
                }
            });
        }
    })
    .catch(error => {
        alert("No hay archivo con Nombres")
        nombreManual.style.display = 'inline-block';
        nombreSelect.style.display = 'none';
        nombreManual.required = true;
    });
});


function onClick(e) {
    e.preventDefault();
    grecaptcha.ready(function() {
      grecaptcha.execute('6LcF900qAAAAAH1IKHVh2hz0j5COXXEMreDE84_o', {action: 'submit'}).then(function(token) {
          alert("que hago aqui")// Add your logic to submit to your backend server here.
      });
    });
  }
