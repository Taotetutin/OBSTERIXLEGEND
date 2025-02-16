import { CategoryColorClass } from './types';

interface FormData {
    gestationalWeeks: number;
    gestationalDays: number;
    cervicalLength: number;
    fetusCount: number;
    hasContractions: boolean;
    hasPreviousPretermBirth: boolean;
    hasMembraneRupture: boolean;
    hasCervicalSurgery: boolean;
}

export function displayResults(risk: number, formData: FormData) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;

    // Asegurarnos de que risk sea un número válido
    const riskPercentage = (risk * 100) || 0;
    const category = riskPercentage >= 60 ? 'Alto' : 
                    riskPercentage >= 30 ? 'Moderado' : 
                    'Bajo';

    const recommendations = getRecommendations(category);

    const categoryColorClass = 
        category === 'Alto' ? 'text-red-600' :
        category === 'Moderado' ? 'text-yellow-600' :
        'text-green-600';

    resultDiv.innerHTML = `
        <div class="space-y-4">
            <div class="border-b border-blue-200 pb-4">
                <h3 class="text-lg font-semibold text-blue-900">Resultados del Análisis</h3>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="rounded-lg bg-blue-50 p-4">
                    <h4 class="text-sm font-medium text-blue-900">Riesgo Calculado</h4>
                    <p class="mt-1 text-2xl font-semibold ${categoryColorClass}">${riskPercentage.toFixed(1)}%</p>
                </div>

                <div class="rounded-lg bg-blue-50 p-4">
                    <h4 class="text-sm font-medium text-blue-900">Categoría</h4>
                    <p class="mt-1 text-2xl font-semibold ${categoryColorClass}">${category}</p>
                </div>
            </div>

            <div class="mt-6">
                <h4 class="text-sm font-medium text-blue-900">Recomendaciones</h4>
                <div class="mt-2 text-sm text-blue-700">
                    ${recommendations}
                </div>
            </div>

            <div class="mt-6 rounded-lg bg-blue-50 p-4">
                <h4 class="text-sm font-medium text-blue-900">Datos Ingresados</h4>
                <dl class="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                    <div>
                        <dt class="text-sm font-medium text-blue-700">Edad gestacional</dt>
                        <dd class="text-sm text-blue-900">${formData.gestationalWeeks} semanas, ${formData.gestationalDays} días</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-blue-700">Longitud cervical</dt>
                        <dd class="text-sm text-blue-900">${formData.cervicalLength} mm</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-blue-700">Número de fetos</dt>
                        <dd class="text-sm text-blue-900">${formData.fetusCount}</dd>
                    </div>
                </dl>
            </div>
        </div>
    `;

    resultDiv.style.display = 'block';
}

function getRecommendations(category: string): string {
    let recommendations = '';

    if (category === 'Alto') {
        recommendations = `
            • Se recomienda evaluación inmediata por especialista<br>
            • Considerar hospitalización para monitoreo<br>
            • Evaluación para terapia con corticosteroides<br>
            • Monitoreo frecuente de signos de parto prematuro
        `;
    } else if (category === 'Moderado') {
        recommendations = `
            • Seguimiento más frecuente con su médico tratante<br>
            • Reducir actividad física intensa<br>
            • Monitorear síntomas de parto prematuro<br>
            • Control ecográfico en 1-2 semanas
        `;
    } else {
        recommendations = `
            • Continuar controles prenatales regulares<br>
            • Mantener hábitos saludables<br>
            • Reportar cambios significativos a su médico
        `;
    }

    return recommendations;
}