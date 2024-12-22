# tictactoe_webservice
tictactoe_webservice

This project is continuation of "tictactoe - html, css, js".
"tictactoe" application should be deployed in payara.

Create a webservice that is able to -
1. store the playername and it's games.
2. store the games and list the moves performed in that game.
3. Data will be save in folder "records", with sub-folder "games" and "players"
4. for the game,
file name will be the name of the Game/Game ID, and will store the movements made on that game. sample below
file Name: "hello.txt"
content as follows;
hello,ton,X,0,2023-08-02 19:11:13
hello,ton2,O,1,2023-08-02 19:11:15
hello,ton,X,6,2023-08-02 19:11:16
hello,ton2,O,4,2023-08-02 19:11:18

5. for the players.
file name will be the name of the player, and content will be the games that the player joined. sample below
file name: "ton.txt"
content as follows;
hello
hello1

add functionality in the front end for user option 
- to list all the games for a player
- to list all the moves performed on the game.


Pre-requisites
1. Add/install the payara server in eclipse IDE.
- in eclipse IDE, go to tab "Help" - select "Market Place", and search "Payara", then click "install".
- restart eclipse IDE when prompted.
2. Add the payara server.
Go to Window > Show View > Servers (if the Servers view is not already open).
In the Servers view, click New Server (or right-click and choose New > Server).
In the New Server dialog:
Expand the Payara category.
Select the appropriate Payara Server version (e.g., Payara Server Full or Payara Micro).
Click Next.
Configure the server:
Browse and select the Payara Server installation directory.(locate the path of you're payara server)
Click Finish.

3. If you are getting error in starting payara server thru eclipse IDE, start the payara server thru cmd.
locate the "asadmin.bat" file in you're payara server folder.
type-in "cmd" - to open command prompt
type-in "asadmin start-domain" - to start server.
Note: in Eclipse IDE, "Servers" tab - "Payara" domain - should have status of "Started, Synchronized".

4. Deploying java project in payara server thru eclipse IDE.
right-click the java project, and drag to the "Servers" - under "Payara"
application/java project will be added and will have status of "Started,Synchronized"


5. check the payara admin console
http://localhost:4848

6. Test connectivity - to verify if front end is able to connect the webservice.
Type-in "http://localhost:8080/WebService/server2/rest/health-check" in web browser.
Message should be "Health check successful"

Note: 
base url
"http://localhost:8080/" + "application name" + "application path" defined in application config. + "path" defined in TestService class

sample
http://localhost:8080/WebService/server2/rest/
