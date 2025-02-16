export function displayResults(risk, formData) {
    const riskPercentage = (risk * 100).toFixed(2);
    const interpretation = interpretRisk(risk, formData);

    const html = `
        <h2>Resultados del Riesgo de Parto Prematuro</h2>
        <p>Riesgo estimado de parto prematuro dentro de 7 días: <span class="${getRiskClass(risk)}">${riskPercentage}%</span></p>
        <h3>Interpretación y Recomendaciones:</h3>
        ${interpretation}
        <p><strong>Nota:</strong> Esta calculadora está basada en evidencia científica y es una herramienta de apoyo para la toma de decisiones clínicas.</p>
    `;

    document.getElementById('result').innerHTML = html;
}

function getRiskClass(risk) {
    if (risk < 0.05) return "risk-level low-risk";
    if (risk < 0.2) return "risk-level moderate-risk";
    return "risk-level high-risk";
}

function interpretRisk(risk, formData) {
    let interpretation = "<p>";
    
    if (risk < 0.05) {
        interpretation += "<strong class='low-risk'>Riesgo bajo:</strong> El riesgo de parto prematuro en los próximos 7 días es bajo. ";
        interpretation += "Se recomienda continuar con el seguimiento prenatal de rutina.</p>";
    } else if (risk < 0.2) {
        interpretation += "<strong class='moderate-risk'>Riesgo moderado:</strong> Existe un riesgo moderado de parto prematuro. ";
        interpretation += "Se recomienda un seguimiento más cercano y considerar medidas preventivas.</p>";
    } else {
        interpretation += "<strong class='high-risk'>Riesgo alto:</strong> El riesgo de parto prematuro es significativo. ";
        interpretation += "Se recomienda una evaluación médica inmediata.</p>";
    }

    interpretation += `<p>Edad gestacional actual: ${formData.gestationalWeeks} semanas y ${formData.gestationalDays} días</p>`;
    interpretation += `<p>Longitud cervical: ${formData.cervicalLength} mm</p>`;

    interpretation += "<p><strong>Recomendaciones basadas en los hallazgos clínicos:</strong></p><ul>";
    
    // Recomendaciones basadas en longitud cervical y contracciones
    if (formData.cervicalLength >= 30) {
        interpretation += "<li>Longitud cervical normal. Seguimiento prenatal regular.</li>";
    } else {
        if (formData.cervicalLength < 25 && formData.hasContractions) {
            interpretation += "<li>Considere tocolisis por presencia de contracciones y longitud cervical reducida.</li>";
        }
        
        if (formData.cervicalLength >= 25) {
            interpretation += "<li>Considere seguimiento más frecuente de longitud cervical y uso de progesterona vaginal.</li>";
        } else if (formData.cervicalLength >= 20) {
            interpretation += "<li>Indicación de progesterona vaginal y seguimiento frecuente.</li>";
        } else if (formData.cervicalLength >= 15) {
            interpretation += "<li>Evaluación hospitalaria para observación cercana.</li>";
        } else {
            interpretation += "<li>Hospitalización inmediata.</li>";
            interpretation += "<li>Optimice el reposo.</li>";
        }
    }

    // Recomendaciones para corticoides solo si está en el rango gestacional apropiado
    if (formData.gestationalWeeks >= 24 && formData.gestationalWeeks < 34 && formData.cervicalLength < 25) {
        interpretation += "<li>Considere la administración de corticosteroides para maduración pulmonar fetal";
        if (formData.cervicalLength < 15) {
            interpretation += " y sulfato de magnesio";
        }
        interpretation += ".</li>";
    }

    interpretation += "</ul>";
    return interpretation;
}
