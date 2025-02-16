import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculateLHR } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LHRCalculator() {
  const [result, setResult] = useState<{
    lhr: number;
    oeLHR: number;
    prognosis: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.lhr),
    defaultValues: {
      headCircumference: 0,
      lungArea: 0,
      gestationalWeeks: 24,
      side: "left" as const,
      method: "2D" as const,
    },
  });

  const onSubmit = async (data: {
    headCircumference: number;
    lungArea: number;
    gestationalWeeks: number;
    side: "left" | "right";
    method: "2D" | "3D";
  }) => {
    const resultado = calculateLHR(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "lhr",
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

          <FormField
            control={form.control}
            name="lungArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área Pulmonar (mm²)</FormLabel>
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
            name="gestationalWeeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad Gestacional (semanas)</FormLabel>
                <Input
                  type="number"
                  min="20"
                  max="40"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lado Afectado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione lado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Izquierdo</SelectItem>
                      <SelectItem value="right">Derecho</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2D">2D</SelectItem>
                      <SelectItem value="3D">3D</SelectItem>
                    </SelectContent>
                  </Select>
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
                LHR: <span className="font-medium">{result.lhr}</span>
              </p>
              <p>
                o/e LHR: <span className="font-medium">{result.oeLHR}</span>
              </p>
              <p>
                Pronóstico:{" "}
                <span className="font-medium">{result.prognosis}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}