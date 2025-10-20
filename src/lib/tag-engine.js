/**
 * Tag Engine
 * Sistema de matching de tags para automação de buffs/efeitos
 */

/**
 * Verifica se uma tag ou array de tags contém outra tag
 * Suporta matching hierárquico (ex: "weapon.sword" contém "weapon")
 * 
 * @param {string|string[]} tags - Tags do item/ação
 * @param {string} trigger - Tag de trigger da habilidade
 * @returns {boolean}
 */
export function matchesTag(tags, trigger) {
  const tagArray = Array.isArray(tags) ? tags : [tags];
  
  return tagArray.some(tag => {
    // Match exato
    if (tag === trigger) return true;
    
    // Match hierárquico (ex: "weapon.sword.longsword" contém "weapon")
    if (tag.includes('.')) {
      const parts = tag.split('.');
      return parts.includes(trigger);
    }
    
    // Match reverso (ex: trigger "weapon.sword" e tag "sword")
    if (trigger.includes('.')) {
      const parts = trigger.split('.');
      return parts.includes(tag);
    }
    
    return false;
  });
}

/**
 * Verifica se um array de tags contém QUALQUER trigger de um array de triggers
 * 
 * @param {string[]} tags - Tags do item/ação
 * @param {string[]} triggers - Tags de trigger da habilidade
 * @returns {boolean}
 */
export function matchesAnyTrigger(tags, triggers) {
  if (!triggers || triggers.length === 0) return false;
  
  return triggers.some(trigger => matchesTag(tags, trigger));
}

/**
 * Busca todas as habilidades que se aplicam a um conjunto de tags
 * 
 * @param {string[]} actionTags - Tags da ação sendo executada
 * @param {Array} abilities - Lista de habilidades do personagem
 * @returns {Object} - { passives, actives, available }
 */
export function getApplicableEffects(actionTags, abilities) {
  if (!abilities || abilities.length === 0) {
    return { passives: [], actives: [], available: [] };
  }
  
  const passives = [];
  const actives = [];
  const available = [];
  
  abilities.forEach(ability => {
    // Ignora habilidades sem trigger ou sem efeito
    if (!ability.trigger || !ability.effect) return;
    
    // Verifica se algum trigger da habilidade matcha com as tags da ação
    const matches = matchesAnyTrigger(actionTags, ability.trigger);
    
    if (!matches) return;
    
    // Classifica por tipo
    switch (ability.type) {
      case 'passive':
        // Passivos sempre aplicam
        passives.push(ability);
        break;
        
      case 'duration':
        if (ability.active) {
          // Se estiver ativo, entra nos ativos
          actives.push(ability);
        }
        break;
        
      case 'instant':
        // Instantâneos são recursos disponíveis para usar
        if (ability.uses && ability.uses.current > 0) {
          available.push(ability);
        }
        break;
    }
  });
  
  return {
    passives,   // Sempre aplicam automaticamente
    actives,    // Estão ativos no momento
    available   // Podem ser usados (jogador decide)
  };
}

/**
 * Calcula o bônus total de dano de um conjunto de efeitos
 * 
 * @param {Array} effects - Lista de efeitos (abilities com effect.damageBonus)
 * @returns {Object} - { formula: string, flat: number, breakdown: Array }
 */
export function calculateDamageBonus(effects) {
  const dice = [];
  let flat = 0;
  const breakdown = [];
  
  effects.forEach(effect => {
    if (!effect.effect || !effect.effect.damageBonus) return;
    
    const bonus = effect.effect.damageBonus;
    
    if (typeof bonus === 'string') {
      // É uma fórmula de dado (ex: "1d4", "2d6")
      dice.push(bonus);
      breakdown.push({
        source: effect.name,
        value: bonus,
        type: effect.effect.damageType || 'same'
      });
    } else if (typeof bonus === 'number') {
      // É um valor fixo
      flat += bonus;
      breakdown.push({
        source: effect.name,
        value: `+${bonus}`,
        type: effect.effect.damageType || 'same'
      });
    }
  });
  
  // Monta fórmula final
  const formula = [...dice, flat > 0 ? flat : null]
    .filter(Boolean)
    .join(' + ');
  
  return {
    formula,
    flat,
    dice,
    breakdown
  };
}

/**
 * Calcula o bônus total de ataque de um conjunto de efeitos
 * 
 * @param {Array} effects - Lista de efeitos (abilities com effect.attackBonus)
 * @returns {Object} - { total: number, breakdown: Array }
 */
