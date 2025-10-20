import { useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { Heart, Minus, Plus, Shield } from 'lucide-react';

/**
 * Bloco de HP
 * Gerencia pontos de vida, dano, cura e HP temporário
 */
export default function HPBlock() {
  const { character, updateHP, takeDamage, heal, addTempHP } = useCharacterStore();
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('damage'); // 'damage', 'heal', 'temp'
  
  if (!character) return null;
  
  const { current, max, temp } = character.hp;
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  // Determina cor da barra de HP
  const getHPColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const handleAction = () => {
    const value = parseInt(inputValue) || 0;
    if (value <= 0) return;
    
    switch (activeTab) {
      case 'damage':
        takeDamage(value);
        break;
      case 'heal':
        heal(value);
        break;
      case 'temp':
        addTempHP(value);
        break;
    }
    
    setInputValue('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAction();
    }
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-fantasy text-primary flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Pontos de Vida
        </h3>
        <div className="text-sm text-gray-600">
          Proficiência: +{character.proficiency}
        </div>
      </div>
      
      {/* HP Display */}
      <div className="mb-6">
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-5xl font-bold text-primary">{current}</span>
          <span className="text-2xl text-gray-400">/</span>
          <span className="text-3xl text-gray-600">{max}</span>
        </div>
        
        {/* HP Temporário */}
        {temp > 0 && (
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
            <Shield className="w-4 h-4" />
            <span className="font-semibold">+{temp} HP Temp</span>
          </div>
        )}
        
        {/* Barra de HP */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 transition-all duration-300 ${getHPColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Status textual */}
        <div className="text-center mt-2 text-sm text-gray-600">
          {current === 0 && <span className="text-red-600 font-semibold">💀 Inconsciente</span>}
          {current > 0 && current <= max * 0.25 && <span className="text-red-500">⚠️ Crítico</span>}
          {current > max * 0.25 && current <= max * 0.5 && <span className="text-yellow-600">🩹 Ferido</span>}
          {current > max * 0.5 && current < max && <span className="text-green-600">✓ Saudável</span>}
          {current === max && <span className="text-green-600">✨ Vida Cheia</span>}
        </div>
      </div>
      
      {/* Tabs de Ação */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('damage')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'damage'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Minus className="w-4 h-4 inline mr-1" />
          Dano
        </button>
        
        <button
          onClick={() => setActiveTab('heal')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'heal'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Cura
        </button>
        
        <button
          onClick={() => setActiveTab('temp')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'temp'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-1" />
          Temp
        </button>
      </div>
      
      {/* Input e Botão de Ação */}
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            activeTab === 'damage' ? 'Quanto de dano?' :
            activeTab === 'heal' ? 'Quanto curar?' :
            'HP temporário'
          }
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        
        <button
          onClick={handleAction}
          disabled={!inputValue || parseInt(inputValue) <= 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            activeTab === 'damage' ? 'bg-red-500 hover:bg-red-600 text-white' :
            activeTab === 'heal' ? 'bg-green-500 hover:bg-green-600 text-white' :
            'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {activeTab === 'damage' ? 'Aplicar' :
           activeTab === 'heal' ? 'Curar' :
           'Adicionar'}
        </button>
      </div>
      
      {/* Botões Rápidos */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => updateHP(max)}
          className="flex-1 py-1 px-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        >
          HP Máximo
        </button>
        <button
          onClick={() => updateHP(Math.floor(max / 2))}
          className="flex-1 py-1 px-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        >
          Metade
        </button>
        <button
          onClick={() => updateHP(0)}
          className="flex-1 py-1 px-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        >
          0 HP
        </button>
      </div>
    </div>
  );
}