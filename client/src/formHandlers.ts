import { calculateRisk } from './riskCalculator';
import { displayResults } from './displayResults';

export function setupFormHandlers() {
    const rollers = document.querySelectorAll('.custom-roller input');
    rollers.forEach(roller => {
        roller.addEventListener('input', function() {
            if (this.value < this.min) this.value = this.min;
            if (this.value > this.max) this.value = this.max;
        });
    });

    document.getElementById('riskForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            gestationalWeeks: parseInt((document.getElementById('gestationalWeeks') as HTMLInputElement).value),
            gestationalDays: parseInt((document.getElementById('gestationalDays') as HTMLInputElement).value),
            cervicalLength: parseInt((document.getElementById('cervicalLength') as HTMLInputElement).value),
            fetusCount: parseInt((document.getElementById('fetusCount') as HTMLSelectElement).value),
            hasContractions: (document.getElementById('hasContractions') as HTMLInputElement).checked,
            hasPreviousPretermBirth: (document.getElementById('hasPreviousPretermBirth') as HTMLInputElement).checked,
            hasMembraneRupture: (document.getElementById('hasMembraneRupture') as HTMLInputElement).checked,
            hasCervicalSurgery: (document.getElementById('hasCervicalSurgery') as HTMLInputElement).checked
        };

        const risk = calculateRisk(formData);
        displayResults(risk, formData);
    });
}
