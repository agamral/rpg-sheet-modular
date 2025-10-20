/**
 * Type definitions usando JSDoc
 * Proporciona autocomplete no VSCode sem TypeScript
 */

/**
 * @typedef {Object} Attribute
 * @property {number} score - Valor do atributo (1-30)
 * @property {number} mod - Modificador calculado
 */

/**
 * @typedef {Object} Character
 * @property {string} id - ID único do personagem
 * @property {string} name - Nome do personagem
 * @property {string} class - Classe do personagem
 * @property {number} level - Nível (1-20)
 * @property {string} template - Template de ficha
 * @property {Object.<string, Attribute>} attributes - Atributos (STR, DEX, etc)
 * @property {number} proficiency - Bônus de proficiência
 * @property {HP} hp - Pontos de vida
 * @property {Item[]} items - Itens/Armas
 * @property {Ability[]} abilities - Habilidades/Recursos
 * @property {ActiveEffect[]} activeEffects - Efeitos ativos
 * @property {CombatLogEntry[]} combatLog - Histórico de combate
 * @property {Preferences} preferences - Preferências do usuário
 */

/**
 * @typedef {Object} HP
 * @property {number} current - HP atual
 * @property {number} max - HP máximo
 * @property {number} temp - HP temporário
 */

/**
 * @typedef {Object} Item
 * @property {string} id - ID único
 * @property {string} name - Nome do item
 * @property {string} type - Tipo (weapon, armor, etc)
 * @property {string[]} tags - Tags para matching
 * @property {string} [basedOn] - ID do item base (se customizado)
 * @property {Action} [action] - Ação associada
 * @property {boolean} [equipped] - Se está equipado
 */

/**
 * @typedef {Object} Action
 * @property {string} type - Tipo de ação (attack, spell, etc)
 * @property {string} [attackRoll] - Fórmula de ataque
 * @property {string} [damageRoll] - Fórmula de dano
 * @property {string} [damageType] - Tipo de dano
 * @property {string} [bonusDamage] - Dano bônus adicional
 */

/**
 * @typedef {Object} Ability
 * @property {string} id - ID único
 * @property {string} name - Nome da habilidade
 * @property {string} type - Tipo (passive, instant, duration)
 * @property {string} [resourceType] - Tipo de recurso (ability, tactical, spell)
 * @property {string[]} [tags] - Tags que a habilidade possui
 * @property {string[]} [trigger] - Tags que ativam a habilidade
 * @property {Uses} [uses] - Usos/cargas
 * @property {Duration} [duration] - Duração em turnos
 * @property {string} recharge - Como recarrega (short-rest, long-rest, etc)
 * @property {boolean} active - Se está ativa
 * @property {Effect} effect - Efeito que aplica
 */

/**
 * @typedef {Object} Uses
 * @property {number} current - Usos atuais
 * @property {number} max - Usos máximos
 */

/**
 * @typedef {Object} Duration
 * @property {number} current - Turnos restantes
 * @property {number} max - Duração máxima
 */

/**
 * @typedef {Object} Effect
 * @property {string} [description] - Descrição textual
 * @property {string|number} [damageBonus] - Bônus de dano
 * @property {string} [damageType] - Tipo do dano bônus
 * @property {number} [attackBonus] - Bônus no ataque
 * @property {string[]} [resistances] - Resistências concedidas
 */

/**
 * @typedef {Object} ActiveEffect
 * @property {string} id - ID único
 * @property {string} sourceId - ID da habilidade que originou
 * @property {string} name - Nome do efeito
 * @property {Duration} duration - Duração em turnos
 * @property {Effect} effect - Efeito aplicado
 */

/**
 * @typedef {Object} CombatLogEntry
 * @property {string} id - ID único
 * @property {number} turn - Número do turno
 * @property {string} timestamp - ISO timestamp
 * @property {string} action - Tipo de ação (attack, activate, etc)
 * @property {string} [weapon] - Nome da arma
 * @property {AttackRoll} [attackRoll] - Dados do ataque
 * @property {boolean} [hit] - Se acertou
 * @property {DamageRoll} [damageRoll] - Dados do dano
 * @property {string} [ability] - Nome da habilidade
 * @property {number} [duration] - Duração ativada
 * @property {string[]} [resourcesUsed] - IDs de recursos consumidos
 * @property {EffectUpdate[]} [effectsUpdated] - Efeitos atualizados
 */

/**
 * @typedef {Object} AttackRoll
 * @property {string} mode - Modo de rolagem (virtual/manual)
 * @property {number} d20 - Resultado do d20
 * @property {number} modifier - Modificadores totais
 * @property {number} total - Total final
 */

/**
 * @typedef {Object} DamageRoll
 * @property {string} formula - Fórmula completa
 * @property {number} result - Resultado total
 * @property {string} breakdown - Quebra detalhada
 * @property {DamageByType[]} types - Dano por tipo
 */

/**
 * @typedef {Object} DamageByType
 * @property {string} type - Tipo de dano
 * @property {number} amount - Quantidade
 */

/**
 * @typedef {Object} EffectUpdate
 * @property {string} name - Nome do efeito
 * @property {number} duration - Duração restante
 */

/**
 * @typedef {Object} Preferences
 * @property {string} defaultRollMode - Modo padrão (virtual/manual)
 * @property {boolean} autoAdvanceToDamage - Avançar automaticamente para dano
 * @property {boolean} confirmHit - Pedir confirmação de acerto
 * @property {boolean} [saveHistoryOnRest] - Limpar histórico ao descansar
 */

// Exporta vazio para ser considerado um módulo
export {};