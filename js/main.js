document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('db/ninja_data.json');
        const ninjaData = await response.json();

        window.ninjaPlanner = new NinjaPlanner(ninjaData);
        window.ninjaPlanner.renderSkillsUI();
        window.ninjaPlanner.updateStatsDisplay();

        const levelSlider = document.getElementById('char-level');
        levelSlider.addEventListener('input', (e) => {
            window.ninjaPlanner.setLevel(e.target.value);
        });

    } catch (error) {
        console.error("Error al cargar los datos del ninja:", error);
    }
});
