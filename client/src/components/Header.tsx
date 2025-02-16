import { SiGithub } from "react-icons/si";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue-700">
          Calculadora de Riesgo T21
        </h1>
        <p className="text-blue-600">
          Herramienta de evaluación de riesgo para trisomía 21
        </p>
      </div>
    </header>
  );
}