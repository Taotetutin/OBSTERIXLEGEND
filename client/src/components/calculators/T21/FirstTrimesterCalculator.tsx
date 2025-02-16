import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FirstTrimesterResult = {
  risk: number;
  interpretation: string;
  details: string;
};

export default function FirstTrimesterCalculator() {
  const [result, setResult] = useState<FirstTrimesterResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.t21FirstTrimester),
    defaultValues: {
      age: undefined,
      crownRumpLength: undefined,
      heartRate: undefined,
      nuchalTranslucency: undefined,
      nasalBone: 'normal',
      tricuspidRegurgitation: 'normal',
      ductusVenosus: 'normal',
      previousT21: false,
    },
  });

  const onSubmit = async (data: any) => {
    // TODO: Implementar el cálculo de riesgo real
    const risk = 1 / (350 * Math.exp(-0.1 * (data.age - 35)));

    const resultado = {
      risk,
      interpretation: risk > (1/100) 
        ? "Alto Riesgo" 
        : risk > (1/1000) 
          ? "Riesgo Intermedio" 
          : "Bajo Riesgo",
      details: `Riesgo combinado del primer trimestre: 1:${Math.round(1/risk)}`
    };

    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "t21FirstTrimester",
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
        <h2 className="text-xl font-semibold text-blue-700 mb-1">Marcadores Primer Trimestre</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edad Materna (años)</FormLabel>
                  <Input
                    type="number"
                    placeholder="Ingrese edad materna"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="crownRumpLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitud Cráneo-Caudal (mm)</FormLabel>
                  <Input
                    type="number"
                    placeholder="CRL entre 45-84 mm"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia Cardíaca (lpm)</FormLabel>
                  <Input
                    type="number"
                    placeholder="Latidos por minuto"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nuchalTranslucency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translucencia Nucal (mm)</FormLabel>
                  <Input
                    type="number"
                    placeholder="Medida en mm"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormItem>
              )}
            />

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
                      <SelectItem value="hipoplasico">Hipoplásico</SelectItem>
                      <SelectItem value="ausente">Ausente</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tricuspidRegurgitation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insuficiencia Tricuspídea</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="presente">Presente</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ductusVenosus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ductus Venoso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="ausente">Ausente</SelectItem>
                      <SelectItem value="reverso">Reverso</SelectItem>
                    </SelectContent>
                  </Select>
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