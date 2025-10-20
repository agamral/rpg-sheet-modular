/**
 * Dice Roller
 * Sistema de rolagem de dados virtual para D&D
 */

/**
 * Rola um único dado
 * @param {number} sides - Número de lados (4, 6, 8, 10, 12, 20, 100)
 * @returns {number} - Resultado da rolagem
 */
export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Rola múltiplos dados
 * @param {number} count - Quantidade de dados
 * @param {number} sides - Número de lados
 * @returns {Object} - { rolls: Array, total: number }
 */
export function rollDice(count, sides) {
  const rolls = [];
  let total = 0;
  
  for (let i = 0; i < count; i++) {
    const roll = rollDie(sides);
    rolls.push(roll);
    total += roll;
  }
  
  return { rolls, total };
}

/**
 * Parseia uma notação de dado (ex: "2d6", "1d20", "d8")
 * @param {string} notation - Notação do dado
 * @returns {Object|null} - { count: number, sides: number } ou null se inválido
 */
export function parseDiceNotation(notation) {
  const match = notation.trim().match(/^(\d*)d(\d+)$/i);
  
  if (!match) return null;
  
  const count = match[1] ? parseInt(match[1]) : 1;
  const sides = parseInt(match[2]);
  
  // Valida valores comuns de D&D
  const validSides = [4, 6, 8, 10, 12, 20, 100];
  if (!validSides.includes(sides)) {
    console.warn(`Lados incomuns: ${sides}. Continuando mesmo assim.`);
  }
  
  return { count, sides };
}

/**
 * Parseia uma fórmula completa de dados
 * Ex: "1d20+5", "2d6+1d4+3", "1d8+4-2"
 * 
 * @param {string} formula - Fórmula completa
 * @returns {Array} - Lista de componentes { type, value, count?, sides? }
 */
export function parseFormula(formula) {
  // Remove espaços
  const clean = formula.replace(/\s+/g, '');
  
  // Separa por + e -
  const parts = clean.split(/([+-])/);
  
  const components = [];
  let currentSign = '+';
  
  parts.forEach(part => {
    if (part === '+' || part === '-') {
      currentSign = part;
      return;
    }
    
    if (!part) return;
    
    // Verifica se é um dado (contém 'd')
    if (part.toLowerCase().includes('d')) {
      const parsed = parseDiceNotation(part);
      if (parsed) {
        components.push({
          type: 'dice',
          count: parsed.count,
          sides: parsed.sides,
          sign: currentSign
        });
      }
    } else {
      // É um número fixo
      const value = parseInt(part);
      if (!isNaN(value)) {
        components.push({
          type: 'modifier',
          value: currentSign === '-' ? -value : value
        });
      }
    }
  });
  
  return components;
}

/**
 * Rola uma fórmula completa de dados
 * Ex: "1d20+5", "2d6+1d4+3"
 * 
 * @param {string} formula - Fórmula completa
 * @returns {Object} - Resultado detalhado
 */
export function rollFormula(formula) {
  const components = parseFormula(formula);
  
  const results = [];
  let total = 0;
  
  components.forEach(component => {
    if (component.type === 'dice') {
      const result = rollDice(component.count, component.sides);
      const componentTotal = component.sign === '-' ? -result.total : result.total;
      
      results.push({
        type: 'dice',
        notation: `${component.count}d${component.sides}`,
        rolls: result.rolls,
        subtotal: result.total,
        total: componentTotal,
        sign: component.sign
      });
      
      total += componentTotal;
    } else if (component.type === 'modifier') {
      results.push({
        type: 'modifier',
        value: component.value
      });
      
      total += component.value;
    }
  });
  
  return {
    formula,
    total,
    results
  };
}

/**
 * Formata o resultado de uma rolagem em string legível
 * 
 * @param {Object} rollResult - Resultado do rollFormula
 * @returns {string} - String formatada
 */
export function formatRollResult(rollResult) {
  const parts = [];
  
  rollResult.results.forEach(result => {
    if (result.type === 'dice') {
      const sign = result.sign === '-' ? '-' : '';
      const rollsStr = result.rolls.join(', ');
      parts.push(`${sign}${result.notation}[${rollsStr}] = ${Math.abs(result.total)}`);
    } else {
      const sign = result.value >= 0 ? '+' : '';
      parts.push(`${sign}${result.value}`);
    }
  });
  
  return `${parts.join(' ')} = ${rollResult.total}`;
}

/**
 * Formata breakdown de forma simplificada
 * Ex: "1d20[14] + 5 = 19"
 * 
 * @param {Object} rollResult - Resultado do rollFormula
 * @returns {string} - String simplificada
 */
