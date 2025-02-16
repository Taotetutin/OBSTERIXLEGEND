export function displayResults(riskScore) {
  const resultsDiv = document.getElementById('results');
  const riskLevel = interpretRiskScore(riskScore);
  const recommendations = getRecommendations(riskLevel);
  
  resultsDiv.innerHTML = `
    <h3>Resultados:</h3>
    <p>Puntuación de riesgo: ${riskScore.toFixed(2)}</p>
    <p>Nivel de riesgo: ${riskLevel}</p>
    <div class="recommendations">
      <h4>Recomendaciones:</h4>
      <ul>
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
  `;

  resultsDiv.style.display = 'block';
}

function interpretRiskScore(score) {
  if (score < 2) return 'Bajo';
  if (score < 5) return 'Moderado';
  return 'Alto';
}

function getRecommendations(riskLevel) {
  const recommendations = {
    Bajo: [
      'Continuar con controles prenatales regulares',
      'Mantener hábitos saludables',
      'Reportar cualquier cambio significativo'
    ],
    Moderado: [
      'Aumentar frecuencia de controles prenatales',
      'Considerar monitoreo adicional',
      'Evaluar necesidad de intervenciones preventivas',
      'Estar atenta a signos de alarma'
    ],
    Alto: [
      'Control prenatal intensivo',
      'Posible necesidad de hospitalización',
      'Considerar corticoides para maduración pulmonar',
      'Preparación para posible parto prematuro',
      'Seguimiento estrecho con especialista'
    ]
  };

  return recommendations[riskLevel];
}
