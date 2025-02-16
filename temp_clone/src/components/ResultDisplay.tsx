import React from 'react';
import { Result } from '../types';

interface Props {
  result: Result;
}

export function ResultDisplay({ result }: Props) {
  return (
    <div className="mt-8 space-y-6">
      <div className={`rounded-lg border p-6 ${result.categoryClass}`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{result.classification}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            result.categoryClass.includes('green') ? 'bg-green-200 text-green-800' :
            result.categoryClass.includes('red') ? 'bg-red-200 text-red-800' :
            'bg-yellow-200 text-yellow-800'
          }`}>
            {result.riskLevel}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4">{result.pathology}</p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Criterios diagnósticos:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {result.guidelines.map((guideline, index) => (
                <li key={index} className="text-gray-700">{guideline}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Recomendaciones:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}