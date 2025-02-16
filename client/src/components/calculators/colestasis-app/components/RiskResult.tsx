import React from 'react';
import { RiskAssessment } from '../utils/riskCalculator';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskResultProps {
  assessment: RiskAssessment;
}

const riskStyles = {
  bajo: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    icon: CheckCircle
  },
  mediano: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    icon: AlertCircle
  },
  alto: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: AlertTriangle
  }
};

export function RiskResult({ assessment }: RiskResultProps) {
  const style = riskStyles[assessment.level];
  const Icon = style.icon;

  return (
    <div className={`mt-8 p-6 rounded-xl shadow-lg ${style.bg} border-l-4 ${style.border}`}>
      <div className="flex items-center mb-4">
        <Icon className={`w-6 h-6 ${style.text} mr-2`} />
        <h3 className={`text-xl font-bold ${style.text}`}>
          Nivel de Riesgo: {assessment.level.toUpperCase()}
        </h3>
      </div>

      {assessment.details.length > 0 && (
        <div className="mb-4">
          <h4 className={`font-semibold mb-2 ${style.text}`}>Factores de riesgo identificados:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {assessment.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <h4 className={`font-semibold mb-2 ${style.text}`}>Recomendaciones:</h4>
        <p className="text-gray-700 leading-relaxed">{assessment.recommendations}</p>
      </div>
    </div>
  );
}