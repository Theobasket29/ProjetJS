


        let data = {}; // Contiendra les données des fichiers JSON
        const continentSelect = document.getElementById('continent');
        const devTypeSelect = document.getElementById('devType');
        const topNSelect = document.getElementById('topN');
        const osChartCanvas = document.getElementById('osChart').getContext('2d');
        let osChart;

        // Charger les fichiers JSON
        async function loadData() {
            try {
                const continentResponse = await fetch('continent.json'); // Remplacez par le chemin de votre fichier
                const devTypeResponse = await fetch('devType.json'); // Remplacez par le chemin de votre fichier
                const continentData = await continentResponse.json();
                const devTypeData = await devTypeResponse.json();

                // Fusionner les données si nécessaire
                data = { continentData, devTypeData };

                // Remplir les options des continents et métiers
                populateContinentOptions(continentData);
                populateDevTypeOptions(devTypeData);
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
            }
        }

        // Remplir les options des continents
        function populateContinentOptions(continentData) {
            Object.keys(continentData).forEach(continent => {
                const option = document.createElement('option');
                option.value = continent;
                option.textContent = continent;
                continentSelect.appendChild(option);
            });
        }

        // Remplir les options des métiers
        function populateDevTypeOptions(devTypeData) {
            Object.keys(devTypeData).forEach(devType => {
                const option = document.createElement('option');
                option.value = devType;
                option.textContent = devType;
                devTypeSelect.appendChild(option);
            });
        }

        // Mettre à jour le graphique
        function updateChart() {
            const continent = continentSelect.value;
            const devType = devTypeSelect.value;
            const topN = parseInt(topNSelect.value);

            if (!continent || !devType) return;

            const osData = data.continentData[continent][devType]; // Extraire les données spécifiques
            const topOs = osData.slice(0, topN); // Limiter au topN
            const osNames = topOs.map(item => item.os); // Noms des OS
            const osCounts = topOs.map(item => item.count); // Comptes d'utilisateurs

            // Mise à jour du graphique
            if (osChart) osChart.destroy();
            osChart = new Chart(osChartCanvas, {
                type: 'bar',
                data: {
                    labels: osNames,
                    datasets: [{
                        label: 'Nombre d\'Utilisateurs',
                        data: osCounts,
                        backgroundColor: osNames.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`)
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Top ${topN} Systèmes d'Exploitation (${devType} - ${continent})`
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Ajouter des écouteurs d'événements
        continentSelect.addEventListener('change', updateChart);
        devTypeSelect.addEventListener('change', updateChart);
        topNSelect.addEventListener('change', updateChart);

        // Charger les données et initialiser
        loadData();

