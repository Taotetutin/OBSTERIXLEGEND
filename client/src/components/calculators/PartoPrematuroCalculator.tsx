import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  gestationalWeeks: z.number().min(22).max(34),
  gestationalDays: z.number().min(0).max(6),
  cervicalLength: z.number().min(0).max(50),
  fetusCount: z.number().min(1).max(3),
  hasContractions: z.boolean(),
  hasPreviousPretermBirth: z.boolean(),
  hasMembraneRupture: z.boolean(),
  hasCervicalSurgery: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function PartoPrematuroCalculator() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gestationalWeeks: 28,
      gestationalDays: 0,
      cervicalLength: 25,
      fetusCount: 1,
      hasContractions: false,
      hasPreviousPretermBirth: false,
      hasMembraneRupture: false,
      hasCervicalSurgery: false,
    },
  });

  function calculateRisk(data: FormData) {
    let riskScore = 0;

    // Base risk from cervical length
    if (data.cervicalLength < 15) riskScore += 3;
    else if (data.cervicalLength < 25) riskScore += 2;

    // Multiple gestation
    if (data.fetusCount > 1) riskScore += data.fetusCount;

    // Other risk factors
    if (data.hasContractions) riskScore += 2;
    if (data.hasPreviousPretermBirth) riskScore += 3;
    if (data.hasMembraneRupture) riskScore += 3;
    if (data.hasCervicalSurgery) riskScore += 1;

    // Risk categorization
    if (riskScore >= 8) return "Alto";
    if (riskScore >= 4) return "Moderado";
    return "Bajo";
  }

  function onSubmit(data: FormData) {
    const riskLevel = calculateRisk(data);
    setResult(riskLevel);
  }

  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gestationalWeeks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semanas de gestación</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gestationalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Días</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cervicalLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud cervical (mm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fetusCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de fetos</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasContractions"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="flex items-center justify-center"
                >
                  {field.value && <span className="text-[10px] font-bold">X</span>}
                </Checkbox>
                <FormLabel className="font-normal">
                  Presencia de contracciones
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasPreviousPretermBirth"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="flex items-center justify-center"
                >
                  {field.value && <span className="text-[10px] font-bold">X</span>}
                </Checkbox>
                <FormLabel className="font-normal">
                  Antecedente de parto prematuro previo
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasMembraneRupture"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="flex items-center justify-center"
                >
                  {field.value && <span className="text-[10px] font-bold">X</span>}
                </Checkbox>
                <FormLabel className="font-normal">
                  Antecedente de rotura de membranas
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasCervicalSurgery"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="flex items-center justify-center"
                >
                  {field.value && <span className="text-[10px] font-bold">X</span>}
                </Checkbox>
                <FormLabel className="font-normal">
                  Antecedente de cirugía cervical
                </FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Calcular Riesgo
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
            <p className="text-lg">
              Nivel de riesgo:{" "}
              <span className={`font-bold ${
                result === "Alto" ? "text-red-500" :
                result === "Moderado" ? "text-yellow-500" :
                "text-green-500"
              }`}>
                {result}
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}