class NinjaPlanner {
    constructor(data) {
        this.data = data;
        this.level = 1;
        this.availableSkillPoints = data.max_skill_points;
        this.skillPointsAllocated = {};
        
        data.skills.forEach(skill => {
            this.skillPointsAllocated[skill.id] = 0;
        });
    }

    setLevel(level) {
        this.level = parseInt(level);
        this.updateStatsDisplay();
    }

    allocateSkill(id) {
        const skill = this.data.skills.find(s => s.id === id);
        const currentPoints = this.skillPointsAllocated[id];
        
        let totalAllocated = Object.values(this.skillPointsAllocated).reduce((a, b) => a + b, 0);

        if (totalAllocated < this.data.max_skill_points && currentPoints < skill.max_points) {
            this.skillPointsAllocated[id]++;
            this.updateSkillsUI();
        }
    }

    removeSkill(id) {
        if (this.skillPointsAllocated[id] > 0) {
            this.skillPointsAllocated[id]--;
            this.updateSkillsUI();
        }
    }

    calculateStats() {
        const base = this.data.base_stats;
        const scaling = this.data.stat_scaling;
        const lvlFactor = this.level - 1;

        return {
            vida: Math.floor(base.vida_maxima + (scaling.vida_maxima_per_level * lvlFactor)),
            mana: Math.floor(base.mana_maxima + (scaling.mana_maxima_per_level * lvlFactor)),
            ataque: Math.floor(base.ataque + (scaling.ataque_per_level * lvlFactor)),
            defensa: Math.floor(base.defensa + (scaling.defensa_per_level * lvlFactor)),
            critico: base.critico,
            poder_critico: base.poder_critico
        };
    }

    updateStatsDisplay() {
        document.getElementById('level-val').innerText = this.level;
        const stats = this.calculateStats();
        const statsList = document.getElementById('stats-list');
        
        statsList.innerHTML = `
            <li>Vida Máxima: ${stats.vida}</li>
            <li>Maná Máximo: ${stats.mana}</li>
            <li>Ataque: ${stats.ataque}</li>
            <li>Defensa: ${stats.defensa}</li>
            <li>Crítico: ${stats.critico}%</li>
            <li>Poder Crítico: ${stats.poder_critico}%</li>
        `;
    }

    renderSkillsUI() {
        const container = document.getElementById('skills-container');
        container.innerHTML = '';

        this.data.skills.forEach(skill => {
            const current = this.skillPointsAllocated[skill.id];
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.innerHTML = `
                <div class="skill-icon" style="background-image: url('${skill.img}');"></div>
                <div class="skill-info">
                    <strong>${skill.name}</strong> [${current}/${skill.max_points}]
                    <p style="font-size: 11px; margin: 2px 0;">${skill.description}</p>
                </div>
                <div class="skill-controls">
                    <button onclick="window.ninjaPlanner.allocateSkill(${skill.id})">+</button>
                    <button onclick="window.ninjaPlanner.removeSkill(${skill.id})">-</button>
                </div>
            `;
            container.appendChild(card);
        });

        let totalAllocated = Object.values(this.skillPointsAllocated).reduce((a, b) => a + b, 0);
        document.getElementById('skill-points').innerText = this.data.max_skill_points - totalAllocated;
    }

    updateSkillsUI() {
        this.renderSkillsUI();
    }
}
