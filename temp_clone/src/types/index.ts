export interface FormData {
  fcb: string;
  variabilidad: string;
  aceleraciones: string;
  desaceleraciones: string;
  movimientos?: string;
  duracionRegistro?: string;
}

export interface Result {
  classification: string;
  pathology: string;
  guidelines: string[];
  categoryClass: string;
  riskLevel: string;
  recommendations: string[];
}

export interface MEFIClassification {
  category: string;
  description: string;
  riskLevel: string;
  guidelines: string[];
  recommendations: string[];
  categoryClass: string;
}