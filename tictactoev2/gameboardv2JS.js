const checkURL = "http://localhost:8080/tictactoe/tictactoeserver/check?";
const moveURL = "http://localhost:8080/tictactoe/tictactoeserver/move?";
const boardURL = "http://localhost:8080/tictactoe/tictactoeserver/board?";
const resetURL = "http://localhost:8080/tictactoe/tictactoeserver/reset?";
const createGameURL = "http://localhost:8080/tictactoe/tictactoeserver/createGame?";

const webServiceURL = "http://localhost:8080/WebService/server2/rest/health-check";
const saveServiceURL = "http://localhost:8080/WebService/server2/rest/save";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameID = urlParams.get('key');
const symbol = urlParams.get('symbol');
const playerID = urlParams.get('playerID');
const cellMarker = symbol;

var gameIdTitle = document.getElementById("gameIdTitle");
var playerIDElement = document.getElementById("playerID");
// var player1Element = document.getElementById("player1");
// var player2Element = document.getElementById("player2");
var cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText"); 
const waitingDiv = document.getElementById('waiting');
const youWinDiv = document.getElementById('youwin');
const youLoseDiv = document.getElementById('youlose');
const drawDiv = document.getElementById('draw');
var gameBoardResp = document.getElementById("gameboard-response");
// const restartBtn = document.querySelector("#restartBtn");
const quitGameButton = document.getElementById("quitGame");

var webServiceResp = document.getElementById("webservice-response");

//working variables
var turnMessage = "";
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let running = false;
var player1Name ="";
var player2Name ="";


//update header textcontent of gameBoard
gameIdTitle.textContent += " " + gameID;
playerIDElement.textContent += " Player "+symbol+": "+playerID;

var intervalId = setInterval(function() {
  signalStartGame(gameID,playerID);
}, 3000);

function signalStartGame(gameID,symbol){
  console.log("playerID "+playerID);
  // if (symbol === "X") {
  //   player1Element.textContent = playerID;
  //   player1Name = playerID;
  // } else if (symbol === "O") {
  //   player2Element.textContent = playerID;
  //   player2Name = playerID;
  // }

  var url = checkURL +"key="+ gameID;
  console.log("Constructed URL:", url);
  fetch(url)
  .then(response => response.text())
  .then(data => {
      console.log(data);
      console.log("checkGame response data: "+data);
      if (data === "true") {

        waitingDiv.style.display = 'none';

        running = true;
        statusText.textContent = "Start Game. Player X's turn.";

        // if (symbol === "X") {
        //   playersHeading.textContent = "Player X vs Player O";
        // } else {
        //   playersHeading.textContent = "Player O vs Player X";
        // }

        processGame(gameID,symbol,playerID);

        clearInterval(intervalId);
      } else  {
        statusText.textContent = "Still waiting for opponent to join";
        waitingDiv.style.display = 'block';
      }         
  })
  .catch(error => {
      console.error('Error:', error);
      statusText.innerHTML = "1User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
  });
  fetch(url)
  .then(response => response.text())
  .then(data => {
      console.log(data);
      console.log("checkGame response data: "+data);
      if (data === "true") {

        waitingDiv.style.display = 'none';

        running = true;
        statusText.textContent = "Start Game. Player X's turn.";

        // if (symbol === "X") {
        //   playersHeading.textContent = "Player X vs Player O";
        // } else {
        //   playersHeading.textContent = "Player O vs Player X";
        // }

        processGame(gameID,symbol,playerID);

        clearInterval(intervalId);
      } else  {
        statusText.textContent = "Still waiting for opponent to join";
        waitingDiv.style.display = 'block';
      }         
  })
  .catch(error => {
      console.error('Error:', error);
      statusText.innerHTML = "1User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
  });

}


function processGame(gameID,symbol,playerID){
    cells.forEach((cell) => cell.addEventListener("click", clickHandler));

    // restartBtn.addEventListener("click", restartGame);
    
    running = true;

    setInterval(function() {
      showBoardInfo(gameID);
    }, 1000);
}

const clickHandler = (event) => clickCell(event.target, gameID, symbol,playerID);

