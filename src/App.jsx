import { useCharacterStore } from './store/characterStore';
import { CLASSES, TEMPLATES, ATTRIBUTES } from './utils/constants';
import AttributeBlock from './components/blocks/AttributeBlock';
import HPBlock from './components/blocks/HPBlock';
import ResourceBlock from './components/blocks/ResourceBlock';
import TurnController from './components/panels/TurnController';
import CombatLog from './components/panels/CombatLog';
import DiceRollerTest from './components/ui/DiceRollerTest';
import library from './data/library.json';

function App() {
  const { character, createCharacter, updateAttributes, addAbility } = useCharacterStore();
  
  const handleCreateBarbarian = () => {
    createCharacter({
      name: 'Gorak, o Destruidor',
      class: CLASSES.BARBARIAN,
      level: 5,
      template: TEMPLATES.MARTIAL
    });
    
    updateAttributes({
      STR: 18,
      DEX: 14,
      CON: 16,
      INT: 8,
      WIS: 12,
      CHA: 10
    });
    
    library.abilities.barbarian.forEach(ability => {
      addAbility(ability);
    });
  };
  
  const handleCreateWizard = () => {
    createCharacter({
      name: 'Elara, a Sábia',
      class: CLASSES.WIZARD,
      level: 5,
      template: TEMPLATES.CASTER
    });
    
    updateAttributes({
      STR: 8,
      DEX: 14,
      CON: 12,
      INT: 18,
      WIS: 13,
      CHA: 10
    });
    
    library.abilities.wizard.forEach(ability => {
      addAbility(ability);
    });
  };
  
  const handleCreateFighter = () => {
    createCharacter({
      name: 'Thoran, o Cavaleiro',
      class: CLASSES.FIGHTER,
      level: 5,
      template: TEMPLATES.MARTIAL
    });
    
    updateAttributes({
      STR: 16,
      DEX: 14,
      CON: 15,
      INT: 10,
      WIS: 12,
      CHA: 11
    });
    
    library.abilities.fighter.forEach(ability => {
      addAbility(ability);
    });
  };
  
  return (
    <div className="min-h-screen p-8 bg-light">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-fantasy text-primary mb-2">
            Ficha Modular RPG
          </h1>
          <p className="text-gray-600">
            Sistema de gerenciamento de personagens D&D 5e
          </p>
        </header>
        
        <main>
          {!character ? (
            <div className="card">
              <h2 className="text-2xl font-fantasy mb-4">Criar Personagem</h2>
              <p className="text-gray-700 mb-4">
                Escolha uma classe para começar:
              </p>
              <div className="flex gap-4">
                <button onClick={handleCreateBarbarian} className="btn-primary">
                  🔥 Criar Bárbaro
                </button>
                <button onClick={handleCreateFighter} className="btn-primary">
                  ⚔️ Criar Guerreiro
                </button>
                <button onClick={handleCreateWizard} className="btn-secondary">
                  ✨ Criar Mago
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header do Personagem */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-fantasy text-primary">
                      {character.name}
                    </h2>
                    <p className="text-gray-600">
                      {character.class.charAt(0).toUpperCase() + character.class.slice(1)} • Nível {character.level}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Layout: HP + Atributos */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <HPBlock />
                </div>
                
                <div className="lg:col-span-2">
                  <div className="card">
                    <h3 className="text-xl font-fantasy text-primary mb-4">
                      Atributos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.values(ATTRIBUTES).map(attr => (
                        <AttributeBlock key={attr} attribute={attr} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recursos de Classe */}
              {character.abilities && character.abilities.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-fantasy text-primary mb-4">
                    Recursos de Classe
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {character.abilities.map(ability => (
                      <ResourceBlock key={ability.id} ability={ability} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Controle de Turno + Histórico */}
              <div className="grid lg:grid-cols-2 gap-6">
                <TurnController />
                <CombatLog />
              </div>

              {/* Teste de Dados (TEMPORÁRIO) */}
              <DiceRollerTest />

              {/* Debug Info */}
              <div className="card bg-gray-50">
                <details>
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                    🔍 Debug: Ver dados completos
                  </summary>
                  <pre className="mt-4 text-xs overflow-auto p-4 bg-white rounded border max-h-96">
                    {JSON.stringify(character, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;