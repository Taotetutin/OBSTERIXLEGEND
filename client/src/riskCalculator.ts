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

export function calculateRisk(formData: FormData): number {
    // Asegurarse de que cervicalLength sea un número válido
    const cervicalLength = Number(formData.cervicalLength) || 0;
    const risk = calculateBaseRisk(cervicalLength);

    const riskMultipliers = {
        multipleGestation: formData.fetusCount > 1 ? 1.5 : 1,
        contractions: formData.hasContractions ? 1.2 : 1,
        previousPreterm: formData.hasPreviousPretermBirth ? 1.3 : 1,
        membraneRupture: formData.hasMembraneRupture ? 1.4 : 1,
        cervicalSurgery: formData.hasCervicalSurgery ? 1.1 : 1
    };

    const totalRisk = risk * Object.values(riskMultipliers).reduce((a, b) => a * b, 1);
    return Math.min(totalRisk, 0.99);
}

function calculateBaseRisk(cervicalLength: number): number {
    const maxRisk = 0.80;
    const minRisk = 0.007;
    const decayRate = 0.08;

    if (cervicalLength <= 5) return maxRisk;
    if (cervicalLength >= 50) return minRisk;

    return minRisk + (maxRisk - minRisk) * Math.exp(-decayRate * (cervicalLength - 5));
}