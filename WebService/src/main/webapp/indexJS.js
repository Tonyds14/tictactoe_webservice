const checkURL = "http://localhost:8080/tictactoe/tictactoeserver/check?";
const createGameURL ="http://localhost:8080/tictactoe/tictactoeserver/createGame?";

const checkGameIDServiceURL = "http://localhost:8080/WebService/server2/rest/checkgameID";
const playerGamesServiceURL = "http://localhost:8080/WebService/server2/rest/playerdata";
const listGameServiceURL = "http://localhost:8080/WebService/server2/rest/listgames";
const getGameServiceURL = "http://localhost:8080/WebService/server2/rest/getgame";

var gameForm = document.getElementById("gameForm");
var messageElement1 = document.getElementById('message1');
var messageElement2 = document.getElementById('message2');

var webServiceResp = document.getElementById("webservice-response");

var flgOtherPlayer = false;
var flgGameStarted = false;

showPage('homepage');

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
      if (page.id === pageId) {
          page.classList.add('visible');
      } else {
          page.classList.remove('visible');
      }
  });
}

gameForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission and page reload

  var inputPlayerID = document.getElementById("inputPlayerID").value.trim();
  var playerID = inputPlayerID;

  if (!/^[a-zA-Z0-9]+$/.test(playerID)) {
    // messageElement1.textContent = "Invalid player ID. Special characters are not allowed in playerID.";
    messageElement1.innerHTML = "Invalid player ID. <br>Special characters are <br>not allowed in playerID.";
    return;
  }

  var gameID = document.getElementById("inputGameID").value.trim();

  if (gameID && gameID !== '') {

    if (!/^[a-zA-Z0-9]+$/.test(gameID)) {
      // messageElement1.textContent = "Invalid game ID. Special characters are not allowed in gameID.";
      messageElement1.innerHTML = "Invalid game ID. <br>Special characters are <br>not allowed in gameID.";
      return;
    }

    //should have validation of gameID from the list of History?
    sendCheckGameRequest(gameID, playerID);

    // joinGame(gameID,playerID);
  } else {
    messageElement1.textContent = "Invalid game key. Blank gameID not applicable";
  }  

});


function sendCheckGameRequest(gameID, playerID){

  fetch(checkGameIDServiceURL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'none'
    },
    body: JSON.stringify({
      "gameID": `${gameID}`,
      })  
    }).then(res => res.text())
      .then(responseText => {
          // webServiceResp.textContent = responseText;

        if(responseText === "Input Game ID can be used"){
          joinGame(gameID,playerID);
        } else {
          // messageElement1.textContent = "Game \""+gameID+"\" was already used. Input another Game ID";
          messageElement1.innerHTML = "Game \""+gameID+"\" already used.<br>Input another Game ID";
        }

    })
    .catch(error => {
          // webServiceResp.textContent = "Error occurred while fetching data.";
          messageElement1.textContent = "Error occurred while fetching data.";
          console.error("Error:", error);
    });

}



function joinGame(gameID,playerID) {
  var url = checkURL+ "key=" + gameID;

  fetch(url)
  .then(response => response.text())
  .then(data => {
      console.log(data);
      console.log("checkGame response data: "+data);
      if (data === "true") {

        flgGameStarted = true;
        messageElement1.innerHTML = "Game \""+gameID+"\" has 2 players already. <br>Think of other Game ID instead then re-try."; ;
      } else  {

        if(!flgGameStarted && !flgOtherPlayer){
          enterGame(gameID,playerID);
          // setInterval(function() {
          //   checkStartGame(gameID);
          // }, 3000);
        }

      }       
  })
  .catch(error => {
      console.error('Error:', error);
      messageElement1.innerHTML = "User not connected to Server. <br>Verify Server availability.<br>Ensure to establish connection in Payara Server <br>then retry \"Join Game\".";
  });

}


function enterGame(gameID,playerID){
  var url = createGameURL + "key=" + gameID;
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {

  if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText;      
      console.log("enterGame response: "+response);

      var symbol = response;

      if (response === "X") {
        sendCheckPlayerRequest(gameID, playerID);

        // messageElement1.textContent = "Player 1(X) entered the Game";
        // var url = "gameboard.html?key=" + encodeURIComponent(gameID)+ "&symbol="+ encodeURIComponent(response)+ "&playerID="+ encodeURIComponent(playerID);        
        // window.location.href = url;

        showPage('gameboard');
        playgame(gameID, symbol,playerID);

      } else if (response === "O") {
        sendCheckPlayerRequest(gameID, playerID);

        // messageElement1.textContent = "Player 2(O) entered the Game";
        // var url = "gameboard.html?key=" + encodeURIComponent(gameID)+ "&symbol="+ encodeURIComponent(response)+ "&playerID="+ encodeURIComponent(playerID);        
        // window.location.href = url;

        showPage('gameboard');
        playgame(gameID,symbol,playerID);

      } else if (response === "[GAME ALREADY STARTED]") {
        flgOtherPlayer = true;
        messageElement2.textContent = "Game \""+gameID+"\" already started. Create New Game instead";

      }  
      console.log("enterGame: "+response); 
    }  
  };
  xhr.send();

}

 function sendCheckPlayerRequest(gameID, playerID){

   fetch(playerGamesServiceURL, {
     method: 'post',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'none'
     },
     body: JSON.stringify({
       "gameID": `${gameID}`,
       "playerID": `${playerID}`,
       })  
     }).then(res => res.text())
       .then(responseText => {
           messageElement2.textContent = responseText;

     })
     .catch(error => {
           messageElement2.textContent = "Error occurred while fetching data.";
           console.error("Error:", error);
     });

 }

