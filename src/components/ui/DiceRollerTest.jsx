import { useState } from 'react';
import { Dices } from 'lucide-react';
import { 
  rollFormula, 
  rollWithAdvantage, 
  rollWithDisadvantage,
  rollCriticalDamage,
  calculateAverage,
  formatRollResult 
} from '../../lib/dice-roller';

/**
 * Componente de Teste do Dice Roller
 * Remover depois do MVP
 */
export default function DiceRollerTest() {
  const [formula, setFormula] = useState('1d20+5');
  const [result, setResult] = useState(null);
  
  const handleRoll = () => {
    const rollResult = rollFormula(formula);
    setResult(rollResult);
  };
  
  const handleAdvantage = () => {
    const rollResult = rollWithAdvantage(formula);
    setResult(rollResult);
  };
  
  const handleDisadvantage = () => {
    const rollResult = rollWithDisadvantage(formula);
    setResult(rollResult);
  };
  
  const handleCritical = () => {
    const rollResult = rollCriticalDamage(formula);
    setResult(rollResult);
  };
  
  const presets = [
    { name: 'Ataque (d20+5)', formula: '1d20+5' },
    { name: 'Dano (1d8+4)', formula: '1d8+4' },
    { name: 'Complexo (2d6+1d4+3)', formula: '2d6+1d4+3' },
    { name: 'Fireball (8d6)', formula: '8d6' },
    { name: 'Sneak Attack (3d6)', formula: '3d6' }
  ];
  
  const average = calculateAverage(formula);
  
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Dices className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-fantasy text-primary">
          Teste de Dados
        </h3>
      </div>
      
      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fórmula de Dados
        </label>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Ex: 1d20+5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          Média: {average}
        </p>
      </div>
      
      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => setFormula(preset.formula)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>
      
      {/* Botões de Rolagem */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleRoll}
          className="btn-primary"
        >
          🎲 Rolar Normal
        </button>
        
        <button
          onClick={handleCritical}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          💥 Crítico
        </button>
        
        <button
          onClick={handleAdvantage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ↗️ Vantagem
        </button>
        
        <button
          onClick={handleDisadvantage}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ↘️ Desvantagem
        </button>
      </div>
      
      {/* Resultado */}
      {result && (
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-primary">
          <div className="text-sm text-gray-600 mb-2">Resultado:</div>
          
          {result.type ? (
            // Vantagem/Desvantagem
            <div>
              <div className="text-2xl font-bold text-primary mb-2">
                {result.total}
              </div>
              <div className="text-sm text-gray-700">
                {result.display}
              </div>
            </div>
          ) : (
            // Normal/Crítico
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {result.total}
                {result.isCritical && (
                  <span className="ml-2 text-lg text-red-500">💥 CRÍTICO!</span>
                )}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                {formatRollResult(result)}
              </div>
              {result.isCritical && (
                <div className="text-xs text-gray-600">
                  Fórmula original: {result.originalFormula}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}