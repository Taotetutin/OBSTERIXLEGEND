import React, { useState } from 'react';
import { InputField } from './components/InputField';
import { ResultDisplay } from './components/ResultDisplay';
import { calcularPercentil } from './utils/calculations';

export default function PercentilOMSCalculator() {
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
  );
}