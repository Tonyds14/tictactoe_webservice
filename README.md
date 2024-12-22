# tictactoe_webservice
tictactoe_webservice

This project is continuation of "tictactoe - html, css, js".
"tictactoe" application should be deployed in payara.

Create a webservice that is able to -
1. store the playername and it's games.
2. store the games and list the moves performed in that game.
3. Data will be save in folder "records", with sub-folder "games" and "players"
4. add functionality in the front end for user option 
- to list all the games for a player
- to list all the moves performed on the game.


Pre-requisites
1. Add/install the payara server in eclipse IDE.
- in eclipse IDE, go to tab "Help" - select "Market Place", and search "Payara", then click "install".
- restart eclipse IDE when prompted.
- 
![marketplace_payara](https://github.com/user-attachments/assets/68f85a85-017d-4a09-940c-1329d98bdfa2)

![adding payara server](https://github.com/user-attachments/assets/207153af-010c-4efc-954b-171872f7dfed)

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

![deploying java project in payara thru eclipse](https://github.com/user-attachments/assets/f16091a3-a874-4f97-92ed-b06ff17e49c4)

![payara admin console_post deploy app](https://github.com/user-attachments/assets/a90fb766-70b6-4fc8-b249-ea715a92e484)

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

Launching the game:
1. download "tictactoev2" and import to vs codes to open the html, css, and js.
2. right-click on the "index.html" and open with liveserver.

Sample Output

![sample_output1](https://github.com/user-attachments/assets/3f57a65a-64b9-49f0-b40c-e59f2ac3559f)

![sample_output2](https://github.com/user-attachments/assets/1db6f2b5-1f90-4e4a-b2d1-c637be57f581)

![error1](https://github.com/user-attachments/assets/05625af6-130d-405a-a6f1-4a4b9b84faf7)

![waiting](https://github.com/user-attachments/assets/b5b6ab78-dc93-4d67-9e91-0941e8c7109a)![Uploading error1.jpg…]()

![game_end](https://github.com/user-attachments/assets/5e6a91c9-0d49-45ae-af67-029410cdc470)

![history1](https://github.com/user-attachments/assets/c2893587-15e8-4e3b-9074-fbe23e0a1b17)

![history2](https://github.com/user-attachments/assets/52922ce5-54dd-4782-b594-50755edaf235)

![history3](https://github.com/user-attachments/assets/2dd01c0c-54ef-4d6e-8138-6f613a0d411a)
