import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LHRCalculator from "./LHRCalculator";
import CVRCalculator from "./CVRCalculator";

export default function PulmonaryPredictorCalculator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marcadores de Disfunción Pulmonar</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Esta herramienta permite evaluar dos condiciones pulmonares fetales principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Seleccione el índice a calcular:</h3>
            <Tabs defaultValue="lhr" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="lhr">LHR</TabsTrigger>
                <TabsTrigger value="cvr">CVR</TabsTrigger>
              </TabsList>

              <TabsContent value="lhr">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="font-medium mb-1">Lung-to-Head Ratio (LHR)</p>
                    <p>Calculadora para evaluar la severidad de la hernia diafragmática congénita</p>
                  </div>
                  <LHRCalculator />
                </div>
              </TabsContent>
              <TabsContent value="cvr">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="font-medium mb-1">CPAM Volume Ratio (CVR)</p>
                    <p>Calculadora para evaluar la severidad de la malformación adenomatoidea quística congénita</p>
                  </div>
                  <CVRCalculator />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}