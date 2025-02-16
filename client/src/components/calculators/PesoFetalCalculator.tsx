import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculatePesoFetal } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PesoFetalCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.pesoFetal),
    defaultValues: {
      dbp: 0,
      cc: 0,
      ca: 0,
      lf: 0,
    },
  });

  const onSubmit = async (data: { dbp: number; cc: number; ca: number; lf: number }) => {
    if (Object.values(data).some(value => value === 0)) {
      return;
    }

    const resultado = calculatePesoFetal(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "pesoFetal",
          input: JSON.stringify(data),
          result: JSON.stringify({ peso: resultado }), // Send only the weight
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    field.onChange(value);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="dbp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diámetro Biparietal (mm)</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...field}
                  onChange={(e) => handleInputChange(e, field)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Circunferencia Cefálica (mm)</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...field}
                  onChange={(e) => handleInputChange(e, field)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Circunferencia Abdominal (mm)</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...field}
                  onChange={(e) => handleInputChange(e, field)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud Femoral (mm)</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...field}
                  onChange={(e) => handleInputChange(e, field)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={Object.values(form.getValues()).every(value => value === 0)}
          >
            Calcular
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
            <p>
              Peso Fetal Estimado:{" "}
              <span className="font-medium">{result} gramos</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}