export function calculateAttackBonus(effects) {
  let total = 0;
  const breakdown = [];
  
  effects.forEach(effect => {
    if (!effect.effect || typeof effect.effect.attackBonus !== 'number') return;
    
    total += effect.effect.attackBonus;
    breakdown.push({
      source: effect.name,
      value: effect.effect.attackBonus
    });
  });
  
  return { total, breakdown };
}

/**
 * Resolve os modificadores de um ataque completo
 * Combina atributos, proficiência e efeitos ativos
 * 
 * @param {Object} params
 * @param {Object} params.item - Item sendo usado
 * @param {Object} params.character - Personagem
 * @param {Array} params.selectedEffects - Efeitos selecionados pelo jogador
 * @returns {Object} - Modificadores calculados
 */
export function resolveAttackModifiers({ item, character, selectedEffects = [] }) {
  const { attributes, proficiency } = character;
  
  // Determina atributo base (STR ou DEX geralmente)
  const attributeKey = item.action?.attackRoll?.includes('@DEX') ? 'DEX' : 'STR';
  const attributeMod = attributes[attributeKey].mod;
  
  // Calcula bônus de ataque dos efeitos
  const attackBonus = calculateAttackBonus(selectedEffects);
  
  // Total de modificador de ataque
  const attackModifier = attributeMod + proficiency + attackBonus.total;
  
  return {
    attribute: attributeKey,
    attributeMod,
    proficiency,
    effectsBonus: attackBonus.total,
    effectsBreakdown: attackBonus.breakdown,
    total: attackModifier
  };
}

/**
 * Resolve os modificadores de dano completo
 * 
 * @param {Object} params
 * @param {Object} params.item - Item sendo usado
 * @param {Object} params.character - Personagem
 * @param {Array} params.selectedEffects - Efeitos selecionados pelo jogador
 * @returns {Object} - Fórmula de dano e breakdown
 */
export function resolveDamageModifiers({ item, character, selectedEffects = [] }) {
  const { attributes } = character;
  
  // Determina atributo base
  const attributeKey = item.action?.damageRoll?.includes('@DEX') ? 'DEX' : 'STR';
  const attributeMod = attributes[attributeKey].mod;
  
  // Dano base do item
  const baseDamage = item.action?.damageRoll || '0';
  const baseType = item.action?.damageType || 'slashing';
  
  // Calcula bônus de dano dos efeitos
  const damageBonus = calculateDamageBonus(selectedEffects);
  
  // Monta fórmula final
  // Substitui placeholders (@STR, @DEX)
  let formula = baseDamage
    .replace('@STR', attributes.STR.mod)
    .replace('@DEX', attributes.DEX.mod)
    .replace('@CON', attributes.CON.mod)
    .replace('@INT', attributes.INT.mod)
    .replace('@WIS', attributes.WIS.mod)
    .replace('@CHA', attributes.CHA.mod);
  
  // Adiciona bônus de efeitos
  if (damageBonus.formula) {
    formula += ' + ' + damageBonus.formula;
  }
  
  // Breakdown detalhado
  const breakdown = [
    {
      source: item.name,
      formula: baseDamage.replace(`@${attributeKey}`, `+${attributeMod}`),
      type: baseType
    },
    ...damageBonus.breakdown
  ];
  
  return {
    formula,
    baseType,
    breakdown,
    attribute: attributeKey,
    attributeMod
  };
}

/**
 * Valida se uma habilidade pode ser usada
 * 
 * @param {Object} ability - Habilidade a validar
 * @returns {Object} - { valid: boolean, reason: string }
 */
export function validateAbilityUsage(ability) {
  // Tipo instant: precisa ter usos disponíveis
  if (ability.type === 'instant') {
    if (!ability.uses) {
      return { valid: true };
    }
    if (ability.uses.current <= 0) {
      return { valid: false, reason: 'Sem usos disponíveis' };
    }
    return { valid: true };
  }
  
  // Tipo duration: precisa não estar ativo E ter usos disponíveis
  if (ability.type === 'duration') {
    if (ability.active) {
      return { valid: false, reason: 'Já está ativo' };
    }
    if (!ability.uses) {
      return { valid: true };
    }
    if (ability.uses.current <= 0) {
      return { valid: false, reason: 'Sem cargas disponíveis' };
    }
    return { valid: true };
  }
  
  // Passive sempre válido
  return { valid: true };
}

/**
 * Agrupa efeitos por tipo de dano
 * 
 * @param {Array} breakdown - Breakdown de dano
 * @returns {Array} - Dano agrupado por tipo
 */
export function groupDamageByType(breakdown) {
  const grouped = {};
  
  breakdown.forEach(item => {
    const type = item.type || 'physical';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(item);
  });
  
  return Object.entries(grouped).map(([type, items]) => ({
    type,
    items
  }));
}