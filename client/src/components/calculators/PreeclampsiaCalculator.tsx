import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculatePreeclampsiaRisk } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CalculationHistory } from "@/components/CalculationHistory";

const ethnicityOptions = [
  { value: 'caucasica', label: 'Caucásica' },
  { value: 'afro', label: 'Afro-caribeña' },
  { value: 'sudasiatica', label: 'Sud-asiática' },
  { value: 'asiaticooriental', label: 'Asiático-oriental' },
  { value: 'mixta', label: 'Mixta' },
];

const conceptionOptions = [
  { value: 'spontaneous', label: 'Espontánea' },
  { value: 'ovulation', label: 'Inducción de ovulación' },
  { value: 'ivf', label: 'FIV' },
];

type PreeclampsiaInput = {
  age: number;
  weight: number;
  height: number;
  ethnicity: "caucasica" | "afro" | "sudasiatica" | "asiaticooriental" | "mixta";
  familyHistory: boolean;
  conceptionMethod: "spontaneous" | "ovulation" | "ivf";
  multiplePregnancy: boolean;
  chronicHypertension: boolean;
  diabetesType1: boolean;
  diabetesType2: boolean;
  lupusAPS: boolean;
  nulliparous: boolean;
  previousPreeclampsia: boolean;
  meanArterialPressure: number;
  uterinePI?: number;
  measurementDate: Date;
  crownRumpLength: number;
  pappA?: number;
  plgf?: number;
};

export default function PreeclampsiaCalculator() {
  const [result, setResult] = useState<{
    riskRatio: number;
    category: string;
    recommendation: string;
    map: number;
  } | null>(null);

  const form = useForm<PreeclampsiaInput>({
    resolver: zodResolver(calculatorTypes.preeclampsia),
    defaultValues: {
      age: 26,
      weight: 60,
      height: 170,
      ethnicity: 'caucasica',
      familyHistory: false,
      conceptionMethod: 'spontaneous',
      multiplePregnancy: false,
      chronicHypertension: false,
      diabetesType1: false,
      diabetesType2: false,
      lupusAPS: false,
      nulliparous: false,
      previousPreeclampsia: false,
      meanArterialPressure: 85,
      measurementDate: new Date(),
      crownRumpLength: 65,
    },
  });

  const onSubmit = async (data: PreeclampsiaInput) => {
    const resultado = calculatePreeclampsiaRisk(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "preeclampsia",
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
      <div className="flex justify-between items-center">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Esta calculadora utiliza el modelo de la Fetal Medicine Foundation para evaluar
            el riesgo de preeclampsia en el primer trimestre.
          </AlertDescription>
        </Alert>
        <CalculationHistory calculatorType="preeclampsia" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Características Maternas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad (años)</FormLabel>
                    <Input
                      type="number"
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

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
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
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen racial</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione origen racial" />
                      </SelectTrigger>
                      <SelectContent>
                        {ethnicityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
                name="conceptionMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de concepción</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione método" />
                      </SelectTrigger>
                      <SelectContent>
                        {conceptionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="familyHistory"
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
                      Historia familiar de preeclampsia
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="multiplePregnancy"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex items-center justify-center"
                    >
                      {field.value && <span className="text-[10px] font-bold">X</span>}
                    </Checkbox>
                    <FormLabel className="font-normal">Embarazo múltiple</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Historia Médica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chronicHypertension"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex items-center justify-center"
                    >
                      {field.value && <span className="text-[10px] font-bold">X</span>}
                    </Checkbox>
                    <FormLabel className="font-normal">Hipertensión crónica</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diabetesType1"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex items-center justify-center"
                    >
                      {field.value && <span className="text-[10px] font-bold">X</span>}
                    </Checkbox>
                    <FormLabel className="font-normal">Diabetes tipo I</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diabetesType2"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex items-center justify-center"
                    >
                      {field.value && <span className="text-[10px] font-bold">X</span>}
                    </Checkbox>
                    <FormLabel className="font-normal">Diabetes tipo II</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lupusAPS"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex items-center justify-center"
                    >
                      {field.value && <span className="text-[10px] font-bold">X</span>}
                    </Checkbox>
                    <FormLabel className="font-normal">LES/SAF</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Historia Obstétrica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nulliparous"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex items-center justify-center"
                    >
                      {field.value && <span className="text-[10px] font-bold">X</span>}
                    </Checkbox>
                    <FormLabel className="font-normal">Nulípara</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previousPreeclampsia"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex items-center justify-center"
                    >
                      {field.value && <span className="text-[10px] font-bold">X</span>}
                    </Checkbox>
                    <FormLabel className="font-normal">Preeclampsia previa</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Mediciones Biofísicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meanArterialPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presión Arterial Media (mmHg)</FormLabel>
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
                name="crownRumpLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitud Cráneo-Rabadilla (mm)</FormLabel>
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
                name="uterinePI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP medio arterias uterinas</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Marcadores Bioquímicos (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pappA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAPP-A (MoM)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plgf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PlGF (pg/mL)</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Calcular Riesgo
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Resultado:</h3>
            <div className="space-y-2">
              <p>
                Riesgo de Preeclampsia:{" "}
                <span className="font-medium">1/{result.riskRatio}</span>
              </p>
              <p>
                Presión Arterial Media:{" "}
                <span className="font-medium">{Math.round(result.map)} mmHg</span>
              </p>
              <p>
                Categoría de Riesgo:{" "}
                <span className="font-medium">{result.category}</span>
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