import { useState } from "react";
import { calculatorTypes } from "@shared/schema";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export default function HuesoNasalCalculator() {
  const [formData, setFormData] = useState({
    semanasGestacion: '',
    diasGestacion: '',
    huesoNasalLength: '',
    dbp: '',
    moms: '',
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gestationalAge = Number(formData.semanasGestacion) + (Number(formData.diasGestacion) / 7);
      // TODO: Implement the actual calculation logic
      const resultado = {
        percentile: "50",
        isAbnormal: false,
        recommendation: "Dentro de rangos normales",
      };
      setResult(resultado);

      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "huesoNasal",
          input: JSON.stringify(formData),
          result: JSON.stringify(resultado),
        }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Semanas</label>
            <Input
              type="number"
              name="semanasGestacion"
              value={formData.semanasGestacion}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Días</label>
            <Input
              type="number"
              name="diasGestacion"
              value={formData.diasGestacion}
              onChange={handleChange}
              min="0"
              max="6"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Longitud del Hueso Nasal (mm)
          </label>
          <Input
            type="number"
            name="huesoNasalLength"
            value={formData.huesoNasalLength}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            DBP (mm)
          </label>
          <Input
            type="number"
            name="dbp"
            value={formData.dbp}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            MoMs
          </label>
          <Input
            type="number"
            name="moms"
            value={formData.moms}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Calcular
        </Button>
      </form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Resultados:</h3>
              <p>
                Percentil: <span className="font-medium">{result.percentile}</span>
              </p>
              <p>
                Estado: <span className="font-medium">{result.isAbnormal ? "Anormal" : "Normal"}</span>
              </p>
              <p>
                Recomendación: <span className="font-medium">{result.recommendation}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
        <p className="text-sm text-blue-700">
          La ausencia o hipoplasia del hueso nasal está asociada a aneuploidías fetales.
        </p>
      </div>
    </div>
  );
}