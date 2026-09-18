# Pokémon Battle Simulator — Project Brief for Claude Code

## 1. Objetivo

Construir uma aplicação web inspirada visualmente nos jogos Pokémon de Game Boy Advance, principalmente **Pokémon FireRed / LeafGreen**, mas sem copiar literalmente a interface, logos, telas ou assets proprietários.

O produto será um **Pokémon Battle Simulator + Pokédex + Team Builder**, inicialmente cobrindo os Pokémon das gerações I, II e III:

- Kanto: #001–#151
- Johto: #152–#251
- Hoenn: #252–#386

O objetivo principal é permitir que o usuário monte um time de 6 Pokémon e lute contra Gym Leaders em batalhas por turnos.

---

# 2. Stack obrigatória/recomendada

## Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui somente onde fizer sentido para componentes de aplicação
- Framer Motion para animações de interface
- CSS customizado para a experiência visual retrô/pixel-art

## Backend

Começar simples:

- Next.js Route Handlers / Server Actions quando forem suficientes
- TypeScript
- Prisma
- PostgreSQL

Não introduzir NestJS no MVP sem necessidade.

Se o backend crescer significativamente, separar posteriormente:

- NestJS
- Battle Engine compartilhado

## Testes

- Vitest para unit/integration tests
- Playwright para E2E

## Infra

Inicialmente:

- GitHub
- Vercel para web
- PostgreSQL gerenciado

Não usar Kubernetes, microservices ou infraestrutura complexa no MVP.

---

# 3. Princípio arquitetural mais importante

## Battle Engine NÃO pode depender de React.

Criar um domínio independente em TypeScript:

```text
src/
  game/
    battle/
      Battle.ts
      BattleState.ts
      BattleAction.ts
      BattleResult.ts
      DamageCalculator.ts
      TypeChart.ts
      StatusEffects.ts
      Random.ts
      MoveResolver.ts
      SwitchResolver.ts
```

A UI apenas apresenta o estado do Battle Engine e envia ações.

Exemplo:

```ts
const result = battle.executeMove({
  actor: playerPokemon,
  move: "thunderbolt",
  target: enemyPokemon
});
```

A engine deve retornar eventos/resultados suficientes para a UI reproduzir a batalha:

```ts
{
  type: "MOVE_USED",
  attacker: "pikachu",
  move: "thunderbolt",
  damage: 42,
  critical: false,
  effectiveness: 2,
  targetFainted: false
}
```

O objetivo é permitir no futuro:

- replay
- battle history
- multiplayer
- ranking
- battle sharing
- testes determinísticos

sem reescrever a engine.

---

# 4. RNG determinístico

Não espalhar `Math.random()` pelo código.

Criar uma abstração de RNG com seed.

Exemplo:

```ts
const rng = new BattleRandom(seed);
```

Uma batalha deve poder ser reproduzida usando a mesma seed.

Isso será importante para:

- replays
- debugging
- testes
- compartilhamento de batalhas

---

# 5. Escopo funcional do MVP

## 5.1 Home

Página inicial com estética inspirada em uma Pokédex/Game Boy Advance.

Principais entradas:

- Battle Simulator
- Build Your Team
- Pokédex
- Gym Leaders

---

# 6. Team Builder

O usuário pode montar exatamente 6 Pokémon.

## Modos

### Manual

Usuário escolhe cada Pokémon.

### Random

Usuário pode sortear o time.

Filtros do sorteio:

- Kanto
- Johto
- Hoenn
- qualquer combinação das três
- apenas Pokémon totalmente evoluídos
- permitir/proibir lendários
- tipos aleatórios
- time balanceado

Exemplo:

```text
BUILD YOUR TEAM

[ + ] [ + ] [ + ]
[ + ] [ + ] [ + ]

        🎲 RANDOM TEAM
```

Ao clicar em um slot:

- buscar Pokémon
- filtrar por geração
- filtrar por tipo
- selecionar Pokémon
- visualizar sprite e informações básicas

