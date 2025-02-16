import { useState } from 'react';
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const calculatorGroups = {
  "Calculadoras Esenciales": calculators.filter(c => 
    ["calculadora-gestacional-compleja", "mefi", "doppler"].includes(c.id)
  ),
  "Evaluación y Riesgos": calculators.filter(c => 
    ["t21", "preeclampsia", "parto_prematuro", "colestasis", "prematurez", "thrombosis"].includes(c.id)
  ),
  "Herramientas Especializadas": calculators.filter(c => 
    !["calculadora-gestacional-compleja", "mefi", "doppler", "t21", "preeclampsia", "parto_prematuro", "colestasis", "prematurez", "thrombosis"].includes(c.id)
  )
};

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutateAsync();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Espacio para la franja azul */}
      <div className="h-32"></div>

      <div className="flex items-center gap-3 p-4 border-b">
        <img 
          src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
          alt="MiMaternoFetal Logo"
          className="h-8 w-auto"
        />
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent border-b-2 border-blue-400">
          ObsteriX Legend
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {Object.entries(calculatorGroups).map(([groupName, groupCalculators]) => (
          <div key={groupName} className="py-2">
            <div className="mx-3 mb-2 px-3 py-2 bg-blue-50 rounded-md">
              <h3 className="text-sm font-semibold text-blue-900">{groupName}</h3>
            </div>
            <ul className="space-y-1 px-3">
              {groupCalculators.map((calc) => (
                <li key={calc.id}>
                  <Link 
                    href={`/calculadora/${calc.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer",
                      "text-blue-800 hover:bg-blue-50 hover:text-blue-900",
                      "transition-colors duration-200",
                      location === `/calculadora/${calc.id}` && 
                      "bg-blue-100 text-blue-900 font-medium"
                    )}
                  >
                    {calc.icon && (
                      <calc.icon className="w-5 h-5 shrink-0 text-blue-600" />
                    )}
                    <span>{calc.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Salir de la App</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="fixed top-4 left-4 z-50 md:hidden">
          <Button 
            size="icon" 
            variant="outline"
            className="bg-white shadow-lg hover:bg-blue-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-80 border-r bg-white">
        <SidebarContent />
      </div>

      {/* Spacer for desktop layout */}
      <div className="hidden md:block w-80" />
    </>
  );
}