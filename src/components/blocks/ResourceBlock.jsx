import { useCharacterStore } from '../../store/characterStore';
import { ABILITY_TYPES } from '../../utils/constants';
import { Zap, Flame, Swords, Clock, Power, PowerOff } from 'lucide-react';

/**
 * Bloco de Recurso
 * Gerencia habilidades de classe (Rage, Action Surge, etc)
 */
export default function ResourceBlock({ ability }) {
  const { useAbility, activateAbility, deactivateAbility } = useCharacterStore();
  
  // Ícones por tipo de recurso
  const getIcon = () => {
    const iconClass = "w-5 h-5";
    
    if (ability.name.toLowerCase().includes('rage')) {
      return <Flame className={iconClass} />;
    }
    if (ability.name.toLowerCase().includes('action')) {
      return <Zap className={iconClass} />;
    }
    if (ability.name.toLowerCase().includes('attack')) {
      return <Swords className={iconClass} />;
    }
    return <Power className={iconClass} />;
  };
  
  const handleUseInstant = () => {
    if (ability.uses && ability.uses.current > 0) {
      useAbility(ability.id);
    }
  };
  
  const handleToggleDuration = () => {
    if (ability.active) {
      deactivateAbility(ability.id);
    } else {
      if (ability.uses && ability.uses.current > 0) {
        activateAbility(ability.id);
      }
    }
  };
  
  // Renderiza baseado no tipo
  const renderByType = () => {
    switch (ability.type) {
      case ABILITY_TYPES.PASSIVE:
        return renderPassive();
      case ABILITY_TYPES.INSTANT:
        return renderInstant();
      case ABILITY_TYPES.DURATION:
        return renderDuration();
      default:
        return null;
    }
  };
  
  // Passivo (apenas exibição)
  const renderPassive = () => (
    <div className="card bg-blue-50 border-blue-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{ability.name}</div>
          <div className="text-sm text-gray-600">Passiva • Sempre ativa</div>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          ✓ Ativo
        </div>
      </div>
      {ability.effect.description && (
        <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-gray-700">
          {ability.effect.description}
        </div>
      )}
    </div>
  );
  
  // Instantâneo (botão para usar)
  const renderInstant = () => {
    const hasUses = ability.uses && ability.uses.current > 0;
    const isDisabled = !hasUses;
    
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${hasUses ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{ability.name}</div>
            <div className="text-sm text-gray-600">
              {ability.recharge === 'short-rest' ? 'Descanso Curto' : 'Descanso Longo'}
            </div>
          </div>
          {ability.uses && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {ability.uses.current}/{ability.uses.max}
              </div>
              <div className="text-xs text-gray-500">usos</div>
            </div>
          )}
        </div>
        
        {ability.effect.description && (
          <div className="mb-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">
            {ability.effect.description}
          </div>
        )}
        
        <button
          onClick={handleUseInstant}
          disabled={isDisabled}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isDisabled ? '✗ Sem Usos' : '⚡ Usar'}
        </button>
      </div>
    );
  };
  
  // Duração (toggle + contador de turnos)
  const renderDuration = () => {
    const hasUses = ability.uses && ability.uses.current > 0;
    const canActivate = !ability.active && hasUses;
    
    return (
      <div className={`card ${ability.active ? 'bg-orange-50 border-orange-300' : ''}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${
            ability.active 
              ? 'bg-orange-100 text-orange-600' 
              : hasUses 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-400'
          }`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800 flex items-center gap-2">
              {ability.name}
              {ability.active && (
                <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full animate-pulse">
                  ATIVO
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {ability.recharge === 'short-rest' ? 'Descanso Curto' : 'Descanso Longo'}
            </div>
          </div>
          {ability.uses && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {ability.uses.current}/{ability.uses.max}
              </div>
              <div className="text-xs text-gray-500">cargas</div>
            </div>
          )}
        </div>
        
        {/* Contador de Duração (se ativo) */}
        {ability.active && ability.duration && (
          <div className="mb-3 p-3 bg-orange-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">Duração Restante</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-xl font-bold text-orange-600">
                  {ability.duration.current}
                </span>
                <span className="text-sm text-orange-600">turnos</span>
              </div>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(ability.duration.current / ability.duration.max) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Descrição do Efeito */}
        {ability.effect.description && (
          <div className="mb-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">
            {ability.effect.description}
          </div>
        )}
        
        {/* Botão de Ativar/Desativar */}
        <button
          onClick={handleToggleDuration}
          disabled={!canActivate && !ability.active}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            ability.active
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : canActivate
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {ability.active ? (
            <>
              <PowerOff className="w-4 h-4" />
              Desativar
            </>
          ) : (
            <>
              <Power className="w-4 h-4" />
              {canActivate ? 'Ativar' : '✗ Sem Cargas'}
            </>
          )}
        </button>
      </div>
    );
  };
  
  return renderByType();
}