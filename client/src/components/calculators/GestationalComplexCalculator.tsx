import { useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Search } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Patient } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GestationalResult = {
  gestationalAge: { weeks: number; days: number };
  conceptionDate: Date;
  dueDate: Date;
  week20: Date;
  week30: Date;
  week34: Date;
  screening: {
    firstTrimester: string;
    secondTrimester: string;
    secondTrimesterExams: string;
    dtpaVaccine: string;
    thirdTrimesterExams: string;
    thirdTrimesterScreening: string;
    gbsTest: string;
  };
};

function getGestationalAge(startDate: Date, endDate: Date) {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    weeks: Math.floor(diffDays / 7),
    days: diffDays % 7,
  };
}

export default function GestationalComplexCalculator() {
  const [result, setResult] = useState<GestationalResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Query para buscar pacientes
  const { data: searchResults } = useQuery({
    queryKey: ['/api/patients', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Error buscando pacientes');
      return response.json() as Promise<Patient[]>;
    },
    enabled: searchTerm.length > 2
  });

  // Query para obtener todos los pacientes ordenados
  const { data: allPatients } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: async () => {
      const response = await fetch('/api/patients');
      if (!response.ok) throw new Error('Error obteniendo pacientes');
      return response.json() as Promise<Patient[]>;
    }
  });

  // Mutación para guardar paciente
  const saveMutation = useMutation({
    mutationFn: async (patient: { 
      firstName: string;
      lastName: string;
      identification: string;
      lastPeriodDate: Date 
    }) => {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
      });
      if (!response.ok) throw new Error('Error guardando paciente');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    }
  });

  const calculatorForm = useForm({
    defaultValues: {
      lastMenstrualPeriod: new Date(),
    },
  });

  const patientForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      identification: '',
      lastMenstrualPeriod: new Date(),
    },
  });

  const calculateDates = (lastMenstrualPeriod: Date) => {
    const today = new Date();
    const gestationalAge = getGestationalAge(lastMenstrualPeriod, today);
    const conceptionDate = addDays(lastMenstrualPeriod, 14);
    const dueDate = addDays(lastMenstrualPeriod, 280);
    const week20 = addDays(lastMenstrualPeriod, 140);
    const week30 = addDays(lastMenstrualPeriod, 210);
    const week34 = addDays(lastMenstrualPeriod, 238);

    return {
      gestationalAge,
      conceptionDate,
      dueDate,
      week20,
      week30,
      week34,
      screening: {
        firstTrimester: `${format(addDays(lastMenstrualPeriod, 77), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 97), 'dd/MM/yyyy', { locale: es })}`,
        secondTrimester: `${format(addDays(lastMenstrualPeriod, 140), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 168), 'dd/MM/yyyy', { locale: es })}`,
        secondTrimesterExams: `${format(addDays(lastMenstrualPeriod, 175), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 189), 'dd/MM/yyyy', { locale: es })}`,
        dtpaVaccine: format(addDays(lastMenstrualPeriod, 196), 'dd/MM/yyyy', { locale: es }),
        thirdTrimesterExams: `${format(addDays(lastMenstrualPeriod, 224), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 238), 'dd/MM/yyyy', { locale: es })}`,
        thirdTrimesterScreening: `${format(addDays(lastMenstrualPeriod, 238), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 259), 'dd/MM/yyyy', { locale: es })}`,
        gbsTest: `${format(addDays(lastMenstrualPeriod, 245), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 259), 'dd/MM/yyyy', { locale: es })}`,
      },
    };
  };

  const onCalculate = (data: any) => {
    const result = calculateDates(data.lastMenstrualPeriod);
    setResult(result);
  };

  const onSavePatient = async (data: any) => {
    try {
      await saveMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        identification: data.identification,
        lastPeriodDate: data.lastMenstrualPeriod
      });
      const result = calculateDates(data.lastMenstrualPeriod);
      setResult(result);
    } catch (error) {
      console.error('Error al guardar paciente:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Calculadora gestacional completa para determinar fechas importantes del embarazo
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          <TabsTrigger value="register">Registrar Paciente</TabsTrigger>
          <TabsTrigger value="search">Buscar Paciente</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Form {...calculatorForm}>
                  <form onSubmit={calculatorForm.handleSubmit(onCalculate)} className="space-y-6">
                    <FormField
                      control={calculatorForm.control}
                      name="lastMenstrualPeriod"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base">Fecha de Última Regla (FUR)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccione una fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
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

                    <Button type="submit" className="w-full">
                      Calcular Fechas
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Form {...patientForm}>
                  <form onSubmit={patientForm.handleSubmit(onSavePatient)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={patientForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Apellidos</FormLabel>
                            <Input {...field} placeholder="Ingrese apellidos" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={patientForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Nombres</FormLabel>
                            <Input {...field} placeholder="Ingrese nombres" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={patientForm.control}
                      name="identification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Número de ID</FormLabel>
                          <Input {...field} placeholder="Ingrese número de identificación" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={patientForm.control}
                      name="lastMenstrualPeriod"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base">Fecha de Última Regla (FUR)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccione una fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
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

                    <Button type="submit" className="w-full">
                      Registrar Paciente
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Buscar por apellido o ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-gray-500">Pacientes Registradas</h3>
                    <div className="space-y-2">
                      {(searchTerm ? searchResults : allPatients)?.map((patient) => {
                        const gestationalAge = getGestationalAge(new Date(patient.lastPeriodDate), new Date());
                        return (
                          <div
                            key={patient.id}
                            className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg border cursor-pointer"
                            onClick={() => {
                              const result = calculateDates(new Date(patient.lastPeriodDate));
                              setResult(result);
                            }}
                          >
                            <div className="space-y-1">
                              <div className="font-medium">
                                {patient.lastName}, {patient.firstName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {patient.identification}
                              </div>
                            </div>
                            <div className="text-sm text-blue-600 font-medium">
                              {gestationalAge.weeks}s {gestationalAge.days}d
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {result && (
        <div className="space-y-4 mt-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Resultados Principales</h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Edad Gestacional:</span>
                  <span className="font-medium">{result.gestationalAge.weeks} semanas y {result.gestationalAge.days} días</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">FP Concepción:</span>
                  <span className="font-medium">{format(result.conceptionDate, "dd/MM/yyyy", { locale: es })}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">FP Parto:</span>
                  <span className="font-medium">{format(result.dueDate, "dd/MM/yyyy", { locale: es })}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Fechas Administrativas</h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Asignación Familiar:</span>
                  <span className="font-medium">{format(result.week20, "dd/MM/yyyy", { locale: es })}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Inscripción Isapre:</span>
                  <span className="font-medium">{format(result.week30, "dd/MM/yyyy", { locale: es })}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Licencia Prenatal:</span>
                  <span className="font-medium">{format(result.week34, "dd/MM/yyyy", { locale: es })}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Fechas Clínicas</h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Screening Ier Trim:</span>
                  <span className="font-medium">{result.screening.firstTrimester}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Screening II Trim:</span>
                  <span className="font-medium">{result.screening.secondTrimester}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Exámenes II Trim:</span>
                  <span className="font-medium">{result.screening.secondTrimesterExams}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">DTPa/Rhogam:</span>
                  <span className="font-medium">{result.screening.dtpaVaccine}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Exámenes III Trim:</span>
                  <span className="font-medium">{result.screening.thirdTrimesterExams}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Screening III Trim:</span>
                  <span className="font-medium">{result.screening.thirdTrimesterScreening}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600">Cultivo SGB:</span>
                  <span className="font-medium">{result.screening.gbsTest}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}