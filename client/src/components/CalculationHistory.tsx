import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, History } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function CalculationHistory({ calculatorType }: { calculatorType: string }) {
  const { data: calculations } = useQuery({
    queryKey: ["/api/calculations", calculatorType],
    queryFn: async () => {
      const response = await fetch(`/api/calculations?type=${calculatorType}`);
      if (!response.ok) throw new Error('Error fetching calculations');
      return response.json();
    },
  });

  const exportToPDF = async (calculation: any) => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculation),
      });
      
      if (!response.ok) throw new Error('Error generating PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calculo-${calculation.calculatorType}-${format(new Date(calculation.createdAt), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Historial de Cálculos</DialogTitle>
          <DialogDescription>
            Historial de cálculos realizados con esta calculadora
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {calculations?.map((calc: any) => (
            <div
              key={calc.id}
              className="mb-4 p-3 border rounded-lg space-y-2 bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-600">
                  {format(new Date(calc.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => exportToPDF(calc)}
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm">
                <strong>Entrada:</strong>{" "}
                {JSON.stringify(JSON.parse(calc.input), null, 2)}
              </div>
              <div className="text-sm">
                <strong>Resultado:</strong>{" "}
                {JSON.stringify(JSON.parse(calc.result), null, 2)}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
