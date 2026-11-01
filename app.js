//  1.VARIABLES GLOBALES Y ESTADO

let tareas = [];
let filtroActual = 'todas';
let busquedaActual = '';
let ordenActual = 'fecha';

       // Referencias al DOM
const formTarea = document.getElementById('form-tarea');
const inputTitulo = document.getElementById('input-titulo');
const selectPrioridad = document.getElementById('select-prioridad');
const contenedorTareas = document.getElementById('contenedor-tareas');
const inputBusqueda = document.getElementById('input-busqueda');
const selectOrden = document.getElementById('select-orden');
const btnFiltros = document.querySelectorAll('.btn-filtro');
const mensajeError = document.getElementById('mensaje-error');

       // Elementos del Dashboard
const uiTotal = document.getElementById('total-tareas');
const uiPendientes = document.getElementById('tareas-pendientes');
const uiCompletadas = document.getElementById('tareas-completadas');


// 2. EVENTO PERSONALIZADO (OPCIÓN B INVESTIGACION)
// Creamos un CustomEvent para actualizar el dashboard de forma reactiva

const eventoActualizarDashboard = new CustomEvent('tareasActualizadas');

document.addEventListener('tareasActualizadas', () => {
    uiTotal.textContent = tareas.length;
    uiPendientes.textContent = tareas.filter(t => !t.completed).length;
    uiCompletadas.textContent = tareas.filter(t => t.completed).length;
});


// 3. INICIALIZACIÓN Y API

document.addEventListener('DOMContentLoaded', async () => {
    const datosLocales = localStorage.getItem('misTareas');
    
    if (datosLocales) {
        // Si hay datos en localStorage, los cargamos
        tareas = JSON.parse(datosLocales);
        renderizarTareas();
        document.dispatchEvent(eventoActualizarDashboard);
    } else {
        // Si no hay datos, consultamos la API

        await cargarDesdeAPI();
    }
});

async function cargarDesdeAPI() {
    try {
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/todos');
        if (!respuesta.ok) throw new Error('Error al conectar con la API');
        
        const datosAPI = await respuesta.json();
        
        // Tomamos solo los primeros 10 para no saturar la pantalla y los adaptamos a nuestro formato

        tareas = datosAPI.slice(0, 10).map(tarea => ({
            id: tarea.id,
            titulo: tarea.title,
            completed: tarea.completed,
            prioridad: 'Media', // Prioridad por defecto
            fecha: new Date().toISOString()
        }));

        guardarEnLocalStorage();
        renderizarTareas();
    } catch (error) {
        // Manejo de errores visual
        mensajeError.textContent = "⚠️ " + error.message + ". Trabajando en modo offline.";
        mensajeError.classList.remove('error-oculto');
    }
}


// 4. PERSISTENCIA (LOCALSTORAGE)

function guardarEnLocalStorage() {
    localStorage.setItem('misTareas', JSON.stringify(tareas));
    // Disparamos el evento personalizado para actualizar el dashboard
    document.dispatchEvent(eventoActualizarDashboard);
}

// ==========================================
// 5. CRUD Y RENDERIZADO
// ==========================================
formTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titulo = inputTitulo.value.trim();
    // Validación estricta de campos vacíos
    if (titulo === '') {
        alert('El título de la tarea no puede estar vacío.');
        return;
    }

    const nuevaTarea = {
        id: Date.now(), // Generamos un ID único
        titulo: titulo,
        completed: false,
        prioridad: selectPrioridad.value,
        fecha: new Date().toISOString()
    };

    tareas.push(nuevaTarea);
    guardarEnLocalStorage();
    renderizarTareas();
    formTarea.reset();
});

function renderizarTareas() {
    contenedorTareas.innerHTML = '';

    // 1. Filtrar por estado
    let tareasFiltradas = tareas;
    if (filtroActual === 'pendientes') tareasFiltradas = tareas.filter(t => !t.completed);
    if (filtroActual === 'completadas') tareasFiltradas = tareas.filter(t => t.completed);

    // 2. Filtrar por búsqueda (Título)
    if (busquedaActual !== '') {
        tareasFiltradas = tareasFiltradas.filter(t => 
            t.titulo.toLowerCase().includes(busquedaActual.toLowerCase())
        );
    }

    // 3. Ordenar
    if (ordenActual === 'fecha') {
        tareasFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (ordenActual === 'prioridad') {
        const pesoPrioridad = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
        tareasFiltradas.sort((a, b) => pesoPrioridad[a.prioridad] - pesoPrioridad[b.prioridad]);
    }

    // 4. Renderizar en el DOM
    if (tareasFiltradas.length === 0) {
        contenedorTareas.innerHTML = '<li style="text-align:center; padding:20px;">No hay tareas para mostrar.</li>';
        return;
    }

    tareasFiltradas.forEach(tarea => {
        const li = document.createElement('li');
        li.className = `tarea-item prioridad-${tarea.prioridad} ${tarea.completed ? 'completada' : ''}`;
        
        li.innerHTML = `
            <div class="tarea-info">
                <span class="tarea-titulo">${tarea.titulo}</span>
                <span class="tarea-detalles">Prioridad: ${tarea.prioridad}</span>
            </div>
            <div class="acciones">
                <button class="btn-accion" onclick="toggleCompletada(${tarea.id})" title="Completar">
                    ${tarea.completed ? '↩️' : '✅'}
                </button>
                <button class="btn-accion" onclick="editarTarea(${tarea.id})" title="Editar">✏️</button>
                <button class="btn-accion" onclick="eliminarTarea(${tarea.id})" title="Eliminar">🗑️</button>
            </div>
        `;
        contenedorTareas.appendChild(li);
    });
}

// Funciones CRUD
window.toggleCompletada = (id) => {
    tareas = tareas.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    guardarEnLocalStorage();
    renderizarTareas();
};

window.editarTarea = (id) => {
    const tarea = tareas.find(t => t.id === id);
    const nuevoTitulo = prompt('Editar título de la tarea:', tarea.titulo);
    if (nuevoTitulo !== null && nuevoTitulo.trim() !== '') {
        tarea.titulo = nuevoTitulo.trim();
        guardarEnLocalStorage();
        renderizarTareas();
    }
};

window.eliminarTarea = (id) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        tareas = tareas.filter(t => t.id !== id);
        guardarEnLocalStorage();
        renderizarTareas();
    }
};

// ==========================================
// 6. EVENTOS DE FILTROS Y BÚSQUEDA
// ==========================================
btnFiltros.forEach(btn => {
    btn.addEventListener('click', (e) => {
        btnFiltros.forEach(b => b.classList.remove('activo'));
        e.target.classList.add('activo');
        filtroActual = e.target.dataset.filtro;
        renderizarTareas();
    });
});

inputBusqueda.addEventListener('input', (e) => {
    busquedaActual = e.target.value;
    renderizarTareas();
});

selectOrden.addEventListener('change', (e) => {
    ordenActual = e.target.value;
    renderizarTareas();
});