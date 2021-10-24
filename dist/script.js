//Todo: Generation counter, blank canvas button, description box (side) of game rules

//Globals
var sideLen = 30;
var boardWidth = 600;
var length = boardWidth / sideLen;
var running = true;
var gameSpeed = 50 * document.getElementById("gameSpeed").valueAsNumber;
var genCounter = 0;
var gameBoard;
var firstStart = true;

//initialize board to all 0s
newBoard(false);

//create board (if allZero initialize to all 0s, otherwise random pattern)
function initializeBoard(allZero) {
  let board = [];
  for (i = 0; i < sideLen; i++) {
    board.push([]);
    for (j = 0; j < sideLen; j++) {
      if (allZero) {
        board[i].push(0);
      } else {
        board[i].push(getRandomInt(0, 2));
      }
    }
  }
  return board;
}

//execute one generation for the game
function doGeneration() {
  if (!running) {
    setTimeout(doGeneration, gameSpeed);
    return;
  }
  updateGameSpeed();
  //create new board to update
  let newGameBoard = initializeBoard(true);
  for (row = 0; row < sideLen; row++) {
    for (col = 0; col < sideLen; col++) {
      let liveCount = 0;
      //check upleft
      if (col > 0 && row > 0 && gameBoard[row - 1][col - 1] == 1) {
        liveCount++;
      }
      //check up
      if (row > 0 && gameBoard[row - 1][col] == 1) {
        liveCount++;
      }
      //check upright
      if (row > 0 && col < sideLen - 1 && gameBoard[row - 1][col + 1] == 1) {
        liveCount++;
      }
      //check left
      if (col > 0 && gameBoard[row][col - 1] == 1) {
        liveCount++;
      }
      //check right
      if (col < sideLen - 1 && gameBoard[row][col + 1] == 1) {
        liveCount++;
      }
      //check downleft
      if (col > 0 && row < sideLen - 1 && gameBoard[row + 1][col - 1] == 1) {
        liveCount++;
      }
      //check down
      if (row < sideLen - 1 && gameBoard[row + 1][col] == 1) {
        liveCount++;
      }
      //check downright
      if (
        col < sideLen - 1 &&
        row < sideLen - 1 &&
        gameBoard[row + 1][col + 1] == 1
      ) {
        liveCount++;
      }

      //if dead and three neighbors live, becomes live
      if (gameBoard[row][col] == 0 && liveCount == 3) {
        newGameBoard[row][col] = 1;
        //if live and two or three neighbors live, stays live
      } else if (
        gameBoard[row][col] == 1 &&
        (liveCount == 2 || liveCount == 3)
      ) {
        newGameBoard[row][col] = 1;
      }
    }
  }
  gameBoard = newGameBoard;
  genCounter++;
  display();
  setTimeout(doGeneration, gameSpeed);
}

//display game board
function display() {
  for (i = 0; i < sideLen; i++) {
    for (j = 0; j < sideLen; j++) {
      //if cell living
      document.getElementById("genCounterDisplay").innerHTML = genCounter;
      if (gameBoard[i][j] == 1) {
        document.getElementById(i + "col" + j).style =
          "height: " +
          length +
          "px; width: " +
          length +
          "px; background-color: #00cc00";
      } else {
        document.getElementById(i + "col" + j).style =
          "height: " +
          length +
          "px; width: " +
          length +
          "px; background-color: #666666";
      }
    }
  }
}

//create new random board
function newBoard(blank) {
  gameBoard = initializeBoard(blank);
  genCounter = 0;
  //Remove old elements
  let firstRow = document.getElementById("gameBoard").firstChild;
  while (firstRow) {
    while (firstRow.firstChild) {
      firstRow.removeChild(firstRow.firstChild);
    }
    document.getElementById("gameBoard").removeChild(firstRow);
    firstRow = document.getElementById("gameBoard").firstChild;
  } 
 
  //Create new elements
  for (i = 0; i < sideLen; i++) {
    //create row div
    var divRow = document.createElement("div");
    divRow.id = "row" + i;
    document.getElementById("gameBoard").appendChild(divRow);

    for (j = 0; j < sideLen; j++) {
      //create cell div
      var div = document.createElement("div");
      div.setAttribute("id", i + "col" + j);
      div.setAttribute("class", "cell");
      div.setAttribute("onclick", "clickedCell(" + i + "," + j + ")");
      document.getElementById("row" + i).appendChild(div);
    }
  }
  display();
  return;
}

//Toggle pause/resume
function pauseToggle() {
  console.log("toggle pause");
  running = !running;
}

//Toggle dead/alive status of clicked cell
function clickedCell(r, c) {
  gameBoard[r][c] = (gameBoard[r][c] + 1) % 2;
  display();
}

//update game speed
function updateGameSpeed() {
  //min 100, max 3000 (ms)
  gameSpeed = 50 * document.getElementById("gameSpeed").valueAsNumber;
  document.getElementById("speedIndicator").innerHTML = gameSpeed;
}

function updateBoardSize() {
  sideLen = document.getElementById("boardSize").valueAsNumber;
  document.getElementById("sizeIndicator").innerHTML = sideLen;
  length = boardWidth / sideLen;
  newBoard();
}

//helper function for random pattern generation
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}

//advance generation using game speed
setTimeout(doGeneration, gameSpeed);