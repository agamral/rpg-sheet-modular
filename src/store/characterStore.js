import { create } from 'zustand';
import { 
  calculateModifier, 
  calculateProficiency,
  DEFAULT_ATTRIBUTES,
  DEFAULT_HP,
  DEFAULT_PREFERENCES,
  STORAGE_KEYS,
  RECHARGE_TYPES,
  COMBAT_ACTIONS
} from '../utils/constants';

/**
 * Zustand Store - Gerenciamento de estado do personagem
 */
export const useCharacterStore = create((set, get) => ({
  // ==================== ESTADO ====================
  character: null,
  currentTurn: 0,

  // ==================== AÇÕES: CRUD PERSONAGEM ====================
  
  /**
   * Cria um novo personagem
   */
  createCharacter: (data) => {
    const character = {
      id: crypto.randomUUID(),
      name: data.name || 'Novo Personagem',
      class: data.class,
      level: data.level || 1,
      template: data.template,
      
      attributes: { ...DEFAULT_ATTRIBUTES },
      proficiency: calculateProficiency(data.level || 1),
      
      hp: { ...DEFAULT_HP },
      
      items: [],
      abilities: [],
      activeEffects: [],
      combatLog: [],
      
      preferences: { ...DEFAULT_PREFERENCES }
    };
    
    set({ character, currentTurn: 0 });
    get().saveCharacter();
  },

  /**
   * Carrega personagem do localStorage
   */
  loadCharacter: (id) => {
    const saved = localStorage.getItem(`${STORAGE_KEYS.CHARACTER}_${id}`);
    if (saved) {
      const character = JSON.parse(saved);
      set({ character, currentTurn: 0 });
      return true;
    }
    return false;
  },

  /**
   * Salva personagem no localStorage
   */
  saveCharacter: () => {
    const { character } = get();
    if (character) {
      localStorage.setItem(
        `${STORAGE_KEYS.CHARACTER}_${character.id}`, 
        JSON.stringify(character)
      );
    }
  },

  /**
   * Deleta personagem
   */
  deleteCharacter: (id) => {
    localStorage.removeItem(`${STORAGE_KEYS.CHARACTER}_${id}`);
    set({ character: null, currentTurn: 0 });
  },

  // ==================== AÇÕES: ATRIBUTOS ====================
  
  /**
   * Atualiza valor de um atributo
   */
  updateAttribute: (attr, value) => {
    set((state) => ({
      character: {
        ...state.character,
        attributes: {
          ...state.character.attributes,
          [attr]: {
            score: value,
            mod: calculateModifier(value)
          }
        }
      }
    }));
    get().saveCharacter();
  },

  /**
   * Atualiza múltiplos atributos de uma vez
   */
  updateAttributes: (attributes) => {
    set((state) => {
      const updated = { ...state.character.attributes };
      
      Object.entries(attributes).forEach(([attr, value]) => {
        updated[attr] = {
          score: value,
          mod: calculateModifier(value)
        };
      });
      
      return {
        character: {
          ...state.character,
          attributes: updated
        }
      };
    });
    get().saveCharacter();
  },

  /**
   * Atualiza nível e recalcula proficiência
   */
  updateLevel: (level) => {
    set((state) => ({
      character: {
        ...state.character,
        level,
        proficiency: calculateProficiency(level)
      }
    }));
    get().saveCharacter();
  },

  // ==================== AÇÕES: HP ====================
  
  /**
   * Atualiza HP atual
   */
  updateHP: (value) => {
    set((state) => ({
      character: {
        ...state.character,
        hp: {
          ...state.character.hp,
          current: Math.max(0, Math.min(value, state.character.hp.max))
        }
      }
    }));
    get().saveCharacter();
  },

  /**
   * Recebe dano
   */
  takeDamage: (amount) => {
    set((state) => {
      const { hp } = state.character;
      let remaining = amount;
      let newTemp = hp.temp;
      let newCurrent = hp.current;
      
      // Primeiro consome HP temporário
      if (newTemp > 0) {
        if (remaining <= newTemp) {
          newTemp -= remaining;
          remaining = 0;
        } else {
          remaining -= newTemp;
          newTemp = 0;
        }
      }
      
      // Depois HP normal
      newCurrent = Math.max(0, newCurrent - remaining);
      
      return {
        character: {
          ...state.character,
          hp: {
            ...hp,
            current: newCurrent,
            temp: newTemp
          }
        }
      };
    });
    get().saveCharacter();
  },

  /**
   * Recebe cura
   */
  heal: (amount) => {
    set((state) => ({
      character: {
        ...state.character,
        hp: {
          ...state.character.hp,
          current: Math.min(
            state.character.hp.current + amount,
            state.character.hp.max
          )
        }
      }
    }));
    get().saveCharacter();
  },

  /**
   * Adiciona HP temporário
   */
  addTempHP: (amount) => {
    set((state) => ({
      character: {
        ...state.character,
        hp: {
          ...state.character.hp,
          temp: Math.max(state.character.hp.temp, amount) // Sempre usa o maior
        }
      }
    }));
    get().saveCharacter();
  },

  // ==================== AÇÕES: ITENS ====================
  
  /**
   * Adiciona item ao personagem
   */
  addItem: (item) => {
    set((state) => ({
      character: {
        ...state.character,
        items: [...state.character.items, { ...item, id: crypto.randomUUID() }]
      }
    }));
    get().saveCharacter();
  },

  /**
   * Remove item
   */
  removeItem: (itemId) => {
    set((state) => ({
      character: {
        ...state.character,
        items: state.character.items.filter(item => item.id !== itemId)
      }
    }));
    get().saveCharacter();
  },

  /**
   * Atualiza item existente
   */
  updateItem: (itemId, updates) => {
    set((state) => ({
      character: {
        ...state.character,
        items: state.character.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      }
    }));
    get().saveCharacter();
  },

  // ==================== AÇÕES: HABILIDADES ====================
  
  /**
   * Adiciona habilidade ao personagem
   */
  addAbility: (ability) => {
    set((state) => ({
      character: {
        ...state.character,
        abilities: [
          ...state.character.abilities, 
          { 
            ...ability, 
            id: crypto.randomUUID(),
            active: false,
            uses: ability.uses ? { ...ability.uses, current: ability.uses.max } : undefined,
            duration: ability.duration ? { ...ability.duration, current: 0 } : undefined
          }
        ]
      }
    }));
    get().saveCharacter();
  },

  /**
   * Remove habilidade
   */
  removeAbility: (abilityId) => {
    set((state) => ({
      character: {
        ...state.character,
        abilities: state.character.abilities.filter(ability => ability.id !== abilityId),
        activeEffects: state.character.activeEffects.filter(effect => effect.sourceId !== abilityId)
      }
    }));
    get().saveCharacter();
  },

  /**
   * Usa habilidade instantânea (tipo "instant")
   */
  useAbility: (abilityId) => {
    set((state) => {
      const ability = state.character.abilities.find(a => a.id === abilityId);
      
      if (!ability || ability.type !== 'instant') return state;
      if (ability.uses && ability.uses.current <= 0) return state;
      
      return {
        character: {
          ...state.character,
          abilities: state.character.abilities.map(a =>
            a.id === abilityId && a.uses
              ? { ...a, uses: { ...a.uses, current: a.uses.current - 1 } }
              : a
          )
        }
      };
    });
    
    // Adiciona ao log
    const ability = get().character.abilities.find(a => a.id === abilityId);
    get().addCombatLogEntry({
      action: COMBAT_ACTIONS.ACTIVATE,
      ability: ability.name,
      resourcesUsed: [abilityId]
    });
    
    get().saveCharacter();
  },

  /**
   * Ativa habilidade de duração (tipo "duration")
   */
  activateAbility: (abilityId) => {
    set((state) => {
      const ability = state.character.abilities.find(a => a.id === abilityId);
      
      if (!ability || ability.type !== 'duration') return state;
      if (ability.uses && ability.uses.current <= 0) return state;
      if (ability.active) return state; // Já está ativa
      
      // Cria efeito ativo
      const activeEffect = {
        id: crypto.randomUUID(),
        sourceId: abilityId,
        name: ability.name,
        duration: { 
          current: ability.duration.max, 
          max: ability.duration.max 
        },
        effect: ability.effect
      };
      
      return {
        character: {
          ...state.character,
          abilities: state.character.abilities.map(a =>
            a.id === abilityId
              ? {
                  ...a,
                  active: true,
                  uses: a.uses ? { ...a.uses, current: a.uses.current - 1 } : a.uses,
                  duration: { ...a.duration, current: a.duration.max }
                }
              : a
          ),
          activeEffects: [...state.character.activeEffects, activeEffect]
        }
      };
    });
    
    // Adiciona ao log
    const ability = get().character.abilities.find(a => a.id === abilityId);
    get().addCombatLogEntry({
      action: COMBAT_ACTIONS.ACTIVATE,
      ability: ability.name,
      duration: ability.duration.max,
      resourcesUsed: [abilityId]
    });
    
    get().saveCharacter();
  },

  /**
   * Desativa habilidade de duração manualmente
   */
  deactivateAbility: (abilityId) => {
    set((state) => ({
      character: {
        ...state.character,
        abilities: state.character.abilities.map(a =>
          a.id === abilityId
            ? { ...a, active: false, duration: { ...a.duration, current: 0 } }
            : a
        ),
        activeEffects: state.character.activeEffects.filter(e => e.sourceId !== abilityId)
      }
    }));
    
    const ability = get().character.abilities.find(a => a.id === abilityId);
    get().addCombatLogEntry({
      action: COMBAT_ACTIONS.DEACTIVATE,
      ability: ability.name
    });
    
    get().saveCharacter();
  },

  // ==================== AÇÕES: FIM DE TURNO ====================
  
  /**
   * Processa fim de turno (decrementa durações)
   */
  endTurn: () => {
    const effectsUpdated = [];
    
    set((state) => {
      const updatedEffects = [];
      const updatedAbilities = state.character.abilities.map(ability => {
        if (!ability.active) return ability;
        
        const newDuration = ability.duration.current - 1;
        
        // Registra mudança
        effectsUpdated.push({
          name: ability.name,
          duration: newDuration
        });
        
        if (newDuration <= 0) {
          // Desativa se chegou a 0
          return {
            ...ability,
            active: false,
            duration: { ...ability.duration, current: 0 }
          };
        }
        
        return {
          ...ability,
          duration: { ...ability.duration, current: newDuration }
        };
      });
      
      // Atualiza activeEffects
      state.character.activeEffects.forEach(effect => {
        const newDuration = effect.duration.current - 1;
        
        if (newDuration > 0) {
          updatedEffects.push({
            ...effect,
            duration: { ...effect.duration, current: newDuration }
          });
        }
      });
      
      return {
        character: {
          ...state.character,
          abilities: updatedAbilities,
          activeEffects: updatedEffects
        },
        currentTurn: state.currentTurn + 1
      };
    });
    
    // Adiciona ao log
    get().addCombatLogEntry({
      action: COMBAT_ACTIONS.END_TURN,
      effectsUpdated
    });
    
    get().saveCharacter();
  },

  // ==================== AÇÕES: DESCANSOS ====================
  
  /**
   * Descanso curto
   */
  shortRest: () => {
    set((state) => ({
      character: {
        ...state.character,
        abilities: state.character.abilities.map(ability => {
          if (ability.recharge === RECHARGE_TYPES.SHORT_REST && ability.uses) {
            return {
              ...ability,
              uses: { ...ability.uses, current: ability.uses.max },
              active: false,
              duration: ability.duration ? { ...ability.duration, current: 0 } : undefined
            };
          }
          return ability;
        }),
        activeEffects: []
      },
      currentTurn: 0
    }));
    
    get().addCombatLogEntry({
      action: COMBAT_ACTIONS.REST,
      ability: 'Descanso Curto'
    });
    
    get().saveCharacter();
  },

  /**
   * Descanso longo
   */
  longRest: () => {
    set((state) => ({
      character: {
        ...state.character,
        hp: {
          ...state.character.hp,
          current: state.character.hp.max,
          temp: 0
        },
        abilities: state.character.abilities.map(ability => ({
          ...ability,
          uses: ability.uses ? { ...ability.uses, current: ability.uses.max } : undefined,
          active: false,
          duration: ability.duration ? { ...ability.duration, current: 0 } : undefined
        })),
        activeEffects: []
      },
      currentTurn: 0
    }));
    
    get().addCombatLogEntry({
      action: COMBAT_ACTIONS.REST,
      ability: 'Descanso Longo'
    });
    
    get().saveCharacter();
  },

  // ==================== AÇÕES: HISTÓRICO ====================
  
  /**
   * Adiciona entrada no histórico de combate
   */
  addCombatLogEntry: (entry) => {
    set((state) => ({
      character: {
        ...state.character,
        combatLog: [
          ...state.character.combatLog,
          {
            id: crypto.randomUUID(),
            turn: state.currentTurn,
            timestamp: new Date().toISOString(),
            ...entry
          }
        ]
      }
    }));
    get().saveCharacter();
  },

  /**
   * Limpa histórico de combate
   */
  clearCombatLog: () => {
    set((state) => ({
      character: {
        ...state.character,
        combatLog: []
      },
      currentTurn: 0
    }));
    get().saveCharacter();
  },

  // ==================== AÇÕES: PREFERÊNCIAS ====================
  
  /**
   * Atualiza preferências do usuário
   */
  updatePreferences: (prefs) => {
    set((state) => ({
      character: {
        ...state.character,
        preferences: {
          ...state.character.preferences,
          ...prefs
        }
      }
    }));
    get().saveCharacter();
  }
}));