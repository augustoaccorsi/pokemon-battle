-- CreateTable
CREATE TABLE "Pokemon" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "generation" INTEGER NOT NULL,
    "isLegendary" BOOLEAN NOT NULL DEFAULT false,
    "isMythical" BOOLEAN NOT NULL DEFAULT false,
    "isFullyEvolved" BOOLEAN NOT NULL DEFAULT false,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "spAttack" INTEGER NOT NULL,
    "spDefense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "spritesFront" TEXT,
    "spritesBack" TEXT,
    "spritesFrontShiny" TEXT,
    "spritesBackShiny" TEXT,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeEffectiveness" (
    "attackerId" INTEGER NOT NULL,
    "defenderId" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TypeEffectiveness_pkey" PRIMARY KEY ("attackerId","defenderId")
);

-- CreateTable
CREATE TABLE "PokemonType" (
    "pokemonId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("pokemonId","slot")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "power" INTEGER,
    "accuracy" INTEGER,
    "pp" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "effect" TEXT,
    "effectChance" INTEGER,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonMove" (
    "pokemonId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,
    "learnMethod" TEXT NOT NULL,
    "levelLearnedAt" INTEGER,

    CONSTRAINT "PokemonMove_pkey" PRIMARY KEY ("pokemonId","moveId","learnMethod")
);

-- CreateTable
CREATE TABLE "Ability" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "pokemonId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("pokemonId","slot")
);

-- CreateTable
CREATE TABLE "EvolutionStep" (
    "id" SERIAL NOT NULL,
    "fromPokemonId" INTEGER NOT NULL,
    "toPokemonId" INTEGER NOT NULL,
    "trigger" TEXT NOT NULL,
    "minLevel" INTEGER,
    "itemName" TEXT,
    "condition" TEXT,

    CONSTRAINT "EvolutionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymLeader" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "badge" TEXT NOT NULL,

    CONSTRAINT "GymLeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymLeaderPokemon" (
    "id" SERIAL NOT NULL,
    "gymLeaderId" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,

    CONSTRAINT "GymLeaderPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymLeaderPokemonMove" (
    "gymLeaderPokemonId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,

    CONSTRAINT "GymLeaderPokemonMove_pkey" PRIMARY KEY ("gymLeaderPokemonId","slot")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPokemon" (
    "id" SERIAL NOT NULL,
    "teamId" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,

    CONSTRAINT "TeamPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "gymLeaderId" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "outcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleTurn" (
    "id" SERIAL NOT NULL,
    "battleId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "events" JSONB NOT NULL,

    CONSTRAINT "BattleTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");

-- CreateIndex
CREATE INDEX "Pokemon_generation_idx" ON "Pokemon"("generation");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Move_name_key" ON "Move"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ability_name_key" ON "Ability"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GymLeader_name_key" ON "GymLeader"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamPokemon_teamId_slot_key" ON "TeamPokemon"("teamId", "slot");

-- CreateIndex
CREATE INDEX "BattleTurn_battleId_idx" ON "BattleTurn"("battleId");

-- AddForeignKey
ALTER TABLE "TypeEffectiveness" ADD CONSTRAINT "TypeEffectiveness_attackerId_fkey" FOREIGN KEY ("attackerId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEffectiveness" ADD CONSTRAINT "TypeEffectiveness_defenderId_fkey" FOREIGN KEY ("defenderId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvolutionStep" ADD CONSTRAINT "EvolutionStep_fromPokemonId_fkey" FOREIGN KEY ("fromPokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvolutionStep" ADD CONSTRAINT "EvolutionStep_toPokemonId_fkey" FOREIGN KEY ("toPokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymLeaderPokemon" ADD CONSTRAINT "GymLeaderPokemon_gymLeaderId_fkey" FOREIGN KEY ("gymLeaderId") REFERENCES "GymLeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymLeaderPokemon" ADD CONSTRAINT "GymLeaderPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymLeaderPokemonMove" ADD CONSTRAINT "GymLeaderPokemonMove_gymLeaderPokemonId_fkey" FOREIGN KEY ("gymLeaderPokemonId") REFERENCES "GymLeaderPokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymLeaderPokemonMove" ADD CONSTRAINT "GymLeaderPokemonMove_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPokemon" ADD CONSTRAINT "TeamPokemon_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPokemon" ADD CONSTRAINT "TeamPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleTurn" ADD CONSTRAINT "BattleTurn_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
