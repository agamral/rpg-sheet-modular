import { useCharacterStore } from '../../store/characterStore';
import { COMBAT_ACTIONS } from '../../utils/constants';
import { Scroll, Swords, Zap, Power, PowerOff, SkipForward, Moon } from 'lucide-react';

/**
 * Histórico de Combate
 * Exibe log de todas as ações realizadas
 */
export default function CombatLog() {
  const { character } = useCharacterStore();
  
  if (!character || character.combatLog.length === 0) {
    return (
      <div className="card text-center py-8">
        <Scroll className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-500">Nenhuma ação registrada ainda</p>
        <p className="text-sm text-gray-400 mt-1">
          Use habilidades ou termine turnos para ver o histórico
        </p>
      </div>
    );
  }
  
  const getIcon = (action) => {
    const iconClass = "w-4 h-4";
    switch (action) {
      case COMBAT_ACTIONS.ATTACK:
        return <Swords className={iconClass} />;
      case COMBAT_ACTIONS.ACTIVATE:
        return <Power className={iconClass} />;
      case COMBAT_ACTIONS.DEACTIVATE:
        return <PowerOff className={iconClass} />;
      case COMBAT_ACTIONS.END_TURN:
        return <SkipForward className={iconClass} />;
      case COMBAT_ACTIONS.REST:
        return <Moon className={iconClass} />;
      default:
        return <Zap className={iconClass} />;
    }
  };
  
  const getActionColor = (action) => {
    switch (action) {
      case COMBAT_ACTIONS.ATTACK:
        return 'bg-red-100 text-red-700';
      case COMBAT_ACTIONS.ACTIVATE:
        return 'bg-green-100 text-green-700';
      case COMBAT_ACTIONS.DEACTIVATE:
        return 'bg-gray-100 text-gray-700';
      case COMBAT_ACTIONS.END_TURN:
        return 'bg-blue-100 text-blue-700';
      case COMBAT_ACTIONS.REST:
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const getActionText = (entry) => {
    switch (entry.action) {
      case COMBAT_ACTIONS.ATTACK:
        return `Atacou com ${entry.weapon}`;
      case COMBAT_ACTIONS.ACTIVATE:
        return `Ativou ${entry.ability}`;
      case COMBAT_ACTIONS.DEACTIVATE:
        return `Desativou ${entry.ability}`;
      case COMBAT_ACTIONS.END_TURN:
        return 'Finalizou o turno';
      case COMBAT_ACTIONS.REST:
        return entry.ability;
      default:
        return 'Ação desconhecida';
    }
  };
  
  // Agrupa por turno
  const groupedByTurn = character.combatLog.reduce((acc, entry) => {
    if (!acc[entry.turn]) {
      acc[entry.turn] = [];
    }
    acc[entry.turn].push(entry);
    return acc;
  }, {});
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-fantasy text-primary flex items-center gap-2">
          <Scroll className="w-5 h-5" />
          Histórico de Combate
        </h3>
        <span className="text-sm text-gray-600">
          {character.combatLog.length} ação(ões)
        </span>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {Object.entries(groupedByTurn)
          .reverse() // Mais recente primeiro
          .map(([turn, entries]) => (
            <div key={turn} className="border-l-4 border-primary pl-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                {turn === '0' ? 'Preparação' : `Turno ${turn}`}
              </div>
              
              <div className="space-y-2">
                {entries.map(entry => (
                  <div 
                    key={entry.id}
                    className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className={`p-1.5 rounded ${getActionColor(entry.action)}`}>
                      {getIcon(entry.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800">
                        {getActionText(entry)}
                      </div>
                      
                      {/* Recursos usados */}
                      {entry.resourcesUsed && entry.resourcesUsed.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          Recursos consumidos: {entry.resourcesUsed.length}
                        </div>
                      )}
                      
                      {/* Efeitos atualizados */}
                      {entry.effectsUpdated && entry.effectsUpdated.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {entry.effectsUpdated.map((effect, idx) => (
                            <div key={idx}>
                              • {effect.name}: {effect.duration} turnos restantes
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Duração ativada */}
                      {entry.duration && (
                        <div className="text-xs text-orange-600 mt-1">
                          Duração: {entry.duration} turnos
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(entry.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}