function checkStartGame(gameID){
  var url = checkURL+ "key=" + gameID;

  fetch(url)
  .then(response => response.text())
  .then(data => {

      console.log(data);
      console.log("checkGame response data: "+data);
      if (data === "true") {

        // if(!flgOtherPlayer){
        //   var url = "gameboard.html?key=" + encodeURIComponent(gameID); 
        //   window.location.href = url;           
        // }

      } else  {
        messageElement1.textContent = "Still waiting for opponent to join";
        flgCheckGame = false;
      
      }        
      
  })
  .catch(error => {
      console.error('Error:', error);
  });

}


/*historyJS*/

document.getElementById('historyLink').addEventListener('click', function () {
showPage('historypage');
});

document.getElementById('gotoHomepageBtn3').addEventListener('click', function () {
showPage('homepage');
});

const historyForm = document.getElementById('historyForm');

var webServiceResp = document.getElementById("historywebservice-response");
var tableContainerHeader = document.getElementById("listgames-header");
var tableContainer2Header = document.getElementById("gamedetails-header");
var tableContainer = document.getElementById("tableContainer");

historyForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting (default behavior)
  
    var playerID = document.getElementById('historyInputPlayerID').value;
    console.log(`Player ID: ${playerID}`);

    sendListGamesRequest(playerID);
});

function sendListGamesRequest(playerID){

  fetch(listGameServiceURL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'none'
      },
      body: JSON.stringify({
        "playerID": `${playerID}`,
        })  
      }).then(res => res.text())
        .then(responseText => {
            // webServiceResp.textContent = responseText;
            console.log(responseText);
            if(responseText === "Record not found"){
              webServiceResp.textContent = "Record not found for \""+playerID+"\"";

              // Clear the content of the specified elements
              document.getElementById("listgames-header").innerHTML = "";
              document.getElementById("tableContainer").innerHTML = "";
              document.getElementById("gamedetails-header").innerHTML = "";
              document.getElementById("tableContainer2").innerHTML = "";

              return;
            } else {
              formatListGamesResp(responseText, playerID)
            }              

      })
      .catch(error => {
            // webServiceResp.textContent = "Error occurred while fetching data.";
            webServiceResp.textContent = "The server ran into an unexpected exception.";
            console.error("Error:", error);
      });
}

function formatListGamesResp(responseText, playerID){

try {
  var responseObject = JSON.parse(responseText);
  console.log(responseObject);

  console.log("Message:", responseObject.msg);
  webServiceResp.textContent = responseObject.msg;

  if(responseObject.msg === "Records found"){
    tableContainerHeader.textContent = "List of Games for player \""+playerID+"\"";  

    console.log("Items in the list:");
    responseObject.list.forEach(item => {
      console.log("ID:", item.id);
    });

    // var tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = "";

    var table = document.createElement("table");
    table.setAttribute("border", "1");

    //headers
    var headerRow = document.createElement("tr");
    var headerCell = document.createElement("th");
    headerCell.textContent = "Game ID";
    headerRow.appendChild(headerCell);
    table.appendChild(headerRow);

    headerCell.style.backgroundColor = "lightgray"; 
    headerCell.style.padding = "3px"; 
    headerCell.style.textAlign = "center"; 
    headerCell.style.fontFamily = "Helvetica, sans-serif";
    headerCell.style.fontSize = "14px";

    responseObject.list.forEach(item => {
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      cell.textContent = item.id;

      row.style.backgroundColor = "white";

      row.appendChild(cell);
      table.appendChild(row);

      cell.addEventListener("click", function() {
        getGameDetails(item.id); 
      });
    });

    tableContainer.appendChild(table);
  }    

} catch (error) {
  console.error("Error parsing the response:", error);
  webServiceResp.textContent = "Record not found for "+playerID;
}

}



function getGameDetails(gameID) {

  fetch(getGameServiceURL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'none'
      },
      body: JSON.stringify({
        "gameID": `${gameID}`,
        })  
      }).then(res => res.text())
        .then(responseText => {
            // webServiceResp.textContent = responseText;
            console.log(responseText);
            if(responseText === "Record not found"){
              webServiceResp.textContent = "Record not found for \""+gameID+"\"";
              return;
            } else {
              formatGetGameResp(responseText, gameID);
            }
            
      })
      .catch(error => {
            // webServiceResp.textContent = "Error occurred while fetching data.";
            webServiceResp.textContent = "The server ran into an unexpected exception.";
            console.error("Error:", error);
      });

}


