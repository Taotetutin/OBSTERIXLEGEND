import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculateWeightGain } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type WeightGainResult = {
  prePregnancyBMI: number;
  weightGain: number;
  expectedRange: {
    min: number;
    max: number;
  };
  recommendedTotal: {
    min: number;
    max: number;
  };
  status: string;
  recommendation: string;
};

export default function WeightGainCalculator() {
  const [result, setResult] = useState<WeightGainResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.weightGain),
    defaultValues: {
      prePregnancyWeight: 60,
      height: 160,
      currentWeight: 65,
      semanasGestacion: 20,
      diasGestacion: 0,
    },
  });

  const onSubmit = async (data: any) => {
    const resultado = calculateWeightGain(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "weightGain",
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
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Esta calculadora evalúa la ganancia de peso durante el embarazo según las
          recomendaciones de la OMS basadas en el IMC pregestacional.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Datos Pregestacionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prePregnancyWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Pregestacional (kg)</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <Input
                      type="number"
                      step="1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Datos Actuales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Actual (kg)</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="semanasGestacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semanas</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        max="42"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diasGestacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Días</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        max="6"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Calcular
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Resultados:</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">IMC Pregestacional:</p>
                <p className="ml-4">{result.prePregnancyBMI} kg/m²</p>
              </div>

              <div>
                <p className="font-medium">Ganancia de Peso:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Actual: {result.weightGain} kg</li>
                  <li>Esperada para la edad gestacional: {result.expectedRange.min} - {result.expectedRange.max} kg</li>
                  <li>Recomendada total: {result.recommendedTotal.min} - {result.recommendedTotal.max} kg</li>
                </ul>
              </div>

              <div>
                <p className="font-medium">Estado:</p>
                <p className={`ml-4 font-medium ${
                  result.status === "Adecuado" 
                    ? "text-green-600" 
                    : result.status === "Insuficiente" 
                      ? "text-amber-600" 
                      : "text-red-600"
                }`}>
                  {result.status}
                </p>
              </div>

              <div>
                <p className="font-medium">Recomendación:</p>
                <p className="ml-4 text-sm">{result.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
