document.addEventListener("DOMContentLoaded", () => {
    const data = {
        "character": "Ninja",
        "max_level": 50,
        "max_skill_points": 50,
        "base_stats": {
            "vida_maxima": 110,
            "mana_maxima": 110,
            "ataque": 5,
            "defensa": 5,
            "critico": 20,
            "poder_critico": 20,
            "dps": 3
        },
        "stat_scaling_per_level": {
            "vida_maxima": 10,
            "mana_maxima": 10,
            "ataque": 2,
            "defensa": 1,
            "dps": 1
        },
        "rows": [
            { row: 1, skills: [{ id: 1, name: "Inicio Combo", max_points: 1, description: "Golpea al enemigo por 25 (Ataque). Comienza un COMBO.", img: "images/skills/inicio_combo.png" }] },
            { row: 2, skills: [{ id: 2, name: "Sin Escape", max_points: 1, description: "Tus ataques no pueden ser evitados por otros jugadores.", img: "images/skills/sin_escape.png" }] },
            { row: 3, skills: [{ id: 3, name: "Golpe de Sombra Nivel 1", max_points: 5, description: "Golpea al enemigo por 16 (Ataque). Crítico: +50% probabilidad crítico.", img: "images/skills/golpe_sombra_1.png" }] },
            { row: 4, skills: [{ id: 4, name: "Combo de Dagas Dobles", max_points: 5, description: "Permite usar COMBO. Podes hacer más combos.", img: "images/skills/combo_dagas.png" }] },
            { row: 5, skills: [{ id: 5, name: "Golpe Roba Vida", max_points: 5, description: "Golpea al enemigo por 14 (Ataque). Te cura un 10% de la vida.", img: "images/skills/roba_vida.png" }] },
            { row: 6, skills: [
                { id: 6, name: "Golpe Salvaje", max_points: 5, description: "Golpea al enemigo por 18 (Ataque). Crítico aumentado.", img: "images/skills/golpe_salvaje.png" },
                { id: 7, name: "Alma de Sombra", max_points: 5, description: "Aumenta la velocidad de movimiento +12% y evasión +1.", img: "images/skills/alma_sombra.png" }
            ] },
            { row: 7, skills: [
                { id: 8, name: "Golpe de Sombra Nivel 3", max_points: 5, description: "Golpea al enemigo por 16 (Ataque). En Combo: daña en área.", img: "images/skills/golpe_sombra_3.png" },
                { id: 9, name: "Golpe de Sombra Nivel 6", max_points: 5, description: "Golpea al enemigo por 25 (Ataque). Próximo ataque evadido.", img: "images/skills/golpe_sombra_6.png" },
                { id: 10, name: "Iris Envolvente", max_points: 5, description: "Un porcentaje de tu evasión se suma a tu daño de ataque.", img: "images/skills/iris_envolvente.png" }
            ] },
            { row: 8, skills: [
                { id: 11, name: "Ráfaga", max_points: 5, description: "Aumenta probabilidad de golpe crítico y mágico al grupo.", img: "images/skills/rafaga.png" },
                { id: 12, name: "Evasión Mística", max_points: 5, description: "Cada vez que evadas un golpe, te curará +6 de Vida.", img: "images/skills/evasion_mistica.png" }
            ] },
            { row: 9, skills: [
                { id: 13, name: "Colmillo Azul", max_points: 5, description: "Recupera de Mana cuando realizas un golpe crítico.", img: "images/skills/colmillo_azul.png" },
                { id: 14, name: "Golpe Final", max_points: 5, description: "Consume todos los puntos de combo para hacer más daño.", img: "images/skills/golpe_final.png" },
                { id: 15, name: "Técnica Definitiva", max_points: 5, description: "Se vuelve invulnerable al daño durante 6 segundos.", img: "images/skills/tecnica_definitiva.png" }
            ] },
            { row: 10, skills: [
                { id: 16, name: "Espejismo Estático", max_points: 5, description: "Cuando evadas un ataque, un rayo cae en el área.", img: "images/skills/espejismo.png" }
            ] }
        ]
    };

    let playerLevel = 1;
    let spentSkillPoints = 0;
    let skillPointsAllocation = {};

    data.rows.forEach(row => {
        row.skills.forEach(skill => {
            skillPointsAllocation[skill.id] = 0;
        });
    });

    const levelInput = document.getElementById("level-input");
    const pointsDisplay = document.getElementById("available-points");
    const statsContainer = document.getElementById("stats-container");
    const skillsContainer = document.getElementById("skills-container");

    function renderStats() {
        let html = "";
        for (let key in data.base_stats) {
            let base = data.base_stats[key];
            let scaling = data.stat_scaling_per_level[key] ? data.stat_scaling_per_level[key] * (playerLevel - 1) : 0;
            html += `<p><strong>${key.toUpperCase().replace('_', ' ')}:</strong> ${base + scaling}</p>`;
        }
        statsContainer.innerHTML = html;
    }

    function renderSkills() {
        skillsContainer.innerHTML = "";
        
        data.rows.forEach(rowData => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "skill-row";

            const numDiv = document.createElement("div");
            numDiv.className = "row-number";
            numDiv.textContent = rowData.row;
            rowDiv.appendChild(numDiv);

            const skillsFlex = document.createElement("div");
            skillsFlex.className = "row-skills";

            rowData.skills.forEach(skill => {
                const points = skillPointsAllocation[skill.id];
                const slot = document.createElement("div");
                slot.className = `skill-slot ${points > 0 ? 'active' : ''}`;
                slot.style.backgroundImage = `url('${skill.img}')`;
                slot.title = `${skill.name} (${points}/${skill.max_points})\n${skill.description}`;

                slot.innerHTML = `<span class="skill-points-badge">${points}</span>`;

                slot.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (spentSkillPoints < data.max_skill_points && points < skill.max_points) {
                        skillPointsAllocation[skill.id]++;
                        spentSkillPoints++;
                        pointsDisplay.textContent = data.max_skill_points - spentSkillPoints;
                        renderSkills();
                    }
                });

                slot.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (skillPointsAllocation[skill.id] > 0) {
                        skillPointsAllocation[skill.id]--;
                        spentSkillPoints--;
                        pointsDisplay.textContent = data.max_skill_points - spentSkillPoints;
                        renderSkills();
                    }
                });

                skillsFlex.appendChild(slot);
            });

            rowDiv.appendChild(skillsFlex);
            skillsContainer.appendChild(rowDiv);
        });
    }

    levelInput.addEventListener("change", (e) => {
        let val = parseInt(e.target.value);
        if (val >= 1 && val <= 50) {
            playerLevel = val;
            renderStats();
        }
    });

    renderStats();
    renderSkills();
});
