import { matchesTag, matchesAnyTrigger, getApplicableEffects } from './tag-engine.js';

// Teste 1: Match exato
console.log('Teste 1:', matchesTag(['weapon', 'sword'], 'sword')); // true

// Teste 2: Match hierárquico
console.log('Teste 2:', matchesTag(['weapon.sword.longsword'], 'sword')); // true

// Teste 3: Sem match
console.log('Teste 3:', matchesTag(['weapon', 'axe'], 'sword')); // false

// Teste 4: Array de triggers
console.log('Teste 4:', matchesAnyTrigger(['weapon', 'melee'], ['sword', 'melee'])); // true

// Teste 5: Aplicação real
const abilities = [
  {
    name: 'Sword Mastery',
    type: 'passive',
    trigger: ['sword'],
    effect: { damageBonus: '1d4' }
  },
  {
    name: 'Rage',
    type: 'duration',
    trigger: ['attack'],
    active: true,
    effect: { damageBonus: 2 }
  }
];

const result = getApplicableEffects(['weapon', 'sword', 'longsword'], abilities);
console.log('Teste 5:', result);
// Deve retornar:
// {
//   passives: [Sword Mastery],
//   actives: [Rage],
//   available: []
// }