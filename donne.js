let requestNA = $.ajax({
    type:"GET",
    url: "../Data/survey_results_NA.json",
})

let requestWE = $.ajax({
    type:"GET",
    url: "../Data/survey_results_WE.json",
})

$.when(requestNA, requestWE).done(function(responseNA, responseWE) {
    let dataNA = responseNA[0];
    let dataWE = responseWE[0];

    let combinedData = dataNA.concat(dataWE);

    let experienceIncomeMap = {};

    combinedData.forEach(entry => {
        let experience = entry.years_experience;
        let income = entry.income_eur;

        if (!experienceIncomeMap[experience]) {
            experienceIncomeMap[experience] = [];
        }

        experienceIncomeMap[experience].push(income);
    });

    let averageIncomeData = [];

    for (let experience in experienceIncomeMap) {
        let incomes = experienceIncomeMap[experience];
        let totalIncome = incomes.reduce((acc, curr) => acc + curr, 0);
        let averageIncome = totalIncome / incomes.length;

        averageIncomeData.push({ experience: experience, averageIncome: averageIncome });
    }

    // Assuming you have a chart library like Chart.js included in your project
    let ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: averageIncomeData.map(data => data.experience),
            datasets: [{
                label: 'Average Income (EUR)',
                data: averageIncomeData.map(data => data.averageIncome),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});