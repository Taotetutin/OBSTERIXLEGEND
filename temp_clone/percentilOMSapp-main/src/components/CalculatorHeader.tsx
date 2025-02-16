import React from 'react';
import { Calculator } from 'lucide-react';

export const CalculatorHeader = () => {
  return (
    <div className="flex items-center justify-center mb-6">
      <Calculator className="w-8 h-8 text-blue-500 mr-2" />
      <h1 className="text-2xl font-bold text-blue-800">
        Calculadora Percentil OMS
      </h1>
    </div>
  );
};