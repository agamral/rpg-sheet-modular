import { useCharacterStore } from '../../store/characterStore';
import { SkipForward, Moon, Sun, Trash2 } from 'lucide-react';

/**
 * Controlador de Turno
 * Gerencia fim de turno, descansos e histórico
 */
export default function TurnController() {
  const { 
    character, 
    currentTurn, 
    endTurn, 
    shortRest, 
    longRest,
    clearCombatLog 
  } = useCharacterStore();
  
  if (!character) return null;
  
  // Conta quantos efeitos ativos existem
  const activeEffectsCount = character.abilities.filter(a => a.active).length;
  
  const handleEndTurn = () => {
    endTurn();
  };
  
  const handleShortRest = () => {
    if (window.confirm('Fazer um Descanso Curto? Isso restaurará recursos e removerá efeitos ativos.')) {
      shortRest();
    }
  };
  
  const handleLongRest = () => {
    if (window.confirm('Fazer um Descanso Longo? Isso restaurará HP, todos os recursos e removerá efeitos ativos.')) {
      longRest();
    }
  };
  
  const handleClearLog = () => {
    if (window.confirm('Limpar o histórico de combate?')) {
      clearCombatLog();
    }
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-fantasy text-primary">Controle de Turno</h3>
          <p className="text-sm text-gray-600">
            Turno atual: <span className="font-semibold">{currentTurn}</span>
            {activeEffectsCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                {activeEffectsCount} efeito(s) ativo(s)
              </span>
            )}
          </p>
        </div>
      </div>
      
      {/* Botão Principal: Fim de Turno */}
      <button
        onClick={handleEndTurn}
        className="w-full py-4 px-6 mb-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 shadow-md"
      >
        <SkipForward className="w-6 h-6" />
        Fim do Turno
      </button>
      
      {/* Grid de Ações Secundárias */}
      <div className="grid grid-cols-3 gap-3">
        {/* Descanso Curto */}
        <button
          onClick={handleShortRest}
          className="py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex flex-col items-center gap-1"
        >
          <Moon className="w-5 h-5" />
          <span className="text-sm">Descanso Curto</span>
        </button>
        
        {/* Descanso Longo */}
        <button
          onClick={handleLongRest}
          className="py-3 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors flex flex-col items-center gap-1"
        >
          <Sun className="w-5 h-5" />
          <span className="text-sm">Descanso Longo</span>
        </button>
        
        {/* Limpar Histórico */}
        <button
          onClick={handleClearLog}
          className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex flex-col items-center gap-1"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-sm">Limpar Log</span>
        </button>
      </div>
      
      {/* Lista de Efeitos Ativos */}
      {activeEffectsCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Efeitos Ativos:</h4>
          <div className="space-y-2">
            {character.abilities
              .filter(a => a.active)
              .map(ability => (
                <div 
                  key={ability.id}
                  className="flex items-center justify-between p-2 bg-orange-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-orange-800">
                    {ability.name}
                  </span>
                  <span className="text-sm text-orange-600 font-semibold">
                    {ability.duration.current} turnos
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}