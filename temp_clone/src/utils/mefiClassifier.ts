import { FormData, MEFIClassification } from '../types';

export function classifyMEFI(data: FormData): MEFIClassification {
  const { fcb, variabilidad, aceleraciones, desaceleraciones } = data;

  // Categoría III - Anormal (Prioridad máxima)
  if (
    // Bradicardia severa
    fcb === 'bradicardia_severa' ||
    // Variabilidad ausente con desaceleraciones recurrentes
    (variabilidad === 'ausente' && ['tardias', 'variables'].includes(desaceleraciones)) ||
    // Patrón sinusoidal
    desaceleraciones === 'sinusoidal' ||
    // Variabilidad ausente con desaceleraciones prolongadas
    (variabilidad === 'ausente' && desaceleraciones === 'prolongadas')
  ) {
    return {
      category: 'Categoría III',
      description: 'Trazado anormal - Estado fetal no tranquilizador',
      riskLevel: 'Alto riesgo - Requiere acción inmediata',
      guidelines: [
        'Ausencia de variabilidad con desaceleraciones tardías o variables recurrentes',
        'Bradicardia severa sostenida',
        'Patrón sinusoidal confirmado',
        'Variabilidad ausente con FCB basal normal y ausencia de aceleraciones'
      ],
      recommendations: [
        'Evaluación inmediata por especialista',
        'Oxigenoterapia materna con mascarilla (10L/min)',
        'Posición decúbito lateral izquierdo',
        'Hidratación IV rápida (1000cc)',
        'Suspender oxitocina si está en uso',
        'Considerar tocolisis de urgencia si hay taquisistolia',
        'Preparar para posible cesárea de emergencia (10-30 min)',
        'Toma de pH fetal si está disponible y es factible'
      ],
      categoryClass: 'bg-red-100 border-red-500'
    };
  }

  // Categoría I - Normal
  if (
    // FCB normal
    fcb === 'normal' &&
    // Variabilidad normal
    variabilidad === 'normal' &&
    // Aceleraciones presentes o ausentes (ambas aceptables)
    ['presentes', 'ausentes'].includes(aceleraciones) &&
    // Sin desaceleraciones o solo precoces
    ['ausentes', 'precoces'].includes(desaceleraciones)
  ) {
    return {
      category: 'Categoría I',
      description: 'Trazado normal - Estado fetal tranquilizador',
      riskLevel: 'Bajo riesgo',
      guidelines: [
        'FCB: 110-160 lpm',
        'Variabilidad moderada: 6-25 lpm',
        'Aceleraciones presentes o ausentes',
        'Sin desaceleraciones significativas o solo desaceleraciones precoces'
      ],
      recommendations: [
        'Continuar monitoreo de rutina cada 30 minutos',
        'Documentar evaluación cada hora',
        'No requiere intervenciones específicas',
        'Mantener hidratación materna adecuada'
      ],
      categoryClass: 'bg-green-100 border-green-500'
    };
  }

  // Categoría II - Indeterminado (todos los patrones que no cumplen criterios I o III)
  return {
    category: 'Categoría II',
    description: 'Trazado indeterminado - Requiere vigilancia y reevaluación',
    riskLevel: 'Riesgo intermedio',
    guidelines: [
      'Taquicardia fetal (>160 lpm)',
      'Bradicardia leve o moderada',
      'Variabilidad mínima o aumentada',
      'Variabilidad ausente sin desaceleraciones recurrentes',
      'Desaceleraciones variables recurrentes con variabilidad presente',
      'Desaceleraciones prolongadas (>2 min pero <10 min)'
    ],
    recommendations: [
      'Identificar y corregir causas reversibles:',
      '- Evaluar posición materna',
      '- Verificar presión arterial materna',
      '- Evaluar patrón de contracciones',
      '- Verificar estado de hidratación',
      'Medidas de reanimación intrauterina:',
      '- Cambio a decúbito lateral izquierdo',
      '- Hidratación IV (500-1000cc)',
      '- Oxigenoterapia por mascarilla si es necesario',
      'Reevaluar en 20-30 minutos tras medidas correctivas',
      'Si no hay mejoría, considerar pruebas adicionales o finalización del embarazo'
    ],
    categoryClass: 'bg-yellow-100 border-yellow-500'
  };
}