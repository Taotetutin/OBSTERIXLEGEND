export type RiskLevel = 'bajo' | 'mediano' | 'alto';

export interface RiskFactors {
  bileAcids: number;
  got: number;
  gpt: number;
  totalBilirubin: number;
  prInterval: string;
  prValue: number;
  meconium: string;
  earlyOnset: string;
  noTreatmentResponse: string;
  gestationalWeeks: number;
}

export interface RiskAssessment {
  level: RiskLevel;
  recommendations: string;
  details: string[];
}

const RISK_THRESHOLDS = {
  BILE_ACIDS: {
    HIGH: 100,
    MEDIUM: 40,
    TREATMENT: 10
  },
  LIVER_ENZYMES: {
    GOT: 40,
    GPT: 40
  },
  BILIRUBIN: 1.2,
  PR_INTERVAL: 150,
  GESTATIONAL_WEEKS: {
    EARLY: 30,
    TERM: 37
  }
};

export function calculateRiskLevel(factors: RiskFactors): RiskAssessment {
  const riskFactors: string[] = [];
  let level: RiskLevel = 'bajo';

  // High Risk Assessment
  if (factors.bileAcids >= RISK_THRESHOLDS.BILE_ACIDS.HIGH) {
    level = 'alto';
    riskFactors.push('Ácidos biliares ≥ 100 μmol/L');
  }
  if (factors.meconium === 'si') {
    level = 'alto';
    riskFactors.push('Presencia de meconio');
  }
  if (factors.noTreatmentResponse === 'si') {
    level = 'alto';
    riskFactors.push('Falta de respuesta al tratamiento');
  }
  if (factors.prInterval === 'evaluado' && factors.prValue > RISK_THRESHOLDS.PR_INTERVAL) {
    level = 'alto';
    riskFactors.push('Intervalo PR prolongado (>150ms)');
  }

  // Medium Risk Assessment
  if (level !== 'alto') {
    if (factors.bileAcids >= RISK_THRESHOLDS.BILE_ACIDS.MEDIUM && 
        factors.bileAcids < RISK_THRESHOLDS.BILE_ACIDS.HIGH) {
      level = 'mediano';
      riskFactors.push('Ácidos biliares entre 40-99 μmol/L');
    }
    if (factors.got > RISK_THRESHOLDS.LIVER_ENZYMES.GOT) {
      level = 'mediano';
      riskFactors.push('GOT elevado (>40 U/L)');
    }
    if (factors.gpt > RISK_THRESHOLDS.LIVER_ENZYMES.GPT) {
      level = 'mediano';
      riskFactors.push('GPT elevado (>40 U/L)');
    }
    if (factors.totalBilirubin > RISK_THRESHOLDS.BILIRUBIN) {
      level = 'mediano';
      riskFactors.push('Bilirrubina total elevada (>1.2 mg/dL)');
    }
    if (factors.gestationalWeeks >= RISK_THRESHOLDS.GESTATIONAL_WEEKS.TERM) {
      level = 'mediano';
      riskFactors.push('Edad gestacional ≥ 37 semanas');
    }
    if (factors.earlyOnset === 'si') {
      level = 'mediano';
      riskFactors.push('Inicio precoz (<30 semanas)');
    }
  }

  return {
    level,
    recommendations: generateRecommendations(level, factors.bileAcids),
    details: riskFactors
  };
}

function generateRecommendations(level: RiskLevel, bileAcids: number): string {
  const baseRecommendations = {
    bajo: [
      'Seguimiento regular',
      'Monitoreo de ácidos biliares cada 1-2 semanas',
      'Considerar tratamiento sintomático para el prurito si es necesario',
      'Control prenatal de rutina'
    ],
    mediano: [
      'Monitoreo semanal de ácidos biliares y enzimas hepáticas',
      'Iniciar tratamiento con ácido ursodeoxicólico',
      'Considerar inducción del parto a las 37-38 semanas',
      'Monitoreo fetal más frecuente'
    ],
    alto: [
      'Monitoreo intensivo de ácidos biliares y función hepática (2-3 veces por semana)',
      'Tratamiento con ácido ursodeoxicólico en dosis altas',
      'Planear el parto entre las 34-36 semanas según severidad',
      'Considerar corticosteroides para maduración pulmonar si <34 semanas',
      'Monitoreo fetal diario'
    ]
  };

  let recommendations = baseRecommendations[level].join('. ') + '.';

  if (bileAcids > RISK_THRESHOLDS.BILE_ACIDS.TREATMENT) {
    recommendations += ' Se sugiere tratamiento con ácido ursodesoxicólico.';
  }

  return recommendations;
}