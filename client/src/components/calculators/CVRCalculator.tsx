import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculateCVR } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CVRCalculator() {
  const [result, setResult] = useState<{
    lesionVolume: number;
    cvr: number;
    risk: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.cvr),
    defaultValues: {
      length: 0,
      height: 0,
      width: 0,
      headCircumference: 0,
    },
  });

  const onSubmit = async (data: {
    length: number;
    height: number;
    width: number;
    headCircumference: number;
  }) => {
    const resultado = calculateCVR(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "cvr",
          input: JSON.stringify(data),
          result: JSON.stringify(resultado),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitud (mm)</FormLabel>
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
                  <FormLabel>Altura (mm)</FormLabel>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancho (mm)</FormLabel>
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
              name="headCircumference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Circunferencia Cefálica (mm)</FormLabel>
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

          <Button type="submit" className="w-full">
            Calcular
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p>
                Volumen de la lesión:{" "}
                <span className="font-medium">{result.lesionVolume} mm³</span>
              </p>
              <p>
                CVR: <span className="font-medium">{result.cvr}</span>
              </p>
              <p>
                Riesgo: <span className="font-medium">{result.risk}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}