O time deve poder ser salvo localmente inicialmente.

---

# 7. Battle Simulator

A batalha deve ser o principal diferencial do produto.

Fluxo:

```text
Choose Team
      ↓
Choose Gym Leader
      ↓
Choose Difficulty
      ↓
Battle
```

Tela visual inspirada em Pokémon FireRed:

```text
┌─────────────────────────────────────────────┐
│                                             │
│                     GYM LEADER              │
│                     BROCK                   │
│                                             │
│             [ ENEMY POKÉMON ]               │
│                                             │
│             HP ████████░░                   │
│             Lv. 14                          │
│                                             │
│                                             │
│       [ PLAYER POKÉMON SPRITE ]             │
│                                             │
│       HP █████████░                         │
│       Lv. 18                                │
│                                             │
├─────────────────────────────────────────────┤
│ What will your Pokémon do?                 │
│                                             │
│     FIGHT             POKÉMON               │
│     BAG               RUN                   │
└─────────────────────────────────────────────┘
```

A interface deve ter:

- sprites pixel-art
- HP bars
- níveis
- nomes
- animações de ataque
- animação de dano
- animação de entrada
- troca de Pokémon
- mensagens de batalha
- efeitos de status
- critical hit
- effectiveness
- faint
- victory/defeat

---

# 8. Battle Engine — primeira versão

Implementar:

- turn order
- Speed
- move priority
- accuracy
- damage
- critical hits
- STAB
- type effectiveness
- Pokémon types
- physical/special split conforme as regras do jogo-alvo
- status conditions relevantes
- switching
- faint
- victory
- defeat
- PP
- move effects básicos

IMPORTANTE:

O projeto deve inicialmente definir claramente **qual conjunto de regras está simulando**.

Como a estética é FireRed, começar com regras de **Generation III / FireRed**, em vez de misturar mecânicas de gerações posteriores.

Isso significa  umentar decisões como:

- physical/special por TYPE
- abilities disponíveis
- moves disponíveis
- damage formula
- critical-hit behavior
- status behavior

Não implementar mecânicas modernas sem uma decisão explícita.

---

# 9. Gym Leaders

Começar com Kanto.

Gym Leaders:

1. Brock — Rock
2. Misty — Water
3. Lt. Surge — Electric
4. Erika — Grass
5. Koga — Poison
6. Sabrina — Psychic
7. Blaine — Fire
8. Giovanni — Ground

Depois adicionar:

- Johto
- Hoenn

Cada Gym Leader deve ter:

- nome
- região
- cidade
- tipo
- sprite/avatar
- time
- níveis
- movesets
- dificuldade

## Dificuldades

### Normal

Times próximos aos jogos.

### Hard

Times melhores e movesets melhores.

### Challenge

Times mais estratégicos, podendo posteriormente usar IVs/EVs/Natures.

Não inventar dificuldade complexa no MVP se ela não for necessária.

---

# 10. Pokédex

A Pokédex deve conter os 386 Pokémon de Kanto, Johto e Hoenn.

Tela principal:

```text
POKÉDEX

Search Pokémon...

Generation
[ Kanto ] [ Johto ] [ Hoenn ]

Type
[ Normal ] [ Fire ] [ Water ] ...
```

Cada Pokémon deve possuir:

- número
- nome
- tipos
- altura
- peso
- abilities
- base stats
- moves
- evolution chain
- localização, quando disponível
- sprites
- shiny sprite

Página de detalhes:

```text
#025

PIKACHU

[SPRITE]

ELECTRIC

Height
Weight

BASE STATS
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed

Tabs:
Overview
Stats
Moves
Evolution
Locations
Sprites
```

---

# 11. Fonte dos dados Pokémon

Usar **PokéAPI** para obter e importar os dados iniciais.

Documentação:

https://pokeapi.co/docs/v2

A PokéAPI fornece dados de Pokémon, moves, abilities, generations, sprites e outros dados da série principal.

