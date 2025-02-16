import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type AgeRiskResult = {
  risk: number;
  interpretation: string;
  details: string;
};

// Tabla de riesgos por edad (basada en datos epidemiológicos)
const ageRiskTable: Record<number, number> = {
  20: 1525,
  25: 1340,
  30: 940,
  31: 885,
  32: 725,
  33: 535,
  34: 390,
  35: 290,
  36: 225,
  37: 170,
  38: 125,
  39: 100,
  40: 75,
  41: 60,
  42: 45,
  43: 35,
  44: 25,
  45: 20,
};

export default function AgeCalculator() {
  const [result, setResult] = useState<AgeRiskResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.t21Age),
    defaultValues: {
      age: undefined,
      previousT21: false,
    },
  });

  const onSubmit = async (data: any) => {
    let risk: number;
    const age = Math.round(data.age);

    if (age <= 20) {
      risk = 1 / 1525;
    } else if (age >= 45) {
      risk = 1 / 20;
    } else {
      const ages = Object.keys(ageRiskTable).map(Number);
      const lowerAge = ages.filter(a => a <= age).pop() || 20;
      const upperAge = ages.find(a => a > age) || 45;

      const lowerRisk = 1 / ageRiskTable[lowerAge];
      const upperRisk = 1 / ageRiskTable[upperAge];

      const t = (age - lowerAge) / (upperAge - lowerAge);
      risk = lowerRisk + t * (upperRisk - lowerRisk);
    }

    if (data.previousT21) {
      risk *= 2.5;
    }

    const resultado = {
      risk,
      interpretation: risk > (1/100) 
        ? "Alto Riesgo" 
        : risk > (1/1000) 
          ? "Riesgo Intermedio" 
          : "Bajo Riesgo",
      details: `Riesgo por edad materna de ${age} años: 1:${Math.round(1/risk)}`
    };

    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "t21Age",
          input: JSON.stringify(data),
          result: JSON.stringify(resultado),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-1">Riesgo por Edad Materna</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad Materna (años)</FormLabel>
                <Input
                  type="number"
                  className="w-full"
                  placeholder="Ingrese la edad materna"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="previousT21"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <Checkbox
                  id="previousT21"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-2 border-gray-200 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 [&>span]:data-[state=checked]:text-white"
                >
                  {field.value && <span className="text-[10px] font-bold">X</span>}
                </Checkbox>
                <FormLabel htmlFor="previousT21" className="font-normal cursor-pointer">
                  Antecedente de hijo con Trisomía 21
                </FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular Riesgo
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Resultado:</h3>
          <p className="mb-2">Riesgo estimado: 1:{Math.round(1/result.risk)}</p>
          <p className={`font-medium ${
            result.interpretation === "Alto Riesgo"
              ? "text-red-600"
              : result.interpretation === "Riesgo Intermedio"
                ? "text-amber-600"
                : "text-green-600"
          }`}>
            {result.interpretation}
          </p>
          <p className="text-sm text-gray-600 mt-2">{result.details}</p>
        </div>
      )}
    </div>
  );
}