$(document).ready(function() {
    $.getJSON('../data/survey_results_NA.json', function(data) {
        let experienceData = {};
        
        data.forEach(item => {
            let years = item.YearsCodePro;
            let revenue = parseFloat(item.CompTotal);
            
            if (!experienceData[years]) {
                experienceData[years] = { totalRevenue: 0, count: 0 };
            }
            
            experienceData[years].totalRevenue += revenue;
            experienceData[years].count += 1;
        });
        
        let labels = [];
        let averageRevenues = [];
        
        for (let years in experienceData) {
            labels.push(years);
            averageRevenues.push(experienceData[years].totalRevenue / experienceData[years].count);
        }
        
        console.log('Labels:', labels);
        console.log('Average Revenues:', averageRevenues);
        
        let ctx = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Revenue',
                    data: averageRevenues,
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
    }).fail(function(jqxhr, textStatus, error) {
        let err = textStatus + ", " + error;
        console.error("Request Failed: " + err);
    });
});