NÃO depender da PokéAPI em runtime para cada interação da aplicação.

Fluxo:

```text
PokéAPI
   ↓
Import Script
   ↓
PostgreSQL
   ↓
Prisma
   ↓
Application
```

Criar um script idempotente de importação.

Exemplo:

```text
scripts/
  import-pokemon.ts
  import-moves.ts
  import-abilities.ts
  import-evolutions.ts
  import-sprites.ts
```

Filtrar inicialmente:

```text
001 - 386
```

---

# 12. Sprites / Pixel Art

Para os sprites dos Pokémon existentes, a primeira fonte técnica deve ser o repositório de sprites associado à PokéAPI:

https://github.com/PokeAPI/sprites

A PokéAPI expõe URLs de sprites por geração e versão. Ela inclusive possui caminhos específicos para:

- Generation III
- FireRed/LeafGreen
- front
- back
- shiny

Para este projeto, priorizar os sprites de:

```text
generation-iii/firered-leafgreen
```

quando disponíveis.

A documentação da PokéAPI mostra explicitamente sprites específicos de FireRed/LeafGreen, incluindo front/back e shiny.

IMPORTANTE SOBRE COPYRIGHT:

Pokémon, nomes, personagens, designs, sprites e outros assets são propriedade intelectual de seus respectivos titulares. A própria Pokémon Support informa que não autoriza o uso de sua propriedade intelectual em projetos e pede que ela não seja usada ou associada a projetos sem autorização.

Portanto:

- não afirmar que os assets são nossos
- não remover atribuições/licenças quando uma fonte exigir
- não vender os sprites
- não criar uma identidade que sugira ser um produto oficial
- manter uma clara indicação de projeto de fã/não oficial
- verificar as licenças/termos dos assets antes de publicar
- para uma versão comercial, considerar substituir os sprites oficiais por assets originais/licenciados

Não baixar imagens aleatoriamente de Google Images.

---

# 13. Organização de assets

Criar:

```text
public/
  sprites/
    pokemon/
      001/
        front.png
        back.png
        shiny-front.png
        shiny-back.png
      002/
      ...
  trainers/
  backgrounds/
  effects/
  ui/
  sounds/
```

Idealmente os sprites devem ser versionados/localmente cacheados durante o build/import.

Não fazer hotlink permanente para raw.githubusercontent.com em cada renderização da aplicação.

---

# 14. Visual / UI

O visual deve ser inspirado em FireRed, mas ser uma identidade própria.

Características:

- pixel art
- bordas e painéis com aparência de GBA
- paleta clara e saturada
- sombras simples
- menus compactos
- fontes com aparência retro
- sprites grandes durante batalha
- backgrounds pixelados
- animações rápidas

Evitar:

- dashboard corporativo
- aparência SaaS
- excesso de cards modernos
- gradients modernos exagerados
- interface genérica de Tailwind

A página de batalha deve parecer um **jogo**, não um painel administrativo.

---

# 15. Responsividade

Prioridade:

1. Desktop
2. Tablet
3. Mobile

A batalha deve continuar utilizável em telas pequenas.

No desktop, aproveitar mais espaço horizontal.

No mobile, manter:

- sprite
- HP
- menu de batalha
- mensagens
- troca de Pokémon

sem exigir scroll vertical durante uma batalha.

---

# 16. Design System

Criar tokens próprios:

```css
--pokemon-red
--pokemon-blue
--pokemon-yellow
--battle-green
--panel-light
--panel-dark
--pixel-border
```

Criar componentes reutilizáveis:

```text
PokemonSprite
PokemonCard
PokemonTypeBadge
HpBar
ExpBar
MoveButton
BattleMenu
BattleMessage
TeamSlot
TeamBuilder
PokemonSearch
GymLeaderCard
```

---

# 17. Banco de dados

Modelo inicial:

```text
Pokemon
Type
PokemonType
Move
Ability
PokemonAbility
PokemonMove
EvolutionChain
Evolution
GymLeader
GymLeaderPokemon
Team
TeamPokemon
Battle
BattleTurn
```

