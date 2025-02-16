document.getElementById('gestationCalculator').addEventListener('submit', function(event) {
    event.preventDefault();
    const lastMenstrualPeriod = new Date(document.getElementById('lastMenstrualPeriod').value);
    if(isNaN(lastMenstrualPeriod.getTime())) {
        alert('Por favor ingresa una fecha válida.');
        return;
    }
    const gestationalAge = getGestationalAge(lastMenstrualPeriod, new Date());
    const conceptionDate = addDays(lastMenstrualPeriod, 14);
    const dueDate = addDays(lastMenstrualPeriod, 280);
    const week20 = addDays(lastMenstrualPeriod, 140);
    const week30 = addDays(lastMenstrualPeriod, 210);
    const week34 = addDays(lastMenstrualPeriod, 238);

    document.getElementById('gestationalAge').textContent = `${gestationalAge.weeks} semanas y ${gestationalAge.days} días`;
    document.getElementById('conceptionDate').textContent = formatDate(conceptionDate);
    document.getElementById('dueDate').textContent = formatDate(dueDate);
    document.getElementById('week20').textContent = formatDate(week20);
    document.getElementById('week30').textContent = formatDate(week30);
    document.getElementById('week34').textContent = formatDate(week34);
});

function getGestationalAge(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return {
        weeks: Math.floor(diffDays / 7),
        days: diffDays % 7
    };
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
document.getElementById('gestationCalculator').addEventListener('submit', function(event) {
    event.preventDefault();
    const fur = new Date(document.getElementById('lastMenstrualPeriod').value);
    displayImportantDates(fur);
});

function displayImportantDates(fur) {
    document.getElementById('week11to13').textContent = formatDateRange(fur, 11 * 7, 13 * 7 + 6);
    document.getElementById('week20to24').textContent = formatDateRange(fur, 20 * 7, 24 * 7);
    document.getElementById('week25to27').textContent = formatDateRange(fur, 25 * 7, 27 * 7);
    document.getElementById('week28').textContent = formatDate(addDays(fur, 28 * 7));
    document.getElementById('week32to34').textContent = formatDateRange(fur, 32 * 7, 34 * 7);
    document.getElementById('week34to37').textContent = formatDateRange(fur, 34 * 7, 37 * 7);
    document.getElementById('week35to37').textContent = formatDateRange(fur, 35 * 7, 37 * 7);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateRange(startDate, startDays, endDays) {
    const startDateFormatted = formatDate(addDays(startDate, startDays));
    const endDateFormatted = formatDate(addDays(startDate, endDays));
    return `${startDateFormatted} a ${endDateFormatted}`;
}