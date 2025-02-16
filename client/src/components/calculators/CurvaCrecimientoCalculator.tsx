import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calcularPercentilOMS, WHO_GROWTH_DATA } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Transformar datos de WHO_GROWTH_DATA para la gráfica
const chartData = Array.from({ length: 23 }, (_, i) => {
  const week = i + 20;
  const data = {
    semana: week,
    p3: 0,
    p10: 0,
    p50: 0,
    p90: 0,
    p97: 0,
  };

  const weekData = WHO_GROWTH_DATA[week as keyof typeof WHO_GROWTH_DATA];
  if (weekData) {
    data.p3 = weekData.p3;
    data.p10 = weekData.p10;
    data.p50 = weekData.p50;
    data.p90 = weekData.p90;
    data.p97 = weekData.p97;
  }

  return data;
});

export default function CurvaCrecimientoCalculator() {
  const [result, setResult] = useState<{ percentil: string; clasificacion: string } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ semana: number; peso: number } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.curvaCrecimiento),
    defaultValues: {
      semanasGestacion: 20,
      pesoFetal: 500,
    },
  });

  const onSubmit = async (data: { semanasGestacion: number; pesoFetal: number }) => {
    try {
      const resultado = calcularPercentilOMS(data.semanasGestacion, data.pesoFetal);
      setResult(resultado);
      setCurrentPoint({ semana: data.semanasGestacion, peso: data.pesoFetal });

      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "curvaCrecimiento",
          input: JSON.stringify(data),
          result: JSON.stringify(resultado),
        }),
      });
    } catch (error) {
      console.error("Error en el cálculo:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Esta calculadora utiliza los estándares de crecimiento fetal de la OMS
          para evaluar el peso según la edad gestacional.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="semanasGestacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semanas de Gestación (20-42)</FormLabel>
                <Input
                  type="number"
                  min="20"
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
            name="pesoFetal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso Fetal (gramos)</FormLabel>
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

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Evaluar Crecimiento
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Curva de Crecimiento Fetal</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="semana" 
                    label={{ value: 'Semanas de Gestación', position: 'bottom' }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Peso Fetal (g)', 
                      angle: -90, 
                      position: 'insideLeft'
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="p3" 
                    stroke="#ff0000" 
                    name="Percentil 3" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="p10" 
                    stroke="#ff9900" 
                    name="Percentil 10" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="p50" 
                    stroke="#00ff00" 
                    name="Percentil 50" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="p90" 
                    stroke="#ff9900" 
                    name="Percentil 90" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="p97" 
                    stroke="#ff0000" 
                    name="Percentil 97" 
                    dot={false}
                  />
                  {currentPoint && (
                    <ReferenceDot
                      x={currentPoint.semana}
                      y={currentPoint.peso}
                      r={6}
                      fill="#8884d8"
                      stroke="none"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="font-medium">Resultado:</p>
              <p>Percentil: <span className="font-medium">{result.percentil}</span></p>
              <p>Clasificación: <span className="font-medium">{result.clasificacion}</span></p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}