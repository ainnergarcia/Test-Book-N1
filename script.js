// 1. Guardamos todas las páginas en una lista
const paginas = document.querySelectorAll('.pagina');

let posicionInicialX = 0;
let posicionFinalX = 0;
let paginaActualIndex = 0; // Empezamos en la portada (índice 0)

// --- FUNCIÓN ACTUALIZAR CAPAS EN ESPACIO 3D REAL (SIN PARPADEO) ---
function actualizarCapas() {
    paginas.forEach((pagina, indice) => {
        
        // CASO 1: Páginas que ya pasaron (Giradas a la izquierda)
        if (indice < paginaActualIndex) {
            // Girada -180 grados y un poco hacia atrás en el fondo izquierdo (translateZ negativo)
            pagina.style.transform = `rotateY(-180deg) translateZ(${indice}px)`;
            pagina.style.zIndex = indice;
        } 
        
        // CASO 2: La página activa actual (La que se está leyendo)
        else if (indice === paginaActualIndex) {
            // Plana a 0 grados, pero LA TRAEMOS HACIA ADELANTE en el espacio (1px)
            // Esto obliga al navegador a renderizarla por encima de TODO lo demás, sin parpadeos
            pagina.style.transform = "rotateY(0deg) translateZ(1px)";
            pagina.style.zIndex = 100; 
        } 
        
        // CASO 3: Páginas que vienen en el futuro (Esperando a la derecha)
        else {
            // Planas a 0 grados, pero escalonadas hacia atrás (translateZ negativo)
            pagina.style.transform = `rotateY(0deg) translateZ(${-indice}px)`;
            pagina.style.zIndex = 50 - indice;
        }
        
    });
}

// Inicializamos el libro en la portada apenas carga la página web
actualizarCapas();

// --- DETECTOR DE MOVIMIENTOS ---

function empezarMovimiento(evento) {
    if (evento.type === 'mousedown') {
        evento.preventDefault(); 
    }
    posicionInicialX = evento.touches ? evento.touches[0].clientX : evento.clientX;
    posicionFinalX = posicionInicialX; 
}

function moviendoDedo(evento) {
    if (posicionInicialX === 0) return;
    posicionFinalX = evento.touches ? evento.touches[0].clientX : evento.clientX;
}

function determinarMovimiento() {
    if (posicionInicialX === 0 || posicionFinalX === 0) return;

    const distanciaRecorrida = posicionInicialX - posicionFinalX;

    // AVANZAR PÁGINA: Deslizar a la izquierda
    if (distanciaRecorrida > 50 && paginaActualIndex < paginas.length - 1) {
        paginaActualIndex++;
        actualizarCapas();
    }
    
    // RETROCEDER PÁGINA: Deslizar a la derecha
    else if (distanciaRecorrida < -50 && paginaActualIndex > 0) {
        paginaActualIndex--;
        actualizarCapas();
    }

    posicionInicialX = 0;
    posicionFinalX = 0;
}

// --- CONECTAR LOS EVENTOS AL LIBRO ---
const libro = document.getElementById('libro');

// Eventos para Celulares (Táctil)
libro.addEventListener('touchstart', empezarMovimiento);
libro.addEventListener('touchmove', moviendoDedo);
libro.addEventListener('touchend', determinarMovimiento);

// Eventos para Computadora (Mouse)
libro.addEventListener('mousedown', empezarMovimiento);
libro.addEventListener('mousemove', moviendoDedo);
window.addEventListener('mouseup', determinarMovimiento);