// Datos de emisiones de CO₂ (kg por km)
const emissionRates = {
    car: 0.12, // Automóvil
    plane: 0.25, // Avión
    train: 0.04, // Tren
    bus: 0.06 // Autobús
};

// Factores de equivalencia
const equivalenceRates = {
    netflix: 0.036, // CO₂ por hora de streaming en kg
    treeAbsorption: 22 // CO₂ absorbido por árbol en un año en kg
};

// Función para calcular emisiones y mostrar leyenda y gráficos
function calculateEmission() {
    const transport = document.getElementById("transport").value;
    const distanceInput = document.getElementById("distance");
    const distance = parseFloat(distanceInput.value);

    if (isNaN(distance) || distance <= 0) {
        displayLegend(null, null);
        clearCharts();
        return;
    }

    const emission = emissionRates[transport] * distance;

    // Muestra la leyenda interactiva con equivalencias
    displayLegend(transport, emission, distance);

    // Genera gráficos
    displayChart(transport, emission);
    displayComparisonChart(transport, distance);
}

// Función para mostrar leyenda interactiva con equivalencias
function displayLegend(transport, emission, distance) {
    const legendDiv = document.getElementById("emissionLegend");
    if (transport && emission) {
        const netflixHours = (emission / equivalenceRates.netflix).toFixed(1);
        const treeYears = (emission / equivalenceRates.treeAbsorption).toFixed(2);
        const bikeDistance = distance;

        legendDiv.innerHTML = `
            <h4>Impacto Ambiental de ${getTransportName(transport)}</h4>
            <p>Distancia: ${distance} km</p>
            <p>Emisiones de CO₂ estimadas: ${emission.toFixed(2)} kg</p>
            <h5>Equivalencias</h5>
            <ul>
                <li>📺 Esto equivale a ${netflixHours} horas de streaming en Netflix.</li>
                <li>🌳 Serían necesarios ${treeYears} años de absorción de CO₂ por un árbol.</li>
                <li>🚴 Distancia en bicicleta: ${bikeDistance} km.</li>
            </ul>
        `;
    } else {
        legendDiv.innerHTML = `<p>Por favor, ingresa una distancia válida.</p>`;
    }
}

// Función para obtener color según el nivel de emisiones
function getColorForEmission(emission) {
    if (emission < 10) return '#4CAF50'; // Verde para bajas emisiones
    if (emission < 50) return '#FFC107'; // Amarillo para emisiones moderadas
    return '#F44336'; // Rojo para emisiones altas
}

// Gráfico del transporte seleccionado
function displayChart(transport, emission) {
    const ctx = document.getElementById("emissionChart").getContext("2d");

    // Destruir gráfico previo si existe
    if (window.emissionChart && typeof window.emissionChart.destroy === "function") {
        window.emissionChart.destroy();
    }

    // Crear gráfico solo para el transporte seleccionado con color basado en el nivel de emisiones
    window.emissionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [getTransportName(transport)],
            datasets: [{
                label: 'Emisiones de CO₂ (kg)',
                data: [emission],
                backgroundColor: getColorForEmission(emission)
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Gráfico comparativo entre transportes
function displayComparisonChart(selectedTransport, distance) {
    const ctx = document.getElementById("comparisonChart").getContext("2d");

    const emissions = Object.keys(emissionRates).map(transport => emissionRates[transport] * distance);

    const backgroundColors = emissions.map(emission => getColorForEmission(emission));

    if (window.comparisonChart && typeof window.comparisonChart.destroy === "function") {
        window.comparisonChart.destroy();
    }

    window.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(emissionRates).map(getTransportName),
            datasets: [{
                label: 'Emisiones de CO₂ (kg)',
                data: emissions,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para obtener nombre legible del transporte
function getTransportName(transport) {
    const names = {
        car: "Automóvil",
        plane: "Avión",
        train: "Tren",
        bus: "Autobús"
    };
    return names[transport] || transport;
}

function resetForm() {
    // Restablece el campo de distancia a vacío
    document.getElementById("distance").value = '';
    // Borra el contenido de la leyenda
    document.getElementById("emissionLegend").innerHTML = '';
    // Borra los gráficos llamando a clearCharts
    clearCharts();
}

// Función para limpiar los gráficos
function clearCharts() {
    if (window.emissionChart && typeof window.emissionChart.destroy === "function") {
        window.emissionChart.destroy();
    }
    if (window.comparisonChart && typeof window.comparisonChart.destroy === "function") {
        window.comparisonChart.destroy();
    }
}

// Event listeners para calcular en tiempo real
document.getElementById("transport").addEventListener("change", calculateEmission);
document.getElementById("distance").addEventListener("input", calculateEmission);