Usar Prisma.

Não duplicar dados desnecessariamente.

---

# 18. API / Server

Endpoints conceituais:

```text
GET /api/pokemon
GET /api/pokemon/:id
GET /api/moves
GET /api/types
GET /api/gym-leaders
GET /api/gym-leaders/:id

POST /api/teams/random
POST /api/battles
POST /api/battles/:id/actions
GET /api/battles/:id
```

A lógica de batalha deve permanecer no domínio/battle engine.

---

# 19. Testing

Battle Engine deve ter cobertura alta.

Testar pelo menos:

```text
✓ Fire > Grass
✓ Water > Fire
✓ Grass > Water
✓ immune types
✓ STAB
✓ critical hit
✓ miss
✓ damage
✓ faint
✓ speed order
✓ priority
✓ status
✓ switching
✓ PP
✓ victory
✓ defeat
```

E2E:

```text
Open app
→ Build team
→ Select 6 Pokémon
→ Select Gym Leader
→ Start battle
→ Use move
→ Verify HP changes
→ Win/lose battle
```

---

# 20. Ordem de implementação

NÃO tentar construir tudo simultaneamente.

## Fase 1 — Foundation

- Next.js
- TypeScript
- Tailwind
- Prisma
- PostgreSQL
- estrutura do projeto
- design tokens
- CI
- lint
- formatting
- testes

## Fase 2 — Pokémon data

- importar 386 Pokémon
- types
- stats
- moves
- abilities
- evolutions
- FireRed/Gen III sprites

## Fase 3 — Pokédex

- list
- search
- filters
- details
- sprites
- evolution
- stats
- moves

## Fase 4 — Team Builder

- 6 slots
- manual selection
- search
- filters
- random team
- save team

## Fase 5 — Battle Engine

- battle state
- turns
- damage
- types
- moves
- HP
- faint
- switching
- victory

## Fase 6 — Battle UI

- FireRed-inspired battle screen
- sprites
- HP bars
- animations
- battle messages
- move menu
- Pokémon switch menu

## Fase 7 — Gym Leaders

- Kanto
- teams
- levels
- moves
- difficulty

## Fase 8 — Polish

- animations
- sound
- responsive
- loading states
- error handling
- accessibility
- performance

---

# 21. Regras de desenvolvimento

1. TypeScript strict mode.
2. Evitar `any`.
3. Não colocar regra de negócio nos React components.
4. Não colocar regra de batalha nos controllers/routes.
5. Battle Engine deve ser testável sem browser.
6. Componentes visuais devem ser pequenos e reutilizáveis.
7. Não criar abstrações antes de existir necessidade real.
8. Priorizar simplicidade no MVP.
9. Não adicionar dependências sem justificativa.
10. Rodar lint + typecheck + tests antes de considerar uma feature concluída.

---

# 22. Definition of Done do MVP

O MVP estará pronto quando o usuário conseguir:

1. Abrir o site.
2. Abrir a Pokédex.
3. Pesquisar qualquer Pokémon de #001–#386.
4. Ver sprite, tipos, stats, moves e evolução.
5. Criar manualmente um time de 6.
6. Sortear um time de 6.
7. Escolher um Gym Leader.
8. Iniciar uma batalha.
9. Escolher golpes.
10. Ver dano, efetividade, crítico e HP.
11. Trocar Pokémon.
12. Derrotar todos os Pokémon do Gym Leader.
13. Ver tela de vitória/derrota.
14. Começar outra batalha.

---

# 23. Filosofia do projeto

O site deve parecer:

> "Um pequeno jogo Pokémon jogável no navegador."

e não:

> "Uma aplicação CRUD sobre Pokémon."

A prioridade é:

**Game feel > quantidade de funcionalidades**

e:

**Battle Engine correta > efeitos visuais complexos**

Primeiro fazer uma batalha simples funcionar perfeitamente. Depois adicionar complexidade.
