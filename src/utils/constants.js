/**
 * Constantes do sistema
 * Valores fixos usados em todo o app
 */

// ==================== ATRIBUTOS ====================
export const ATTRIBUTES = {
  STR: 'STR',
  DEX: 'DEX',
  CON: 'CON',
  INT: 'INT',
  WIS: 'WIS',
  CHA: 'CHA'
};

export const ATTRIBUTE_NAMES = {
  STR: 'Força',
  DEX: 'Destreza',
  CON: 'Constituição',
  INT: 'Inteligência',
  WIS: 'Sabedoria',
  CHA: 'Carisma'
};

// ==================== CLASSES ====================
export const CLASSES = {
  BARBARIAN: 'barbarian',
  BARD: 'bard',
  CLERIC: 'cleric',
  DRUID: 'druid',
  FIGHTER: 'fighter',
  MONK: 'monk',
  PALADIN: 'paladin',
  RANGER: 'ranger',
  ROGUE: 'rogue',
  SORCERER: 'sorcerer',
  WARLOCK: 'warlock',
  WIZARD: 'wizard'
};

export const CLASS_NAMES = {
  barbarian: 'Bárbaro',
  bard: 'Bardo',
  cleric: 'Clérigo',
  druid: 'Druida',
  fighter: 'Guerreiro',
  monk: 'Monge',
  paladin: 'Paladino',
  ranger: 'Patrulheiro',
  rogue: 'Ladino',
  sorcerer: 'Feiticeiro',
  warlock: 'Bruxo',
  wizard: 'Mago'
};

// ==================== TEMPLATES ====================
export const TEMPLATES = {
  MARTIAL: 'martial',
  CASTER: 'caster',
  HYBRID: 'hybrid',
  CUSTOM: 'custom'
};

export const TEMPLATE_NAMES = {
  martial: 'Marcial',
  caster: 'Conjurador',
  hybrid: 'Híbrido',
  custom: 'Customizado'
};

// Mapeamento de classe para template sugerido
export const CLASS_TO_TEMPLATE = {
  barbarian: TEMPLATES.MARTIAL,
  fighter: TEMPLATES.MARTIAL,
  rogue: TEMPLATES.MARTIAL,
  monk: TEMPLATES.MARTIAL,
  wizard: TEMPLATES.CASTER,
  sorcerer: TEMPLATES.CASTER,
  cleric: TEMPLATES.CASTER,
  druid: TEMPLATES.CASTER,
  warlock: TEMPLATES.CASTER,
  bard: TEMPLATES.HYBRID,
  paladin: TEMPLATES.HYBRID,
  ranger: TEMPLATES.HYBRID
};

// ==================== TIPOS DE ITEM ====================
export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  CONSUMABLE: 'consumable',
  TOOL: 'tool',
  MISC: 'misc'
};

// ==================== TIPOS DE AÇÃO ====================
export const ACTION_TYPES = {
  ATTACK: 'attack',
  SPELL: 'spell',
  UTILITY: 'utility'
};

// ==================== TIPOS DE HABILIDADE ====================
export const ABILITY_TYPES = {
  PASSIVE: 'passive',      // Sempre ativo (Sword Mastery)
  INSTANT: 'instant',      // Usa e acabou (Action Surge)
  DURATION: 'duration'     // Ativa por X turnos (Rage)
};

export const RESOURCE_TYPES = {
  ABILITY: 'ability',      // Habilidade de classe
  TACTICAL: 'tactical',    // Recurso tático (manobras)
  SPELL: 'spell'          // Slot de magia
};

// ==================== TIPOS DE RECARGA ====================
export const RECHARGE_TYPES = {
  SHORT_REST: 'short-rest',
  LONG_REST: 'long-rest',
  DAWN: 'dawn',
  MANUAL: 'manual'
};

