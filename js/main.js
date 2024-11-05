// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = 'data/tarifasCombustible.json';
let gastosJSONpath = 'data/gastosCombustible.json';
import { gastoCombustible } from './gastoCombustible.js';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // Array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    };

    // Suponiendo que los datos están en la variable gastosJSON
    gastosJSON.forEach(viaje => {
        // Obtener el año de la fecha del viaje
        const year = new Date(viaje.date).getFullYear();

        // Sumar el precioViaje al año correspondiente en aniosArray si está en el rango
        if (aniosArray.hasOwnProperty(year)) {
            aniosArray[year] += viaje.precioViaje;
        }
    });

    // Mostrar los resultados en el HTML
    for (const [year, total] of Object.entries(aniosArray)) {
        const gastoElement = document.getElementById(`gasto${year}`);
        if (gastoElement) {
            gastoElement.textContent = total.toFixed(2) + " €";
        }
    }
}

// guardar gasto introducido y actualizar datos
async function guardarGasto() {
    // a. Obtener los datos del formulario
    const vehicleType = document.getElementById('vehicle-type').value;
    const date = document.getElementById('date').value;
    const kilometers = parseFloat(document.getElementById('kilometers').value);

    // Crear el objeto GastoCombustible
    const nuevoGasto = new gastoCombustible(vehicleType, date, kilometers);

    // Cargar y recorrer las tarifas para calcular el precio del viaje
    const year = new Date(date).getFullYear();
    const tarifaAño = tarifasJSON.tarifas.find(tarifa => tarifa.anio === year);

    if (tarifaAño && tarifaAño.vehiculos[vehicleType]) {
        // Calcular el precio del viaje
        nuevoGasto.precioViaje = kilometers * tarifaAño.vehiculos[vehicleType];
    } else {
        console.error("No se encontró tarifa para el año o tipo de vehículo.");
        return;
    }

    // Mostrar el gasto en "Gastos recientes"
    const expenseList = document.getElementById('expense-list');
    const expenseItem = document.createElement('li');
    expenseItem.textContent = nuevoGasto.convertToJSON();
    expenseList.appendChild(expenseItem);

    // Actualizar el gasto total del año correspondiente
    const gastoAnualElement = document.getElementById(`gasto${year}`);
    if (gastoAnualElement) {
        const gastoActual = parseFloat(gastoAnualElement.textContent) || 0;
        gastoAnualElement.textContent = (gastoActual + nuevoGasto.precioViaje).toFixed(2);
    }

    // Limpiar el formulario
    document.getElementById('fuel-form').reset();
}

// Asigna el evento de envío del formulario
document.getElementById('fuel-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Evita la recarga de la página
    
});

