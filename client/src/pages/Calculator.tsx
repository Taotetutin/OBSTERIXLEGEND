import { useParams } from "wouter";
import { calculators } from "@/components/calculators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Calculator() {
  const { id } = useParams();
  const calculator = calculators.find(c => c.id === id);

  if (!calculator) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Calculadora no encontrada: {id}
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline">Volver al inicio</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const CalculatorComponent = calculator.component;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-sky-500/10">
          <CardTitle className="flex items-center gap-2 text-blue-700 text-lg md:text-xl">
            {calculator.icon && <calculator.icon className="w-5 h-5 md:w-6 md:h-6" />}
            {calculator.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <CalculatorComponent />
        </CardContent>
      </Card>
    </div>
  );
}