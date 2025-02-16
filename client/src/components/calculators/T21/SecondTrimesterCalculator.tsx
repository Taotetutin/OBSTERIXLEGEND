import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type SecondTrimesterResult = {
  risk: number;
  interpretation: string;
  details: string;
};

export default function SecondTrimesterCalculator() {
  const [result, setResult] = useState<SecondTrimesterResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.t21SecondTrimester),
    defaultValues: {
      hasFirstTrimesterScreening: false,
      baselineRisk: undefined,
      nasalBone: 'normal',
      cardiacFocus: 'ausente',
      ventriculomegaly: 'ausente',
      nuchalFold: 'normal',
      shortFemur: 'normal',
      aberrantSubclavian: 'ausente',
      hyperechogenicBowel: 'ausente',
      pyelectasis: 'ausente',
    },
  });

  const onSubmit = async (data: any) => {
    let risk = 1/parseFloat(data.baselineRisk);

    // Ajustar riesgo basado en los marcadores
    const markerMultipliers: Record<string, number> = {
      nasalBone_ausente: 2.5,
      cardiacFocus_presente: 2.0,
      ventriculomegaly_presente: 2.5,
      nuchalFold_anormal: 3.0,
      shortFemur_anormal: 2.2,
      aberrantSubclavian_presente: 2.0,
      hyperechogenicBowel_presente: 2.5,
      pyelectasis_presente: 1.8
    };

    // Aplicar multiplicadores por cada marcador anormal
    Object.entries(data).forEach(([key, value]) => {
      if (value === 'ausente' || value === 'presente' || value === 'anormal') {
        const multiplier = markerMultipliers[`${key}_${value}`];
        if (multiplier) risk *= multiplier;
      }
    });

    const resultado = {
      risk,
      interpretation: risk > (1/100) 
        ? "Alto Riesgo" 
        : risk > (1/1000) 
          ? "Riesgo Intermedio" 
          : "Bajo Riesgo",
      details: `Riesgo ajustado del segundo trimestre: 1:${Math.round(1/risk)}`
    };

    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "t21SecondTrimester",
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
        <h2 className="text-xl font-semibold text-blue-700 mb-1">Sonograma Genético</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="hasFirstTrimesterScreening"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFirstTrimesterScreening"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-2 border-gray-200 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 [&>span]:data-[state=checked]:text-white"
                  >
                    {field.value && <span className="text-[10px] font-bold">X</span>}
                  </Checkbox>
                  <FormLabel htmlFor="hasFirstTrimesterScreening" className="font-normal cursor-pointer">
                    Tiene screening de primer trimestre
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baselineRisk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Riesgo Basal por Edad Materna (1/X)</FormLabel>
                  <Input
                    type="text"
                    placeholder="Ingrese el denominador del riesgo (ej: 250 para 1/250)"
                    {...field}
                  />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nasalBone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hueso Nasal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="ausente">Ausente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardiacFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foco Cardíaco Hiperecogénico</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="presente">Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ventriculomegaly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ventriculomegalia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="presente">Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nuchalFold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pliegue Nucal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="anormal">Anormal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortFemur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fémur Corto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="anormal">Anormal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aberrantSubclavian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arteria Subclavia Aberrante</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="presente">Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hyperechogenicBowel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intestino Hiperecogénico</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="presente">Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pyelectasis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pielectasia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="presente">Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular Riesgo
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
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