function clickCell(cell, gameID, symbol, playerID) {
  console.log("clickCell symbol " + symbol);
  var cellID = cell.getAttribute("cellIndex");
  var position = parseInt(cellID);
  var xPos = position % 3;
  var yPos = Math.floor(position / 3);
  sendPlyrMoveRequest(gameID, symbol, yPos, xPos, cellID, playerID);
}

function sendPlyrMoveRequest(gameID,symbol,yPos,xPos,cellID,playerID){
    var url = moveURL + "key="+gameID +"&tile="+symbol +"&y="+yPos+"&x="+xPos;
    fetch(url)
        .then(function(response) {
        return response.text();
      })
        .then(function(responseText) {
        if (responseText.includes("[TAKEN]")) {
          console.log("Tile is taken!");
          statusText.textContent = "Invalid Move. Tile is already taken.";
        } else {
          console.log("Move successful!");
          options[cellID] = cellMarker;

          // console.log("options: "+options);

          // sendHealthCheckRequest();

          //trigger save  call webservice /save
          //<gameid>,<playerid>,<symbol>,<location>,<datesave>
          var location = cellID;
          var datesave = getSaveTime();
          sendSaveRequest(gameID, playerID,symbol,location,datesave);
          
          showBoardInfo(gameID);
        }
      })
      .catch(function(error) {
        console.log("Error occurred:", error);
        statusText.innerHTML = "2User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
      });

};

function sendSaveRequest(gameID, playerID,symbol,location,datesave){
  
  //trigger sendSaveRequest http://8080/...  - create/save gameID.txt and playerID.txt
  //evaluate return/response code (JSON)

  fetch(saveServiceURL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'none'
    },
    body: JSON.stringify({
      "gameID": `${gameID}`,
      "playerID": `${playerID}`,
      "symbol": `${symbol}`,
      "location": `${location}`,
      "datesave": `${datesave}`
      })  
    }).then(res => res.text())
      .then(responseText => {
          webServiceResp.textContent = responseText;
    })
    .catch(error => {
        // webServiceResp.textContent = "Error occurred while fetching data.";
        webServiceResp.textContent = "The server ran into an unexpected exception.";
        console.error("Error:", error);
    });

}

function sendHealthCheckRequest(){  
  //e.g. http://localhost:8080/WebService/server2/rest/health-check
  fetch(webServiceURL)
    .then(response => response.text())
    .then(data => {
      webServiceResp.textContent = data;
    })
    .catch(error => {
      webServiceResp.textContent = "Error occurred while fetching data.";
      console.error("Error:", error);
  });

}

function getSaveTime(){
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedTimestamp;
}


function showBoardInfo(gameID){
    var url = boardURL + "key=" +gameID;
    fetch(url)
      .then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Error Server not available");
        }
      })
      .then((boardInfo) => {
        if (boardInfo === "[GAME NOT YET STARTED]") {
          // gameBoardResp.textContent = "GAME NOT YET STARTED";
          gameBoardResp.textContent = "Opponent got disconnected or Quit the Game.";
          // gameBoardResp.innerHTML ="Opponent got disconnected or Quit the Game. <br> \"Quit\" then \"Join\" to play another game.";

          setTimeout(function() {
            location.reload();
          }, 3000);

        } else {
          var cells = document.querySelectorAll(".cell");
          var boardInfoArr = boardInfo.split(":");     
          for (var i = 0; i < cells.length; i++) {
            cells[i].textContent = boardInfoArr[i] || ""; 
            options[i] = boardInfoArr[i] || ""; //update options array

            cells[i].classList.remove("X", "O");
            if (boardInfoArr[i] === "X") {
              cells[i].classList.add("X");
            } else if (boardInfoArr[i] === "O") {
              cells[i].classList.add("O");
            }
          }
          // console.log("showBoard options"+options);
          displayTurnMessage();          
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        statusText.innerHTML = "3User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
      });
  
};


