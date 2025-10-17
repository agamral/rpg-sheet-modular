# Ficha Modular RPG

Sistema web para gerenciamento de fichas de personagem D&D 5e com automação de combate e gerenciamento de recursos.

## 🎯 Features Principais

- Templates especializados por classe (Martial, Caster, Hybrid)
- Sistema de tags para stacking automático de buffs
- Suporte para rolagem virtual e manual de dados
- Histórico detalhado de combate
- Biblioteca pré-populada de armas e habilidades

## 🛠️ Stack Técnica

- React 18
- Vite 5
- Tailwind CSS 3
- Zustand (state management)
- Lucide React (icons)

## 🚀 Como Rodar
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto
```
/src
├── /components      # Componentes React
│   ├── /blocks     # Blocos da ficha (atributos, HP, etc)
│   ├── /panels     # Painéis modais (QuickPanel, CombatLog)
│   ├── /templates  # Templates de classes
│   └── /ui         # Componentes UI básicos
├── /lib            # Lógica de negócio
├── /store          # Zustand stores
├── /data           # Bibliotecas JSON
├── /hooks          # Custom hooks
└── /utils          # Utilitários
```

## 📋 Roadmap

### Fase 1 - Core (Atual)
- [ ] Setup do projeto
- [ ] Sistema de atributos
- [ ] Template Martial básico
- [ ] ActionResolver
- [ ] TagEngine

### Fase 2 - Recursos
- [ ] Sistema de recursos (Rage, Action Surge)
- [ ] Tracking de durações
- [ ] Descansos

### Fase 3 - Polimento
- [ ] Templates adicionais
- [ ] Biblioteca expandida
- [ ] Estatísticas de combate

## 📝 Licença

MIT