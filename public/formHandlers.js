import { calculateRisk } from './riskCalculator.js';
import { displayResults } from './displayResults.js';

export function setupFormHandlers() {
    const rollers = document.querySelectorAll('.custom-roller input');
    rollers.forEach(roller => {
        roller.addEventListener('input', function() {
            if (this.value < this.min) this.value = this.min;
            if (this.value > this.max) this.value = this.max;
        });
    });

    document.getElementById('riskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            gestationalWeeks: parseInt(document.getElementById('gestationalWeeks').value),
            gestationalDays: parseInt(document.getElementById('gestationalDays').value),
            cervicalLength: parseInt(document.getElementById('cervicalLength').value),
            fetusCount: parseInt(document.getElementById('fetusCount').value),
            hasContractions: document.getElementById('hasContractions').checked,
            hasPreviousPretermBirth: document.getElementById('hasPreviousPretermBirth').checked,
            hasMembraneRupture: document.getElementById('hasMembraneRupture').checked,
            hasCervicalSurgery: document.getElementById('hasCervicalSurgery').checked
        };

        const risk = calculateRisk(formData);
        displayResults(risk, formData);
    });
}
