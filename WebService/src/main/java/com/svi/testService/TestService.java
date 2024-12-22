package com.svi.testService;

import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.json.JSONObject;


@Path("rest")
public class TestService {
	
	@GET
	@Path("health-check")
    public Response healthCheck() {
        // Your health-check logic here...
        // Return the response with the CORS header
        ResponseBuilder response = Response.ok("Health check successful");
        response.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
        return response.build();
    }
	
	@POST
	@Path("/save")
	public Response saveGame(String jsonData) {
        // incoming data is in the format
        // {"gameID": '${gameID}', "playerID": '${playerID}', "symbol": '${symbol}', "location": '${location}', "datesave": '${datesave}'}

        System.out.println("Received JSON Data: " + jsonData);
        JSONObject jsonObject = new JSONObject(jsonData);

        String gameID = jsonObject.getString("gameID");
        String playerID = jsonObject.getString("playerID");
        String symbol = jsonObject.getString("symbol");
        String location = jsonObject.getString("location");
        String datesave = jsonObject.getString("datesave");
        String gameFileContent = gameID+","+playerID+","+symbol+","+location+","+datesave;
        
        SaveGame sg = new SaveGame();
        String saveGameResp = sg.saveGameFile(gameID, gameFileContent, playerID);

        // Return a response (optional)
        return Response.ok(saveGameResp).build();   
        
    }
	
	
	@POST
	@Path("/listgames")
	public Response listGames(String jsonData) {
		
		System.out.println("Received JSON Data: " + jsonData);
        JSONObject jsonObject = new JSONObject(jsonData);
        
        String playerID = jsonObject.getString("playerID");
		
        ListGames lg = new ListGames();
        String listGamesResp = lg.listPlayersGames(playerID);
        
//		return Response.ok("Records found").build();  
        return Response.ok(listGamesResp).build();
	}
	
	@POST
	@Path("/getgame")
	public Response getGame(String jsonData) {
		
		System.out.println("Received JSON Data: " + jsonData);
        JSONObject jsonObject = new JSONObject(jsonData);
        
        String gameID = jsonObject.getString("gameID");
        GetGames gg = new GetGames();
        String getGamesResp = gg.getGameRecords(gameID);
		
//		return Response.ok("Records found").build();
		return Response.ok(getGamesResp).build();
		
	}
	
	@POST
	@Path("/checkgameID")
	public Response checkGame(String jsonData) {
		
		System.out.println("Received JSON Data: " + jsonData);
        JSONObject jsonObject = new JSONObject(jsonData);
        
        String gameID = jsonObject.getString("gameID");
		
        SaveGame sg = new SaveGame();
        String checkGameOutput = sg.checkGame(gameID);
//		return Response.ok("Records found").build();  
		return Response.ok(checkGameOutput).build();
	}
	
	
	@POST
	@Path("/playerdata")
	public Response savePlayer(String jsonData) {
        // incoming data is in the format
        // {"gameID": '${gameID}', "playerID": '${playerID}', "symbol": '${symbol}', "location": '${location}', "datesave": '${datesave}'}

        System.out.println("Received JSON Data: " + jsonData);
        JSONObject jsonObject = new JSONObject(jsonData);

        String gameID = jsonObject.getString("gameID");
        String playerID = jsonObject.getString("playerID");
        
        SaveGame sg = new SaveGame();
        String savePlayerResp = sg.createUpdatePlayerFile(playerID, gameID);

        // Return a response (optional)
        return Response.ok(savePlayerResp).build();   
        
    }
	

}
