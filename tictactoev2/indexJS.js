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
    messageElement1.textContent = "Invalid player ID. Special characters are not allowed in gameID.";
    return;
  }

  var gameID = document.getElementById("inputGameID").value.trim();

  if (gameID && gameID !== '') {

    if (!/^[a-zA-Z0-9]+$/.test(gameID)) {
      messageElement1.textContent = "Invalid game ID. Special characters are not allowed in gameID.";
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

        if(responseText === "input Game ID can be used"){
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
          setInterval(function() {
            checkStartGame(gameID);
          }, 3000);
        }

      }       
  })
  .catch(error => {
      console.error('Error:', error);
      messageElement1.innerHTML = "User not connected to Server. Verify Server availability.<br>Ensure to establish connection in Payara Server then retry \"Join Game\".";
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
      if (response === "X") {
        sendCheckPlayerRequest(gameID, playerID);

        messageElement1.textContent = "Player 1(X) entered the Game";
        var url = "gameboard.html?key=" + encodeURIComponent(gameID)+ "&symbol="+ encodeURIComponent(response)+ "&playerID="+ encodeURIComponent(playerID);        
        window.location.href = url;

      } else if (response === "O") {
        sendCheckPlayerRequest(gameID, playerID);

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

        if(!flgOtherPlayer){
          var url = "gameboard.html?key=" + encodeURIComponent(gameID); 
          window.location.href = url;           
        }

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


