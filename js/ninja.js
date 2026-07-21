document.addEventListener("DOMContentLoaded", () => {
    // Base de datos del Ninja integrada directamente para evitar errores 404 en GitHub Pages
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
      "skills": [
        { "id": 1, "name": "Inicio Combo", "max_points": 1, "description": "Golpea al enemigo por 25 (Ataque). Comienza un COMBO.", "img": "images/skills/inicio_combo.png" },
        { "id": 2, "name": "Sin Escape", "max_points": 1, "description": "Tus ataques no pueden ser evitados por otros jugadores.", "img": "images/skills/sin_escape.png" },
        { "id": 3, "name": "Golpe de Sombra Nivel 1", "max_points": 5, "description": "Golpea al enemigo por 16 (Ataque). Crítico: aumenta la probabilidad de golpe crítico en un 50% para el próximo golpe.", "img": "images/skills/golpe_sombra_1.png" },
        { "id": 4, "name": "Combo de Dagas Dobles", "max_points": 5, "description": "Permite usar COMBO. Podes hacer más combos.", "img": "images/skills/combo_dagas.png" },
        { "id": 5, "name": "Golpe Roba Vida", "max_points": 5, "description": "Golpea al enemigo por 14 (Ataque). Te cura un 10% de la vida.", "img": "images/skills/roba_vida.png" },
        { "id": 6, "name": "Golpe Salvaje", "max_points": 5, "description": "Golpea al enemigo por 18 (Ataque). Crítico: aumenta el daño crítico sobre el poder crítico entre +20% y +150% para el próximo golpe.", "img": "images/skills/golpe_salvaje.png" },
        { "id": 7, "name": "Alma de Sombra", "max_points": 5, "description": "Aumenta la velocidad de movimiento en +12% y evasión en +1.", "img": "images/skills/alma_sombra.png" },
        { "id": 8, "name": "Golpe de Sombra Nivel 3", "max_points": 5, "description": "Golpea al enemigo por 16 (Ataque). En Combo: daña en área.", "img": "images/skills/golpe_sombra_3.png" },
        { "id": 9, "name": "Golpe de Sombra Nivel 6", "max_points": 5, "description": "Golpea al enemigo por 25 (Ataque). En Combo: el próximo ataque será evadido.", "img": "images/skills/golpe_sombra_6.png" },
        { "id": 10, "name": "Iris Envolvente", "max_points": 5, "description": "Un porcentaje de tu evasión se suma a tu daño de ataque.", "img": "images/skills/iris_envolvente.png" },
        { "id": 11, "name": "Ráfaga", "max_points": 5, "description": "Aumenta la probabilidad de golpe crítico y crítico mágico durante 20 para todo el grupo.", "img": "images/skills/rafaga.png" },
        { "id": 12, "name": "Evasión Mística", "max_points": 5, "description": "Cada vez que evadas un golpe, te curará +6 de Vida.", "img": "images/skills/evasion_mistica.png" },
        { "id": 13, "name": "Colmillo Azul", "max_points": 5, "description": "Recupera de Mana cuando realizas un golpe crítico.", "img": "images/skills/colmillo_azul.png" },
        { "id": 14, "name": "Golpe Final", "max_points": 5, "description": "Golpea al enemigo por 34 (Ataque). Consume todos los puntos de combo para hacer más daño por cada uno consumido.", "img": "images/skills/golpe_final.png" },
        { "id": 15, "name": "Técnica Definitiva", "max_points": 5, "description": "Se vuelve invulnerable al daño durante 6 segundos.", "img": "images/skills/tecnica_definitiva.png" },
        { "id": 16, "name": "Espeismo Estático", "max_points": 5, "description": "Cuando evadas un ataque, un rayo cae en el área, infligiendo daño a todos los monstruos cercanos.", "img": "images/skills/espejismo.png" }
      ]
    };

    let playerLevel = 1;
    let spentSkillPoints = 0;
    let skillPointsAllocation = {};

    data.skills.forEach(skill => {
        skillPointsAllocation[skill.id] = 0;
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
        data.skills.forEach(skill => {
            let points = skillPointsAllocation[skill.id];
            let div = document.createElement("div");
            div.className = "skill-item";
            div.innerHTML = `
                <div class="skill-info">
                    <div class="skill-img" style="background-image: url('${skill.img}');"></div>
                    <div>
                        <small>[Req: Nivel ${skill.id}]</small><br>
                        <span>${skill.name} (${points}/${skill.max_points})</span>
                    </div>
                </div>
                <div>
                    <button class="minus" data-id="${skill.id}">-</button>
                    <button class="plus" data-id="${skill.id}">+</button>
                </div>
            `;
            skillsContainer.appendChild(div);
        });

        document.querySelectorAll(".plus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let id = e.target.getAttribute("data-id");
                let skill = data.skills.find(s => s.id == id);
                if (spentSkillPoints < 50 && skillPointsAllocation[id] < skill.max_points) {
                    skillPointsAllocation[id]++;
                    spentSkillPoints++;
                    pointsDisplay.textContent = 50 - spentSkillPoints;
                    renderSkills();
                }
            });
        });

        document.querySelectorAll(".minus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let id = e.target.getAttribute("data-id");
                if (skillPointsAllocation[id] > 0) {
                    skillPointsAllocation[id]--;
                    spentSkillPoints--;
                    pointsDisplay.textContent = 50 - spentSkillPoints;
                    renderSkills();
                }
            });
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
