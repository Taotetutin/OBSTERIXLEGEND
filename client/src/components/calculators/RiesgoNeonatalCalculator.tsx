import { useState } from "react";
import { Calculator, ChevronDown } from "lucide-react";

export default function RiesgoNeonatalCalculator() {
  const [weeks, setWeeks] = useState<number>(24);
  const [days, setDays] = useState<number>(0);

  const calculateRisk = () => {
    const gestationalAge = weeks + days / 7;

    const distressRisk = calculateDistressRisk(gestationalAge);
    const enterocolitisRisk = calculateEnterocolitisRisk(gestationalAge);
    const hemorrhageRisk = calculateHemorrhageRisk(gestationalAge);
    const sepsisRisk = calculateSepsisRisk(gestationalAge);

    document.getElementById('distress')!.textContent = distressRisk.toFixed(2) + '%';
    document.getElementById('enterocolitis')!.textContent = enterocolitisRisk.toFixed(2) + '%';
    document.getElementById('hemorrhage')!.textContent = hemorrhageRisk.toFixed(2) + '%';
    document.getElementById('sepsis')!.textContent = sepsisRisk.toFixed(2) + '%';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform hover:scale-[1.02] transition-transform duration-300">
        <div className="relative">
          <Calculator className="w-8 h-8 text-blue-400" />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="relative">
            <label htmlFor="weeks" className="block text-sm font-medium text-gray-600 mb-2">
              Semanas
            </label>
            <div className="relative">
              <select
                id="weeks"
                className="w-full bg-blue-50 border border-blue-200 text-gray-700 rounded-lg py-2.5 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value))}
              >
                {Array.from({ length: 18 }, (_, i) => i + 24).map(week => (
                  <option key={week} value={week}>{week}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="days" className="block text-sm font-medium text-gray-600 mb-2">
              Días
            </label>
            <div className="relative">
              <select
                id="days"
                className="w-full bg-blue-50 border border-blue-200 text-gray-700 rounded-lg py-2.5 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
              >
                {Array.from({ length: 7 }, (_, i) => i).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          onClick={calculateRisk}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mb-8"
        >
          Calcular Riesgo
        </button>

        <div className="bg-blue-50 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Resultados:</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Distress respiratorio:</p>
              <p id="distress" className="font-semibold text-blue-600">--%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Enterocolitis:</p>
              <p id="enterocolitis" className="font-semibold text-blue-600">--%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Hemorragia:</p>
              <p id="hemorrhage" className="font-semibold text-blue-600">--%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Sepsis:</p>
              <p id="sepsis" className="font-semibold text-blue-600">--%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateDistressRisk(gestationalAge: number): number {
  if (gestationalAge >= 38) return 2.44;
  if (gestationalAge >= 37) return 6.40;
  if (gestationalAge >= 36) return 15.74;
  if (gestationalAge >= 35) return 22.95;
  if (gestationalAge >= 34) return 29.34;
  if (gestationalAge >= 33) return 37.04;
  if (gestationalAge >= 32) return 46.45;
  if (gestationalAge >= 31) return 55.68;
  if (gestationalAge >= 30) return 64.15;
  if (gestationalAge >= 29) return 71.05;
  if (gestationalAge >= 28) return 77.36;
  if (gestationalAge >= 27) return 83.87;
  if (gestationalAge >= 26) return 87.96;
  if (gestationalAge >= 25) return 92.55;
  return 96.69;
}

function calculateEnterocolitisRisk(gestationalAge: number): number {
  if (gestationalAge >= 34.57143) return 0;
  if (gestationalAge >= 34.42857) return 0.64;
  if (gestationalAge >= 27) return 15.78 - ((gestationalAge - 27) * (15.78 - 0.64) / (34.42857 - 27));
  if (gestationalAge >= 24) return 10.02 + ((gestationalAge - 24) * (15.78 - 10.02) / 3);
  return 10.02;
}

function calculateHemorrhageRisk(gestationalAge: number): number {
  if (gestationalAge >= 30.57143) return 0;
  if (gestationalAge >= 24) return 46.3 - ((gestationalAge - 24) * 46.3 / (30.57143 - 24));
  return 46.3;
}

function calculateSepsisRisk(gestationalAge: number): number {
  if (gestationalAge >= 36.14286) return 0;
  if (gestationalAge >= 36) return 2;
  if (gestationalAge >= 35) return 1.32;
  if (gestationalAge >= 34) return 2.84;
  if (gestationalAge >= 33) return 4.25;
  if (gestationalAge >= 32) return 6.67;
  if (gestationalAge >= 31) return 7.35;
  if (gestationalAge >= 30) return 11.41;
  if (gestationalAge >= 29) return 15.63;
  if (gestationalAge >= 28) return 20.31;
  if (gestationalAge >= 27) return 25.00;
  if (gestationalAge >= 26) return 27.27;
  if (gestationalAge >= 25) return 8.22;
  if (gestationalAge >= 24.857) return 0.81;
  return 0;
}