// ==================== TIPOS DE DANO ====================
export const DAMAGE_TYPES = {
  // Físicos
  SLASHING: 'slashing',
  PIERCING: 'piercing',
  BLUDGEONING: 'bludgeoning',
  
  // Elementais
  FIRE: 'fire',
  COLD: 'cold',
  LIGHTNING: 'lightning',
  THUNDER: 'thunder',
  ACID: 'acid',
  
  // Mágicos
  FORCE: 'force',
  PSYCHIC: 'psychic',
  RADIANT: 'radiant',
  NECROTIC: 'necrotic',
  POISON: 'poison'
};

export const DAMAGE_TYPE_NAMES = {
  slashing: 'Cortante',
  piercing: 'Perfurante',
  bludgeoning: 'Contundente',
  fire: 'Fogo',
  cold: 'Gelo',
  lightning: 'Elétrico',
  thunder: 'Trovão',
  acid: 'Ácido',
  force: 'Energia',
  psychic: 'Psíquico',
  radiant: 'Radiante',
  necrotic: 'Necrótico',
  poison: 'Veneno'
};

// ==================== TAGS PADRÃO ====================
export const TAGS = {
  // Categorias de arma
  WEAPON: 'weapon',
  SWORD: 'sword',
  AXE: 'axe',
  BOW: 'bow',
  STAFF: 'staff',
  DAGGER: 'dagger',
  
  // Tipo de ataque
  MELEE: 'melee',
  RANGED: 'ranged',
  
  // Propriedades
  MAGICAL: 'magical',
  FINESSE: 'finesse',
  HEAVY: 'heavy',
  LIGHT: 'light',
  VERSATILE: 'versatile',
  
  // Ações
  ATTACK: 'attack',
  SPELL: 'spell',
  HEALING: 'healing',
  BUFF: 'buff',
  DEBUFF: 'debuff',
  
  // Elementos
  FIRE: 'fire',
  COLD: 'cold',
  LIGHTNING: 'lightning',
  POISON: 'poison',
  ACID: 'acid',
  RADIANT: 'radiant',
  NECROTIC: 'necrotic'
};

// ==================== MODOS DE ROLAGEM ====================
export const ROLL_MODES = {
  VIRTUAL: 'virtual',
  MANUAL: 'manual'
};

// ==================== AÇÕES DE COMBATE ====================
export const COMBAT_ACTIONS = {
  ATTACK: 'attack',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  END_TURN: 'end-turn',
  REST: 'rest'
};

// ==================== TIPOS DE DESCANSO ====================
export const REST_TYPES = {
  SHORT: 'short-rest',
  LONG: 'long-rest'
};

// ==================== NÍVEIS DE PROFICIÊNCIA ====================
// Tabela de bônus de proficiência por nível
export const PROFICIENCY_BY_LEVEL = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3,
  9: 4, 10: 4, 11: 4, 12: 4,
  13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6, 20: 6
};

// ==================== FÓRMULAS MATEMÁTICAS ====================
/**
 * Calcula modificador de atributo
 * @param {number} score - Valor do atributo (1-30)
 * @returns {number} Modificador
 */
export const calculateModifier = (score) => {
  return Math.floor((score - 10) / 2);
};

/**
 * Calcula bônus de proficiência por nível
 * @param {number} level - Nível do personagem (1-20)
 * @returns {number} Bônus de proficiência
 */
export const calculateProficiency = (level) => {
  return PROFICIENCY_BY_LEVEL[level] || 2;
};

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  CHARACTER: 'rpg_character',
  PREFERENCES: 'rpg_preferences',
  LIBRARY: 'rpg_library'
};

// ==================== DEFAULTS ====================
export const DEFAULT_PREFERENCES = {
  defaultRollMode: ROLL_MODES.VIRTUAL,
  autoAdvanceToDamage: true,
  confirmHit: true,
  saveHistoryOnRest: false
};

export const DEFAULT_HP = {
  current: 10,
  max: 10,
  temp: 0
};

export const DEFAULT_ATTRIBUTES = {
  STR: { score: 10, mod: 0 },
  DEX: { score: 10, mod: 0 },
  CON: { score: 10, mod: 0 },
  INT: { score: 10, mod: 0 },
  WIS: { score: 10, mod: 0 },
  CHA: { score: 10, mod: 0 }
};