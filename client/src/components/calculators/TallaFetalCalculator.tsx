import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

type TallaFetalInput = {
  femurLength: number;
  gestationalAge: number;
};

export default function TallaFetalCalculator() {
  const [result, setResult] = useState<{
    height: number;
    percentile: string;
    recommendation: string;
  } | null>(null);

  const form = useForm<TallaFetalInput>({
    resolver: zodResolver(calculatorTypes.tallaFetal),
    defaultValues: {
      femurLength: 0,
      gestationalAge: 0,
    },
  });

  const calculateFetalHeight = (femurLength: number): number => {
    // Fórmula de Hadlock para estimar la talla fetal basada en la longitud del fémur
    return femurLength * 0.78 + 7.15;
  };

  const getPercentileAndRecommendation = (height: number, gestationalAge: number): { percentile: string; recommendation: string } => {
    // Valores aproximados de percentiles por edad gestacional
    const p50 = gestationalAge * 1.2; // Valor aproximado del percentil 50

    if (height < p50 * 0.9) {
      return {
        percentile: "< p10",
        recommendation: "Talla fetal por debajo del percentil 10. Se recomienda seguimiento ecográfico."
      };
    } else if (height > p50 * 1.1) {
      return {
        percentile: "> p90",
        recommendation: "Talla fetal por encima del percentil 90. Control habitual."
      };
    }
    return {
      percentile: "p10-p90",
      recommendation: "Talla fetal dentro de rangos normales."
    };
  };

  const onSubmit = async (data: TallaFetalInput) => {
    const height = calculateFetalHeight(data.femurLength);
    const { percentile, recommendation } = getPercentileAndRecommendation(height, data.gestationalAge);

    const resultado = {
      height: parseFloat(height.toFixed(1)),
      percentile,
      recommendation
    };

    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "tallaFetal",
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
          Esta calculadora estima la talla fetal basada en la longitud del fémur utilizando
          la fórmula de Hadlock.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="femurLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud del Fémur (mm)</FormLabel>
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
            name="gestationalAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad Gestacional (semanas)</FormLabel>
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

          <Button type="submit" className="w-full">
            Calcular Talla Fetal
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Resultado:</h3>
            <div className="space-y-2">
              <p>
                Talla Fetal Estimada:{" "}
                <span className="font-medium">{result.height} cm</span>
              </p>
              <p>
                Percentil:{" "}
                <span className="font-medium">{result.percentile}</span>
              </p>
              <p>
                Recomendación:{" "}
                <span className="font-medium">{result.recommendation}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}