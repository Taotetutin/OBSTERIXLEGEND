import {
  Calculator,
  Baby,
  Scale,
  Droplet,
  Stethoscope,
  Calendar,
  Heart,
  Activity,
  Weight,
  BarChart,
  Pill,
  AlertTriangle,
  Ruler,
  HeartPulse,
  Brain,
  Bone,
  BadgeAlert,
  Timer,
  Gauge,
  ThermometerSnowflake,
  TrendingUp,
  Microscope,
  ScrollText,
  Waves,
  CalendarCheck,
  FlaskConical,
  CircleDot,
  Dna,
  PersonStanding,
  Hourglass,
  AlarmClock
} from "lucide-react";

import GestationalAgeCalculator from "./GestationalAgeCalculator";
import GestationalComplexCalculator from "./GestationalComplexCalculator";
import FPPCalculator from "./FPPCalculator";
import IMCCalculator from "./IMCCalculator";
import LiquidoAmnioticoCalculator from "./LiquidoAmnioticoCalculator";
import BishopCalculator from "./BishopCalculator";
import CrecimientoFetalCalculator from "./CrecimientoFetalCalculator";
import DopplerCalculator from "./DopplerCalculator";
import PesoFetalCalculator from "./PesoFetalCalculator";
import PreeclampsiaCalculator from "./PreeclampsiaCalculator";
import T21Calculator from "./T21Calculator";
import TallaFetalCalculator from "./TallaFetalCalculator";
import WeightGainCalculator from "./WeightGainCalculator";
import PartoPrematuroCalculator from "./PartoPrematuroCalculator";
import MEFICalculator from "./MEFICalculator";
import FemurCortoCalculator from "./FemurCortoCalculator";
import HuesoNasalCalculator from "./HuesoNasalCalculator";
import PRCalculator from "./PRCalculator";
import RiesgoNeonatalCalculator from "./RiesgoNeonatalCalculator";
import ColestasisCalculator from "./colestasis-app/ColestasisCalculator";
import PulmonaryPredictorCalculator from "./PulmonaryPredictorCalculator";
import ThrombosisCalculator from "./ThrombosisCalculator";

export const calculators = [
  {
    id: "calculadora-gestacional-compleja",
    name: "Calculadora Gestacional",
    description: "Calculadora completa de edad gestacional con fechas importantes y registro de pacientes",
    icon: CalendarCheck,
    component: GestationalComplexCalculator,
  },
  {
    id: "mefi",
    name: "Monitoreo Fetal Intraparto",
    description: "Evaluación del registro cardiotocográfico intraparto",
    icon: HeartPulse,
    component: MEFICalculator,
  },
  {
    id: "doppler",
    name: "Doppler Fetal",
    description: "Evaluación de flujos Doppler fetales",
    icon: Waves,
    component: DopplerCalculator,
  },
  {
    id: "thrombosis",
    name: "Riesgo Tromboembólico",
    description: "Evaluación del riesgo tromboembólico durante embarazo y puerperio según RCOG",
    icon: FlaskConical,
    component: ThrombosisCalculator,
  },
  {
    id: "gestacional",
    name: "Edad Gestacional Dudosa",
    description: "Calculadora de edad gestacional por biometría",
    icon: Timer,
    component: GestationalAgeCalculator,
  },
  {
    id: "fpp",
    name: "Fecha Probable de Parto",
    description: "Calcula la fecha probable de parto basada en la última menstruación",
    icon: Calendar,
    component: FPPCalculator,
  },
  {
    id: "imc",
    name: "Índice de Masa Corporal",
    description: "Calcula el IMC materno",
    icon: PersonStanding,
    component: IMCCalculator,
  },
  {
    id: "liquido-amniotico",
    name: "Líquido Amniótico",
    description: "Evalúa el índice de líquido amniótico",
    icon: Droplet,
    component: LiquidoAmnioticoCalculator,
  },
  {
    id: "bishop",
    name: "Bishop Score",
    description: "Evaluación del índice de Bishop",
    icon: CircleDot,
    component: BishopCalculator,
  },
  {
    id: "peso-fetal",
    name: "Peso Fetal",
    description: "Estimación del peso fetal",
    icon: Scale,
    component: PesoFetalCalculator,
  },
  {
    id: "talla-fetal",
    name: "Talla Fetal",
    description: "Estimación de la talla fetal",
    icon: Ruler,
    component: TallaFetalCalculator,
  },
  {
    id: "parto-prematuro",
    name: "Riesgo de Parto Prematuro",
    description: "Evaluación del riesgo de parto prematuro",
    icon: AlertTriangle,
    component: PartoPrematuroCalculator,
  },
  {
    id: "preeclampsia",
    name: "Riesgo de Preeclampsia",
    description: "Evaluación del riesgo de preeclampsia",
    icon: Activity,
    component: PreeclampsiaCalculator,
  },
  {
    id: "t21",
    name: "Riesgo de T21",
    description: "Cálculo del riesgo de trisomía 21",
    icon: Dna,
    component: T21Calculator,
  },
  {
    id: "weight-gain",
    name: "Ganancia de Peso",
    description: "Control de ganancia de peso durante el embarazo",
    icon: TrendingUp,
    component: WeightGainCalculator,
  },
  {
    id: "femur-corto",
    name: "Evaluación de Fémur Corto",
    description: "Análisis de la longitud del fémur fetal y sus percentiles",
    icon: Bone,
    component: FemurCortoCalculator,
  },
  {
    id: "hueso-nasal",
    name: "Evaluación del Hueso Nasal",
    description: "Análisis del hueso nasal fetal y sus implicaciones",
    icon: Microscope,
    component: HuesoNasalCalculator,
  },
  {
    id: "pr",
    name: "Intervalo PR Fetal",
    description: "Evaluación del intervalo PR y conducción cardíaca fetal",
    icon: Heart,
    component: PRCalculator,
  },
  {
    id: "riesgo-neonatal",
    name: "Riesgo Neonatal",
    description: "Evaluación de riesgos neonatales basados en edad gestacional",
    icon: Baby,
    component: RiesgoNeonatalCalculator,
  },
  {
    id: "colestasis",
    name: "Riesgo Fetal en Colestasis",
    description: "Evaluación del riesgo en colestasis intrahepática del embarazo",
    icon: ThermometerSnowflake,
    component: ColestasisCalculator,
  },
  {
    id: "crecimiento-fetal",
    name: "Crecimiento Fetal",
    description: "Evaluación integral del crecimiento fetal mediante percentiles OMS y curvas de crecimiento",
    icon: BarChart,
    component: CrecimientoFetalCalculator,
  },
  {
    id: "pulmonary-predictor",
    name: "Disfunción Pulmonar",
    description: "Evaluación integral de patologías pulmonares fetales",
    icon: Stethoscope,
    component: PulmonaryPredictorCalculator,
  }
];