import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const datosPercentiles = {
  '16-19': { 50: 117.0, 95: 132.3, 99: 138.1 },
  '20-24': { 50: 121.0, 95: 136.9, 99: 143.3 },
  '25-29': { 50: 121.0, 95: 139.9, 99: 146.8 },
  '30-34': { 50: 125.0, 95: 142.9, 99: 150.5 },
  '35-38': { 50: 121.0, 95: 145.7, 99: 153.9 }
};

export default function PRCalculator() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [semanas, setSemanas] = useState("");
  const [dias, setDias] = useState("");
  const [prMedido, setPrMedido] = useState("");
  const [resultado, setResultado] = useState("");

  useEffect(() => {
    // Populate select options
    const semanasSelect = document.getElementById('semanas') as HTMLSelectElement;
    const diasSelect = document.getElementById('dias') as HTMLSelectElement;

    for (let i = 16; i <= 38; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString();
      semanasSelect.appendChild(option);
    }

    for (let i = 0; i <= 6; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString();
      diasSelect.appendChild(option);
    }

    // Initialize chart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['16-19', '20-24', '25-29', '30-34', '35-38'],
            datasets: [
              {
                label: 'Percentil 50',
                data: [117.0, 121.0, 121.0, 125.0, 121.0],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'Percentil 95',
                data: [132.3, 136.9, 139.9, 142.9, 145.7],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'Percentil 99',
                data: [138.1, 143.3, 146.8, 150.5, 153.9],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: false,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Intervalo PR (ms)'
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  function obtenerRangoEdadGestacional(edadGestacional: number) {
    if (edadGestacional >= 16 && edadGestacional < 20) return '16-19';
    if (edadGestacional >= 20 && edadGestacional < 25) return '20-24';
    if (edadGestacional >= 25 && edadGestacional < 30) return '25-29';
    if (edadGestacional >= 30 && edadGestacional < 35) return '30-34';
    if (edadGestacional >= 35 && edadGestacional <= 38) return '35-38';
    return null;
  }

  function calcularPercentilPreciso(prMedido: number, percentiles: { [key: number]: number }) {
    if (prMedido < percentiles[50]) {
      return interpolarPercentil(0, 50, percentiles[50] - 10, percentiles[50], prMedido);
    } else if (prMedido < percentiles[95]) {
      return interpolarPercentil(50, 95, percentiles[50], percentiles[95], prMedido);
    } else if (prMedido < percentiles[99]) {
      return interpolarPercentil(95, 99, percentiles[95], percentiles[99], prMedido);
    } else {
      return 99 + ((prMedido - percentiles[99]) / (percentiles[99] - percentiles[95])) * 0.9;
    }
  }

  function interpolarPercentil(p1: number, p2: number, v1: number, v2: number, vMedido: number) {
    return p1 + ((vMedido - v1) / (v2 - v1)) * (p2 - p1);
  }

  function actualizarGrafico(rangoEG: string, prMedido: number) {
    if (chartInstance.current) {
      const chart = chartInstance.current;
      const puntoMedidoIndex = chart.data.datasets.findIndex(dataset => dataset.label === 'Punto Medido');
      if (puntoMedidoIndex !== -1) {
        chart.data.datasets.splice(puntoMedidoIndex, 1);
      }

      const rangoIndex = chart.data.labels?.indexOf(rangoEG);

      chart.data.datasets.push({
        label: 'Punto Medido',
        data: Array(5).fill(null),
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
        showLine: false
      });

      if (rangoIndex !== undefined && rangoIndex !== -1) {
        chart.data.datasets[chart.data.datasets.length - 1].data[rangoIndex] = prMedido;
      }

      chart.update();
    }
  }

  function calcularPercentiles() {
    const semanasNum = parseInt(semanas);
    const diasNum = parseInt(dias);
    const prMedidoNum = parseFloat(prMedido);

    if (!semanasNum || !diasNum || !prMedidoNum) {
      setResultado("Por favor, complete todos los campos.");
      return;
    }

    const edadGestacional = semanasNum + (diasNum / 7);
    const rangoEG = obtenerRangoEdadGestacional(edadGestacional);

    if (!rangoEG) {
      setResultado("Edad gestacional fuera de rango (16-38 semanas)");
      return;
    }

    const percentilesRango = datosPercentiles[rangoEG];
    const percentilCalculado = calcularPercentilPreciso(prMedidoNum, percentilesRango);

    actualizarGrafico(rangoEG, prMedidoNum);

    setResultado(`Percentil: ${percentilCalculado.toFixed(1)}`);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <canvas ref={chartRef} />
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-gray-700 mb-2">Edad Gestacional:</label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <select
              id="semanas"
              value={semanas}
              onChange={(e) => setSemanas(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Semanas</option>
            </select>
          </div>
          <div>
            <select
              id="dias"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Días</option>
            </select>
          </div>
        </div>

        <label className="block text-gray-700 mb-2">
          Intervalo PR Medido (ms):
        </label>
        <input
          type="number"
          value={prMedido}
          onChange={(e) => setPrMedido(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          step="0.1"
          required
        />

        <button
          onClick={calcularPercentiles}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Calcular Percentiles
        </button>

        {resultado && (
          <div className="mt-4 p-4 bg-gray-50 rounded text-center font-bold">
            {resultado}
          </div>
        )}
      </div>
    </div>
  );
}