import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, UserPlus, Calculator } from "lucide-react";
import { calculatorTypes, insertPatientSchema } from "@shared/schema";
import { calculateGestationalAge } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

type Result = {
  weeks: number;
  days: number;
  method: string;
  estimatedLMP?: Date;
};

export default function GestationalAgeCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const calculatorForm = useForm({
    resolver: zodResolver(calculatorTypes.gestationalAge),
    defaultValues: {
      ultrasoundDate: new Date(),
      crownRumpLength: undefined,
      dbp: undefined,
      femurLength: undefined,
      abdominalCircumference: undefined,
    },
  });

  const patientForm = useForm({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      name: "",
      lastPeriodDate: new Date(),
      dueDate: new Date(),
    },
  });

  const onCalculatorSubmit = async (data: any) => {
    const gestationalAge = calculateGestationalAge(data);
    setResult(gestationalAge);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "gestationalAge",
          input: JSON.stringify(data),
          result: JSON.stringify(gestationalAge),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  const onPatientSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Paciente registrado",
          description: "Los datos del paciente se han guardado correctamente.",
        });
        patientForm.reset();
      } else {
        throw new Error("Error al guardar el paciente");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el paciente. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculadora
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Registro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-600">
                Calculadora de Edad Gestacional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="crl">
                <TabsList className="grid w-full grid-cols-3 bg-blue-50">
                  <TabsTrigger value="crl" className="data-[state=active]:bg-blue-200">
                    ≤14 sem
                  </TabsTrigger>
                  <TabsTrigger value="segundo" className="data-[state=active]:bg-blue-200">
                    14-20 sem
                  </TabsTrigger>
                  <TabsTrigger value="tercer" className="data-[state=active]:bg-blue-200">
                    &gt;20 sem
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crl">
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <AlertDescription>
                      Para cálculo en primer trimestre (≤14 semanas)
                    </AlertDescription>
                  </Alert>

                  <Form {...calculatorForm}>
                    <form onSubmit={calculatorForm.handleSubmit(onCalculatorSubmit)} className="space-y-4">
                      <FormField
                        control={calculatorForm.control}
                        name="ultrasoundDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de la ecografía</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Seleccione una fecha</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={calculatorForm.control}
                        name="crownRumpLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitud Cráneo-Caudal (mm)</FormLabel>
                            <Input
                              type="number"
                              step="0.1"
                              className="border-blue-200 focus:border-blue-400"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Calcular
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="segundo">
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <AlertDescription>
                      Para cálculo entre 14-20 semanas. Se requieren DBP y FL.
                    </AlertDescription>
                  </Alert>
                  <Form {...calculatorForm}>
                    <form onSubmit={calculatorForm.handleSubmit(onCalculatorSubmit)} className="space-y-4">
                      <FormField
                        control={calculatorForm.control}
                        name="ultrasoundDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de la ecografía</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Seleccione una fecha</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={calculatorForm.control}
                          name="dbp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Diámetro Biparietal (mm)</FormLabel>
                              <Input
                                type="number"
                                step="0.1"
                                className="border-blue-200 focus:border-blue-400"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={calculatorForm.control}
                          name="femurLength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitud Femoral (mm)</FormLabel>
                              <Input
                                type="number"
                                step="0.1"
                                className="border-blue-200 focus:border-blue-400"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Calcular
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="tercer">
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <AlertDescription>
                      Para cálculo después de 20 semanas. Se requieren las tres medidas.
                    </AlertDescription>
                  </Alert>
                  <Form {...calculatorForm}>
                    <form onSubmit={calculatorForm.handleSubmit(onCalculatorSubmit)} className="space-y-4">
                      <FormField
                        control={calculatorForm.control}
                        name="ultrasoundDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de la ecografía</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Seleccione una fecha</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={calculatorForm.control}
                          name="dbp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Diámetro Biparietal (mm)</FormLabel>
                              <Input
                                type="number"
                                step="0.1"
                                className="border-blue-200 focus:border-blue-400"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={calculatorForm.control}
                          name="femurLength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitud Femoral (mm)</FormLabel>
                              <Input
                                type="number"
                                step="0.1"
                                className="border-blue-200 focus:border-blue-400"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={calculatorForm.control}
                        name="abdominalCircumference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Circunferencia Abdominal (mm)</FormLabel>
                            <Input
                              type="number"
                              step="0.1"
                              className="border-blue-200 focus:border-blue-400"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                              }
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Calcular
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>

              {result && (
                <Card className="mt-6 border-2 border-blue-100">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">Resultado:</h3>
                    <div className="space-y-2">
                      <p>
                        Edad Gestacional:{" "}
                        <span className="font-medium text-blue-700">
                          {result.weeks} semanas y {result.days} días
                        </span>
                      </p>
                      <p>
                        Método: <span className="font-medium text-blue-700">{result.method}</span>
                      </p>
                      {result.estimatedLMP && (
                        <p>
                          FUR estimada:{" "}
                          <span className="font-medium text-blue-700">
                            {format(result.estimatedLMP, "PPP", { locale: es })}
                          </span>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-600">
                Registro de Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...patientForm}>
                <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-4">
                  <FormField
                    control={patientForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Paciente</FormLabel>
                        <Input
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={patientForm.control}
                    name="lastPeriodDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Última Regla</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Registrar Paciente
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}