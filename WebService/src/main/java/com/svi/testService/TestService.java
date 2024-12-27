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

import org.json.JSONException;
import org.json.JSONObject;

import com.svi.util.GetGames;
import com.svi.util.ListGames;
import com.svi.util.SaveGame;


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
        
        try {
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
	//        return Response.ok(saveGameResp).build();  
	        // Check the response from SaveGame logic
	        if ("SUCCESS".equalsIgnoreCase(saveGameResp)) {
	            // Return success response (200 OK)
	            return Response.status(Response.Status.OK)
	                    .entity("Game saved successfully!")
	                    .build();
        } else {
            // Return conflict response (409 Conflict) if game could not be saved
            return Response.status(Response.Status.CONFLICT)
                    .entity("Failed to save the game: " + saveGameResp)
                    .build();
        	}
        } catch (JSONException e) {
	        System.err.println("Error parsing JSON: " + e.getMessage());
	
	        // Return bad request response (400 Bad Request)
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("Invalid JSON format: " + e.getMessage())
	                .build();
	    } catch (Exception e) {
	        System.err.println("Unexpected error: " + e.getMessage());
	
	        // Return internal server error response (500 Internal Server Error)
	        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
	                .entity("An unexpected error occurred: " + e.getMessage())
	                .build();
	    }
        
    }
	
	
	@POST
	@Path("/listgames")
	public Response listGames(String jsonData) {
		
		System.out.println("Received JSON Data: " + jsonData);
		
	    try {
	        JSONObject jsonObject = new JSONObject(jsonData);
	        
	        String playerID = jsonObject.getString("playerID");
			
	        ListGames lg = new ListGames();
	        String listGamesResp = lg.listPlayersGames(playerID);
	        
	//		return Response.ok("Records found").build();  
//	        return Response.ok(listGamesResp).build();
	        
	        // Check the response from ListGames logic
	        if (listGamesResp != null && !listGamesResp.isEmpty()) {
	            // Return success response (200 OK)
	            return Response.status(Response.Status.OK)
	                    .entity(listGamesResp)
	                    .build();
	        } else {
	            // Return no content response (204 No Content) if no records found
	            return Response.status(Response.Status.NO_CONTENT)
	                    .entity("No games found for the player ID: " + playerID)
	                    .build();
	        }
	    } catch (JSONException e) {
	        System.err.println("Error parsing JSON: " + e.getMessage());

	        // Return bad request response (400 Bad Request)
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("Invalid JSON format: " + e.getMessage())
	                .build();
	    } catch (Exception e) {
	        System.err.println("Unexpected error: " + e.getMessage());

	        // Return internal server error response (500 Internal Server Error)
	        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
	                .entity("An unexpected error occurred: " + e.getMessage())
	                .build();
	    }
	}
	
	
	@POST
	@Path("/getgame")
	public Response getGame(String jsonData) {
		
		System.out.println("Received JSON Data: " + jsonData);
		
	    try {
	        JSONObject jsonObject = new JSONObject(jsonData);
	        
	        String gameID = jsonObject.getString("gameID");
	        GetGames gg = new GetGames();
	        String getGamesResp = gg.getGameRecords(gameID);
			
	//		return Response.ok("Records found").build();
//			return Response.ok(getGamesResp).build();
	        
	        // Check the response from GetGames logic
	        if (getGamesResp != null && !getGamesResp.isEmpty()) {
	            // Return success response (200 OK)
	            return Response.status(Response.Status.OK)
	                    .entity(getGamesResp)
	                    .build();
	        } else {
	            // Return no content response (204 No Content) if no records found
	            return Response.status(Response.Status.NO_CONTENT)
	                    .entity("No records found for game ID: " + gameID)
	                    .build();
	        }
	    } catch (JSONException e) {
	        System.err.println("Error parsing JSON: " + e.getMessage());

	        // Return bad request response (400 Bad Request)
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("Invalid JSON format: " + e.getMessage())
	                .build();
	    } catch (Exception e) {
	        System.err.println("Unexpected error: " + e.getMessage());

	        // Return internal server error response (500 Internal Server Error)
	        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
	                .entity("An unexpected error occurred: " + e.getMessage())
	                .build();
	    }
		
	}
	
	
	
	
	@POST
	@Path("/checkgameID")
	public Response checkGame(String jsonData) {
		
		System.out.println("Received JSON Data: " + jsonData);
		
	    try {
	        JSONObject jsonObject = new JSONObject(jsonData);
	        
	        String gameID = jsonObject.getString("gameID");
			
	        SaveGame sg = new SaveGame();
	        String checkGameOutput = sg.checkGame(gameID);
	//		return Response.ok("Records found").build();  
//			return Response.ok(checkGameOutput).build();
			
	        // Check the response from SaveGame logic
	        if (checkGameOutput != null && !checkGameOutput.isEmpty()) {
	            // Return success response (200 OK)
	            return Response.status(Response.Status.OK)
	                    .entity(checkGameOutput)
	                    .build();
	        } else {
	            // Return no content response (204 No Content) if no records found
	            return Response.status(Response.Status.NO_CONTENT)
	                    .entity("No data found for game ID: " + gameID)
	                    .build();
	        }
	    } catch (JSONException e) {
	        System.err.println("Error parsing JSON: " + e.getMessage());

	        // Return bad request response (400 Bad Request)
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("Invalid JSON format: " + e.getMessage())
	                .build();
	    } catch (Exception e) {
	        System.err.println("Unexpected error: " + e.getMessage());

	        // Return internal server error response (500 Internal Server Error)
	        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
	                .entity("An unexpected error occurred: " + e.getMessage())
	                .build();
	    }
	}
	
	
	
	
	@POST
	@Path("/playerdata")
	public Response savePlayer(String jsonData) {
        // incoming data is in the format
        // {"gameID": '${gameID}', "playerID": '${playerID}', "symbol": '${symbol}', "location": '${location}', "datesave": '${datesave}'}

        System.out.println("Received JSON Data: " + jsonData);
        try {
        JSONObject jsonObject = new JSONObject(jsonData);

        String gameID = jsonObject.getString("gameID");
        String playerID = jsonObject.getString("playerID");
        
        SaveGame sg = new SaveGame();
        String savePlayerResp = sg.createUpdatePlayerFile(playerID, gameID);

        // Return a response (optional)
//        return Response.ok(savePlayerResp).build();   
        // Set success response (200 OK)
        return Response.status(Response.Status.OK)
                .entity(savePlayerResp)
                .build();
        
	    } catch (JSONException e) {
	        System.err.println("Error parsing JSON: " + e.getMessage());
	
	        // Set bad request response (400 Bad Request)
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("Invalid JSON format")
	                .build();
	    } catch (Exception e) {
	        System.err.println("Unexpected error: " + e.getMessage());
	
	        // Set internal server error response (500 Internal Server Error)
	        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
	                .entity("An unexpected error occurred")
	                .build();
	    }
	}

}
