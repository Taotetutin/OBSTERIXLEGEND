import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculateBishop } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dilatacionOptions = [
  { value: 0, label: "Cerrado" },
  { value: 1, label: "1-2 cm" },
  { value: 2, label: "3-4 cm" },
  { value: 3, label: "5-6 cm" },
];

const borramientoOptions = [
  { value: 0, label: "0-30%" },
  { value: 1, label: "40-50%" },
  { value: 2, label: "60-70%" },
  { value: 3, label: "≥80%" },
];

const consistenciaOptions = [
  { value: 0, label: "Firme" },
  { value: 1, label: "Intermedia" },
  { value: 2, label: "Blanda" },
];

const posicionOptions = [
  { value: 0, label: "Posterior" },
  { value: 1, label: "Media" },
  { value: 2, label: "Anterior" },
];

const estacionOptions = [
  { value: 0, label: "-3" },
  { value: 1, label: "-2" },
  { value: 2, label: "-1/0" },
  { value: 3, label: "+1/+2" },
];

export default function BishopCalculator() {
  const [result, setResult] = useState<{
    score: number;
    favorability: string;
    recommendation: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.bishop),
    defaultValues: {
      dilatacion: 0,
      borramiento: 0,
      consistencia: 0,
      posicion: 0,
      estacion: 0,
    },
  });

  const onSubmit = async (data: {
    dilatacion: number;
    borramiento: number;
    consistencia: number;
    posicion: number;
    estacion: number;
  }) => {
    const resultado = calculateBishop(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "bishop",
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
          El Test de Bishop evalúa las condiciones cervicales para determinar la probabilidad
          de éxito en la inducción del parto.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="dilatacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dilatación Cervical</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione dilatación" />
                  </SelectTrigger>
                  <SelectContent>
                    {dilatacionOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="borramiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Borramiento</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione borramiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {borramientoOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consistencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consistencia</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione consistencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {consistenciaOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="posicion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posición</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione posición" />
                  </SelectTrigger>
                  <SelectContent>
                    {posicionOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estación</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estación" />
                  </SelectTrigger>
                  <SelectContent>
                    {estacionOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Resultado:</h3>
            <div className="space-y-2">
              <p>
                Puntuación Bishop:{" "}
                <span className="font-medium">{result.score}</span>
              </p>
              <p>
                Favorabilidad:{" "}
                <span className="font-medium">{result.favorability}</span>
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