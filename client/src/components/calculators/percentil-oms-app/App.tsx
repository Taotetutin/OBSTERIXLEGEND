import React, { useState } from 'react';
import { CalculatorHeader } from './components/CalculatorHeader';
import { InputField } from './components/InputField';
import { ResultDisplay } from './components/ResultDisplay';
import { calcularPercentil } from './utils/calculations';

function App() {
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  const [gestationalDays, setGestationalDays] = useState('');
  const [fetalWeight, setFetalWeight] = useState('');
  const [result, setResult] = useState('');

  const handleCalculate = () => {
    const resultado = calcularPercentil(
      parseInt(gestationalWeeks),
      parseInt(gestationalDays),
      parseInt(fetalWeight)
    );
    setResult(resultado);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <CalculatorHeader />

        <div className="space-y-4">
          <InputField
            id="gestationalWeeks"
            label="Edad Gestacional (Semanas):"
            value={gestationalWeeks}
            onChange={(e) => setGestationalWeeks(e.target.value)}
            min="14"
            max="40"
          />

          <InputField
            id="gestationalDays"
            label="Edad Gestacional (Días):"
            value={gestationalDays}
            onChange={(e) => setGestationalDays(e.target.value)}
            min="0"
            max="6"
          />

          <InputField
            id="fetalWeight"
            label="Peso Fetal (gramos):"
            value={fetalWeight}
            onChange={(e) => setFetalWeight(e.target.value)}
          />

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Calcular Percentil
          </button>

          <ResultDisplay result={result} />
        </div>
      </div>
      
      <footer className="mt-8 text-center text-blue-600">
        Todos los derechos reservados a MiMaternoFetal.cl
      </footer>
    </div>
  );
}

export default App;