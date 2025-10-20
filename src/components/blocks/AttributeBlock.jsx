import { useCharacterStore } from '../../store/characterStore';
import { ATTRIBUTE_NAMES } from '../../utils/constants';

/**
 * Bloco de Atributo
 * Exibe valor e modificador de um atributo (STR, DEX, CON, etc)
 */
export default function AttributeBlock({ attribute }) {
  const { character, updateAttribute } = useCharacterStore();
  
  if (!character) return null;
  
  const attr = character.attributes[attribute];
  const name = ATTRIBUTE_NAMES[attribute];
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 10;
    // Limita entre 1 e 30 (regras D&D)
    const bounded = Math.max(1, Math.min(30, value));
    updateAttribute(attribute, bounded);
  };
  
  // Determina cor do modificador
  const getModifierColor = (mod) => {
    if (mod >= 4) return 'text-green-600';
    if (mod >= 2) return 'text-green-500';
    if (mod >= 0) return 'text-gray-600';
    if (mod >= -2) return 'text-orange-500';
    return 'text-red-600';
  };
  
  const modifierColor = getModifierColor(attr.mod);
  const modifierSign = attr.mod >= 0 ? '+' : '';
  
  return (
    <div className="card flex flex-col items-center justify-center p-4 min-w-[120px]">
      {/* Nome do Atributo */}
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {name}
      </div>
      
      {/* Modificador (destaque) */}
      <div className={`text-4xl font-bold ${modifierColor} mb-2`}>
        {modifierSign}{attr.mod}
      </div>
      
      {/* Valor (editável) */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Valor:</label>
        <input
          type="number"
          min="1"
          max="30"
          value={attr.score}
          onChange={handleChange}
          className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      {/* Indicador visual de nível */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${(attr.score / 30) * 100}%` }}
        />
      </div>
    </div>
  );
}