function formatGetGameResp(responseText, gameID){

  try {
    var responseObject = JSON.parse(responseText);
    console.log(responseObject);

    console.log("Message:", responseObject.msg);
    webServiceResp.textContent = responseObject.msg;

    if(responseObject.msg === "Records found"){
      tableContainer2Header.textContent = "Game Details of \""+gameID+"\"";  

      console.log("Items in the list:");
      responseObject.list.forEach(item => {
        console.log("Game ID:", item.gameid);
        console.log("Player ID:", item.playerid);
        console.log("Symbol:", item.symbol);
        console.log("Location:", item.location);
        console.log("Date Saved:", item.datesaved);
      });

      var tableContainer2 = document.getElementById("tableContainer2");
      tableContainer2.innerHTML = "";

      var table = document.createElement("table");
      table.setAttribute("border", "1");
      
      //column headers
      const row = document.createElement("tr");
      const gameIdCell = document.createElement("td");
      gameIdCell.textContent = "Game ID";
      row.appendChild(gameIdCell);
      
      const playerIdCell = document.createElement("td");
      playerIdCell.textContent = "Player ID";
      row.appendChild(playerIdCell);
    
      const symbolCell = document.createElement("td");
      symbolCell.textContent = "Symbol";
      row.appendChild(symbolCell);
    
      const locationCell = document.createElement("td");
      locationCell.textContent = "Location";
      row.appendChild(locationCell);
    
      const dateSavedCell = document.createElement("td");
      dateSavedCell.textContent = "Date Saved";
      row.appendChild(dateSavedCell);
    
      row.style.backgroundColor = "lightgray";
      row.style.fontWeight = "bold";
      row.style.fontFamily = "Helvetica, sans-serif";

      table.appendChild(row);

      responseObject.list.forEach(item => {
        const row = document.createElement("tr");
        const gameIdCell = document.createElement("td");
        gameIdCell.textContent = item.gameid;
        row.appendChild(gameIdCell);
        
        const playerIdCell = document.createElement("td");
        playerIdCell.textContent = item.playerid;
        row.appendChild(playerIdCell);
      
        const symbolCell = document.createElement("td");
        symbolCell.textContent = item.symbol;
        row.appendChild(symbolCell);
      
        const locationCell = document.createElement("td");
        locationCell.textContent = item.location;
        row.appendChild(locationCell);
      
        const dateSavedCell = document.createElement("td");
        dateSavedCell.textContent = item.datesaved;
        row.appendChild(dateSavedCell);
      
        row.style.backgroundColor = "white";
        row.style.fontFamily = "Helvetica, sans-serif";

        table.appendChild(row);

      });

      tableContainer2.appendChild(table);
    } else {
      var tableContainer2 = document.getElementById("tableContainer2");
      tableContainer2.innerHTML = '';
    }

  } catch (error) {
    console.error("Error parsing the response:", error);
    webServiceResp.textContent = "Record not found for \""+gameID+"\"";
  }

}


//gameboardJS

function playgame(gameID,symbol,playerID){
  const moveURL = "http://localhost:8080/tictactoe/tictactoeserver/move?";
  const boardURL = "http://localhost:8080/tictactoe/tictactoeserver/board?";
  const resetURL = "http://localhost:8080/tictactoe/tictactoeserver/reset?";

  const webServiceURL = "http://localhost:8080/WebService/server2/rest/health-check";
  const saveServiceURL = "http://localhost:8080/WebService/server2/rest/save";

  const cellMarker = symbol;

  var gameIdTitle = document.getElementById("gameIdTitle");
  var playerIDElement = document.getElementById("playerID");
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

  var turnMessage = "";

  const clickHandler = (event) => clickCell(event.target, gameID, symbol,playerID);

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

  gameIdTitle.textContent += " " + gameID;
  playerIDElement.textContent += " Player "+symbol+": "+playerID;

  // processGame(gameID,symbol,playerID);

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
        statusText.innerHTML = "User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
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
          statusText.innerHTML = "User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
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
              // location.reload();
              showBoardInfo(gameID);
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
          statusText.innerHTML = "User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
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
        statusText.innerHTML = "User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server.";
    });

  }

}




//template function
function dummysendSaveRequest(gameID, playerID,symbol,location,datesave){

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
        webServiceResp.textContent = "Error occurred while fetching data.";
        console.error("Error:", error);
  });

}


function sendHealthCheckRequest(){ 

  fetch(webServiceHealthCheckURL)
    .then(response => response.text())
    .then(data => {
      webServiceResp.textContent = data;
    })
    .catch(error => {
      webServiceResp.textContent = "Error occurred while fetching data.";
      console.error("Error:", error);
  });

}