export function formatRollSimple(rollResult) {
  const parts = [];
  
  rollResult.results.forEach(result => {
    if (result.type === 'dice') {
      const sign = result.sign === '-' ? '-' : '';
      // Mostra apenas o total dos dados, não cada rolagem individual
      parts.push(`${sign}${result.notation}[${result.subtotal}]`);
    } else {
      const sign = result.value >= 0 ? (parts.length > 0 ? '+' : '') : '';
      parts.push(`${sign}${result.value}`);
    }
  });
  
  return `${parts.join(' ')} = ${rollResult.total}`;
}

/**
 * Rola com vantagem (rola 2d20, pega o maior)
 * 
 * @param {string} formula - Fórmula base (ex: "1d20+5")
 * @returns {Object} - Resultado com ambas as rolagens
 */
export function rollWithAdvantage(formula) {
  // Remove o d20 da fórmula para rolar separadamente
  const baseFormula = formula.replace(/1?d20/i, '').replace(/^\+/, '');
  
  const roll1 = rollDie(20);
  const roll2 = rollDie(20);
  const chosen = Math.max(roll1, roll2);
  
  // Calcula modificadores
  const modResult = baseFormula ? rollFormula(baseFormula) : { total: 0, results: [] };
  const total = chosen + modResult.total;
  
  return {
    type: 'advantage',
    formula,
    roll1,
    roll2,
    chosen,
    modifier: modResult.total,
    total,
    display: `1d20[${roll1}, ${roll2}] (vantagem: ${chosen}) ${modResult.total >= 0 ? '+' : ''}${modResult.total} = ${total}`
  };
}

/**
 * Rola com desvantagem (rola 2d20, pega o menor)
 * 
 * @param {string} formula - Fórmula base (ex: "1d20+5")
 * @returns {Object} - Resultado com ambas as rolagens
 */
export function rollWithDisadvantage(formula) {
  // Remove o d20 da fórmula para rolar separadamente
  const baseFormula = formula.replace(/1?d20/i, '').replace(/^\+/, '');
  
  const roll1 = rollDie(20);
  const roll2 = rollDie(20);
  const chosen = Math.min(roll1, roll2);
  
  // Calcula modificadores
  const modResult = baseFormula ? rollFormula(baseFormula) : { total: 0, results: [] };
  const total = chosen + modResult.total;
  
  return {
    type: 'disadvantage',
    formula,
    roll1,
    roll2,
    chosen,
    modifier: modResult.total,
    total,
    display: `1d20[${roll1}, ${roll2}] (desvantagem: ${chosen}) ${modResult.total >= 0 ? '+' : ''}${modResult.total} = ${total}`
  };
}

/**
 * Verifica se um resultado de d20 é crítico
 * 
 * @param {number} d20Result - Resultado do d20
 * @returns {Object} - { isCritical: boolean, isCriticalFail: boolean }
 */
export function checkCritical(d20Result) {
  return {
    isCritical: d20Result === 20,
    isCriticalFail: d20Result === 1
  };
}

/**
 * Rola dano crítico (dobra os dados)
 * Ex: "1d8+4" vira "2d8+4"
 * 
 * @param {string} formula - Fórmula original
 * @returns {Object} - Resultado da rolagem crítica
 */
export function rollCriticalDamage(formula) {
  // Parseia a fórmula
  const components = parseFormula(formula);
  
  // Dobra apenas os dados, não os modificadores
  const criticalComponents = components.map(comp => {
    if (comp.type === 'dice') {
      return { ...comp, count: comp.count * 2 };
    }
    return comp;
  });
  
  // Reconstroi a fórmula
  const criticalFormula = criticalComponents.map(comp => {
    if (comp.type === 'dice') {
      return `${comp.sign === '-' ? '-' : ''}${comp.count}d${comp.sides}`;
    }
    return comp.value >= 0 ? `+${comp.value}` : comp.value;
  }).join('');
  
  const result = rollFormula(criticalFormula);
  
  return {
    ...result,
    originalFormula: formula,
    isCritical: true
  };
}

/**
 * Calcula a média de uma fórmula (sem rolar)
 * Útil para estimativas
 * 
 * @param {string} formula - Fórmula de dados
 * @returns {number} - Média esperada
 */
export function calculateAverage(formula) {
  const components = parseFormula(formula);
  let average = 0;
  
  components.forEach(comp => {
    if (comp.type === 'dice') {
      // Média de um dado é (sides + 1) / 2
      const diceAvg = (comp.sides + 1) / 2;
      const total = comp.count * diceAvg;
      average += comp.sign === '-' ? -total : total;
    } else {
      average += comp.value;
    }
  });
  
  return Math.round(average * 10) / 10; // Arredonda para 1 casa decimal
}

/**
 * Validações e helpers
 */

/**
 * Valida se uma fórmula é válida
 * 
 * @param {string} formula - Fórmula a validar
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validateFormula(formula) {
  try {
    const components = parseFormula(formula);
    
    if (components.length === 0) {
      return { valid: false, error: 'Fórmula vazia ou inválida' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}