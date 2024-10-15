const axios = require('axios');

// Global Variables
let playerHP = 300;
let botHP = 300;
let playerPokemon = {};
let botPokemon = {};
let botMoves = [];

//  Function to Get Pokémon Data
async function getPokemonData(pokemonName) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${pokemonName}:`, error.message);
  }
}

//  select 5 random moves from the Pokémon's move list
function getRandomMoves(pokemonData, numMoves = 5) {
  const moves = pokemonData.moves.map(move => move.move.name);
  const selectedMoves = [];
  while (selectedMoves.length < numMoves && moves.length > 0) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    selectedMoves.push(moves.splice(randomIndex, 1)[0]);
  }
  return selectedMoves;
}

// fetch move data (including power, accuracy, PP)
async function getMoveData(moveName) {
  const url = `https://pokeapi.co/api/v2/move/${moveName.toLowerCase()}`;
  try {
    const response = await axios.get(url);
    const move = response.data;
    return {
      name: move.name,
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
    };
  } catch (error) {
    console.error(`Error fetching data for move ${moveName}:`, error.message);
  }
}

// Attack Logic 
function attack(move, attacker, defender) {
  if (move.accuracy === null) {
    console.log(`${attacker.name} used ${move.name}, it's a sure hit!`);
  } else {
    const accuracyCheck = Math.random() * 100;
    if (accuracyCheck > move.accuracy) {
      console.log(`${attacker.name}'s ${move.name} missed!`);
      return;
    }
  }

  const damage = move.power || 0;  
  defender.hp -= damage;
  console.log(`${attacker.name} used ${move.name}, dealing ${damage} damage!`);
}

// Main Game Loop
async function playGame() {
  // Step 1: Player Chooses Pokémon
  const playerPokemonName = 'pikachu'; 
  playerPokemon = await getPokemonData(playerPokemonName);
  console.log(`You chose ${playerPokemon.name}!`);

  // Step 2: Bot Chooses Random Pokémon
  const botPokemonName = 'bulbasaur'; 
  botPokemon = await getPokemonData(botPokemonName);
  console.log(`The bot chose ${botPokemon.name}!`);

  // Step 3: Fetch Moves for Both Pokémon
  const playerMoves = getRandomMoves(playerPokemon);
  const botMoves = getRandomMoves(botPokemon);

  console.log(`${playerPokemon.name} has moves: ${playerMoves.join(', ')}`);
  console.log(`${botPokemon.name} has moves: ${botMoves.join(', ')}`);

  // Convert moves to full data with power, accuracy, pp
  const playerMoveData = await Promise.all(playerMoves.map(move => getMoveData(move)));
  const botMoveData = await Promise.all(botMoves.map(move => getMoveData(move)));

  // Step 4: Battle Loop
  let playerTurn = true;
  playerPokemon.hp = 300;
  botPokemon.hp = 300;

  while (playerPokemon.hp > 0 && botPokemon.hp > 0) {
    if (playerTurn) {
      console.log("Player's turn!");

      const playerMove = playerMoveData[Math.floor(Math.random() * playerMoveData.length)];

      // Attack bot
      attack(playerMove, playerPokemon, botPokemon);
    } else {
      console.log("Bot's turn!");

      // Bot randomly selects a move
      const botMove = botMoveData[Math.floor(Math.random() * botMoveData.length)];

      // Attack player
      attack(botMove, botPokemon, playerPokemon);
    }

    console.log(`Player HP: ${playerPokemon.hp}, Bot HP: ${botPokemon.hp}`);

    playerTurn = !playerTurn;
  }

  // Check game result
  if (playerPokemon.hp <= 0) {
    console.log("You lose!");
  } else if (botPokemon.hp <= 0) {
    console.log("You win!");
  }
}

// Start Game
playGame();
