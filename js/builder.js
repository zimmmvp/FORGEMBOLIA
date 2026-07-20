class NinjaBuilder {
  constructor(maxPoints = 20) {
    this.maxPoints = maxPoints;
    this.spentPoints = 0;
    // Estado inicial de las habilidades basadas en sus IDs
    this.skills = {
      "soul_rush": { currentLevel: 0, maxLevel: 5, costPerLevel: 1 },
      "mana_damage": { currentLevel: 0, maxLevel: 3, costPerLevel: 2 },
      "soul_vortex": { currentLevel: 0, maxLevel: 1, costPerLevel: 5 }
    };
  }

  // Método para subir de nivel una habilidad
  allocatePoint(skillId) {
    const skill = this.skills[skillId];
    if (!skill) return { success: false, message: "Habilidad no encontrada." };

    if (skill.currentLevel >= skill.maxLevel) {
      return { success: false, message: "La habilidad ya está al máximo nivel." };
    }

    if (this.spentPoints + skill.costPerLevel > this.maxPoints) {
      return { success: false, message: "No tienes suficientes puntos disponibles." };
    }

    skill.currentLevel++;
    this.spentPoints += skill.costPerLevel;
    return { success: true, remainingPoints: this.maxPoints - this.spentPoints };
  }

  // Método para bajar de nivel una habilidad (refund)
  removePoint(skillId) {
    const skill = this.skills[skillId];
    if (!skill) return { success: false, message: "Habilidad no encontrada." };

    if (skill.currentLevel <= 0) {
      return { success: false, message: "La habilidad está en nivel 0." };
    }

    skill.currentLevel--;
    this.spentPoints -= skill.costPerLevel;
    return { success: true, remainingPoints: this.maxPoints - this.spentPoints };
  }

  getSummary() {
    return {
      maxPoints: this.maxPoints,
      spentPoints: this.spentPoints,
      remainingPoints: this.maxPoints - this.spentPoints,
      skills: this.skills
    };
  }
}

// Ejemplo de uso:
const myBuild = new NinjaBuilder(15);
console.log(myBuild.allocatePoint("soul_rush")); // Sube Soul Rush
console.log(myBuild.getSummary());
