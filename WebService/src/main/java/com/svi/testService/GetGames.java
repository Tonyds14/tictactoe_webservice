package com.svi.testService;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GetGames {

	//@work
//	private static String projectPath = "C:\\BA Training\\Application Server\\FileSystemWebService\\WebService\\";
	
	//@home
//	private static String projectPath = "C:\\Users\\USER\\eclipse-workspace\\WebService\\";
	private static String projectPath = "C:\\Users\\Tony\\git\\repository11\\WebService\\";
//	private static String projectPath = getProjectPath();
	
	private static String recordsGamesDirectory = "records/games";	
	
	private static String fileGamePath = projectPath + File.separator + recordsGamesDirectory;
	
	public static String getProjectPath() {
		String pPath = System.getProperty("user.dir");
		System.out.println("Project path: " +pPath);
		return pPath;
	}
	
	public String getGameRecords(String gameID) {
		
		String getGamesResp = "";		
		String fileName = gameID + ".txt";
		List<String> gamesDetails = new ArrayList<>();
		
		
		File file = new File(fileGamePath, fileName);
		
		if (!file.exists()) {
			System.out.println("The file " + fileName + " does not exist.");
			getGamesResp = "Record not found";
//		    return;
		}
			 
		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
			String line;
		    while ((line = reader.readLine()) != null) {
		    	gamesDetails.add(line);
//		        System.out.println(line); 
		    }
		            
		    getGamesResp = buildJSONBodyResp(gamesDetails);
		            
		} catch (IOException e) {
			System.out.println("An error occurred while reading the file: " + e.getMessage());
			getGamesResp = "An error occurred while reading the file: ";
		}			
	    	
		return getGamesResp;
    	
    }
	
	
	public static String buildJSONBodyResp(List<String> gamesDetails) {
		
		StringBuilder jsonResp = new StringBuilder();
		jsonResp.append("{\n  \"list\": [\n");
		
		for (String game : gamesDetails) {
			String[] gamesArray = game.split(",");
			String gameId = gamesArray[0];
            String playerId = gamesArray[1];
            String symbol = gamesArray[2];
            String location = gamesArray[3];
            String dateSaved = gamesArray[4];
            
            jsonResp.append("{ \n")
            .append("\"gameid\":\"").append(gameId).append("\",\n")
            .append("\"playerid\":\"").append(playerId).append("\",\n")
            .append("\"symbol\":\"").append(symbol).append("\",\n")
            .append("\"location\":\"").append(location).append("\",\n")
            .append("\"datesaved\":\"").append(dateSaved).append("\"\n")
            .append("},\n");
        }
		
        // Remove the last comma and newline from the formatted string
		if (jsonResp.length() > 3) {
            jsonResp.setLength(jsonResp.length() - 2);
        }
        
        jsonResp.append("\n  ],\n")
        .append("  \"msg\": \"Records found\"\n")
        .append("}");

        System.out.println(jsonResp.toString());
        String jsonresp = jsonResp.toString();
        
        return jsonresp;
		
	}

}
