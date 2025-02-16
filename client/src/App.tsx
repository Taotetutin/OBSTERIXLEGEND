import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import AuthPage from "@/pages/AuthPage";
import Sidebar from "@/components/Sidebar";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon } from "lucide-react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 overflow-auto">
            {location !== "/" && location !== "/auth" && (
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setLocation("/")}
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            )}
            <Switch>
              <Route path="/auth" component={AuthPage} />
              <ProtectedRoute path="/" component={Home} />
              <ProtectedRoute path="/calculadora/:id" component={Calculator} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <footer className="py-4 text-center text-sm text-primary/80 bg-white border-t">
            Todos los derechos reservados a MiMaternoFetal.cl
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {isLoading ? <LoadingScreen /> : <Router />}
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;