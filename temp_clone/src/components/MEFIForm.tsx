import React from 'react';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MEFIForm({ formData, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-blue-700">
          Frecuencia Cardíaca Basal
        </label>
        <select
          name="fcb"
          value={formData.fcb}
          onChange={onChange}
          className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="normal">Normal (110-160 lpm)</option>
          <option value="taquicardia">Taquicardia (&gt; 160 lpm por &gt;10 min)</option>
          <option value="bradicardia_leve">Bradicardia Leve (100-110 lpm)</option>
          <option value="bradicardia_moderada">Bradicardia Moderada (80-100 lpm)</option>
          <option value="bradicardia_severa">Bradicardia Severa (&lt; 80 lpm por &gt;3 min)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-700">
          Variabilidad
        </label>
        <select
          name="variabilidad"
          value={formData.variabilidad}
          onChange={onChange}
          className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="ausente">Ausente (&lt; 2 lpm por &gt;50 min)</option>
          <option value="minima">Mínima (2-5 lpm por &gt;50 min)</option>
          <option value="normal">Normal (6-25 lpm)</option>
          <option value="aumentada">Aumentada (&gt; 25 lpm)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-700">
          Aceleraciones
        </label>
        <select
          name="aceleraciones"
          value={formData.aceleraciones}
          onChange={onChange}
          className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="presentes">Presentes (≥ 15 lpm × 15 seg)</option>
          <option value="ausentes">Ausentes (en registro de 40-120 min)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-700">
          Desaceleraciones
        </label>
        <select
          name="desaceleraciones"
          value={formData.desaceleraciones}
          onChange={onChange}
          className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="ausentes">Ausentes</option>
          <option value="precoces">Precoces</option>
          <option value="variables">Variables recurrentes</option>
          <option value="tardias">Tardías recurrentes</option>
          <option value="prolongadas">Prolongadas (&gt; 3 min)</option>
          <option value="sinusoidal">Patrón Sinusoidal</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Clasificar
      </button>
    </form>
  );
}