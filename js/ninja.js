document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch('../database/ninja_data.json');
    const data = await response.json();

    let playerLevel = 1;
    let availableSkillPoints = 50;
    let spentSkillPoints = 0;
    let skillPointsAllocation = {};

    // Inicializar puntos de habilidades en 0
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

        // Event listeners para botones de habilidades
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