function displayTurnMessage(){
  var ctrMove = 0;
  var countX = 0;
  var countO = 0;
  var turnMessage = "";
  var flgValidMove = true;
  var playerTurnID ="X";
  
  for (var i = 0; i < options.length; i++) {
    if (options[i] === "X") {
      countX++;
    } else if (options[i] === "O") {
      countO++;
    }
  }

  ctrMove = countX+countO;
  if (ctrMove % 2 === 0) {
    playerTurnID = "X";
  } else {
    playerTurnID = "O";
  }

  // console.log("ctrMove: "+ctrMove);
  // console.log("Count of 'X': " + countX);
  // console.log("Count of 'O': " + countO);
  // console.log("playerTurnID: "+playerTurnID);

  if (countX === 0 && countO === 0) {
    turnMessage = "X's turn";
  } else if (countX === countO) {
    turnMessage = "X's turn";
  } else if (countX === countO + 1) {
    turnMessage = "O's turn";
  } else {
    flgValidMove = false;    
    // turnMessage ="invalid move. one player to make 2 turns.";
    //X need to make 2 turns
    //O need to make 2 turns

    // turnMessage = "Invalid state. \"Quit\" then \"Join\" to play another game.";
    // flgValidMove = false;
    // running = false;
    // cells.forEach((cell) => cell.removeEventListener("click", clickHandler));
  }
  
  if(!flgValidMove){
    if(playerTurnID ==="X"){
      turnMessage ="X invalid move. O to make 2 turns.";
    } else {
      turnMessage ="O invalid move. X to make 2 turns.";
    }
  }

  // console.log(turnMessage);
  statusText.textContent = turnMessage;

  if(flgValidMove) {
    checkWinner(gameID);
  }

}

function checkWinner(){
  let roundWon = false;
  var winningPlayer = "";

  for(let i = 0; i < winConditions.length; i++){
      const condition = winConditions[i];
      const cellA = options[condition[0]];
      const cellB = options[condition[1]];
      const cellC = options[condition[2]];

      if(cellA == "" || cellB == "" || cellC == ""){
          continue;
      }
      if(cellA == cellB && cellB == cellC){
          winningPlayer = cellA;
          roundWon = true;
          break;
      }
  }

  if(roundWon){
      statusText.textContent = winningPlayer +" wins the Game!";
      gameBoardResp.textContent = "\"Quit\" to play another game."
      running = false;

      if(symbol === winningPlayer){
        youWinDiv.style.display = 'block';
      } else{
        youLoseDiv.style.display = 'block';
      }
  }
  else if(!options.includes("")){
      statusText.textContent = `Draw!`;
      drawDiv.style.display = 'block';
      running = false;
  }

  if(!running){
    cells.forEach((cell) => cell.removeEventListener("click", clickHandler));
  }

}


function restartGame(gameID){
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `Player X's turn`;
  cells.forEach(cell => cell.textContent = "");
  running = true;

  //trigger reset
  //trigger createGame

  var url = resetURL + "key="+ gameID;
  fetch(url)
  .then(response => response.text())
  .then(data => {
      console.log(data);
      enterGame(gameID,playerID)
  })
  .catch(error => {
      console.error('Error:', error);
      statusText.innerHTML = "4User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
  });

}


function enterGame(gameID,playerID){
  var url = createGameURL +"key=" + gameID;
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {

  if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText;      
      console.log("enterGame response: "+response);
      if (response === "X") {
        flgPlayer1Entered = true;
        messageElement1.textContent = "Player 1(X) entered the Game";
        var url = "gameboard.html?key=" + encodeURIComponent(gameID)+ "&symbol="+ encodeURIComponent(response)+ "&playerID="+ encodeURIComponent(playerID);        
        window.location.href = url;
      } else if (response === "O") {
        flgPlayer2Entered = true;
        messageElement1.textContent = "Player 2(O) entered the Game";
        var url = "gameboard.html?key=" + encodeURIComponent(gameID)+ "&symbol="+ encodeURIComponent(response)+ "&playerID="+ encodeURIComponent(playerID);        
        window.location.href = url;
      } else if (response === "[GAME ALREADY STARTED]") {
        flgOtherPlayer = true;
        messageElement2.textContent = "Game \""+gameID+"\" already started. Create New Game instead";

      }  
      console.log("enterGame: "+response); 
    }  
  };
  xhr.send();

}


quitGameButton.addEventListener("click", exitGame);

function exitGame(){
  var url = resetURL + "key="+ gameID;

  fetch(url)
  .then(response => response.text())
  .then(data => {
      console.log(data);
      //should have evaluate response if [NO GAME TO RESET] or [EXIT]
      var url = "index.html";
      window.location.href = url;
  })
  .catch(error => {
      console.error('Error:', error);
      statusText.innerHTML = "5User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
  });

}
