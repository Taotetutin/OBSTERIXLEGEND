import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { FormData, Result } from './types';
import { classifyMEFI } from './utils/mefiClassifier';
import { MEFIForm } from './components/MEFIForm';
import { ResultDisplay } from './components/ResultDisplay';

function App() {
  const [formData, setFormData] = useState<FormData>({
    fcb: '',
    variabilidad: '',
    aceleraciones: '',
    desaceleraciones: ''
  });

  const [result, setResult] = useState<Result | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classification = classifyMEFI(formData);
    setResult({
      classification: classification.category,
      pathology: classification.description,
      guidelines: classification.guidelines,
      categoryClass: classification.categoryClass,
      riskLevel: classification.riskLevel,
      recommendations: classification.recommendations
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <Heart className="mx-auto h-12 w-12 text-blue-500 animate-pulse" />
              <h1 className="mt-4 text-3xl font-bold text-blue-900">
                Clasificación MEFI
              </h1>
              <p className="mt-2 text-blue-600">
                Sistema de clasificación del monitoreo electrónico fetal intraparto
              </p>
            </div>

            <MEFIForm 
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />

            {result && <ResultDisplay result={result} />}
          </div>
        </div>
        
        <footer className="mt-8 text-center text-blue-600 font-medium">
          <p>Todos los derechos reservados a MiMaternoFetal.cl</p>
        </footer>
      </div>
    </div>
  );
}

export default App;