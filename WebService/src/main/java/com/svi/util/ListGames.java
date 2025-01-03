package com.svi.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.svi.testService.ConfigInfo;

public class ListGames {
	static //@work
//	private static String projectPath = "C:\\BA Training\\Application Server\\FileSystemWebService\\WebService\\";
	
	//@home
//	private static String projectPath = "C:\\Users\\USER\\eclipse-workspace\\WebService\\";
//	private static String projectPath = "C:\\Users\\Tony\\git\\repository11\\WebService\\";
//	dummyMain dM = new dummyMain();
//	private static String projectPath = dM.getProjectPath();
//	
//	private static String recordsPlayersDirectory = "records/players";	
//	
//    private static String filePlayerPath = projectPath + File.separator + recordsPlayersDirectory;
    
	ConfigInfo cfg = new ConfigInfo();
    private static String filePlayerPath = cfg.recordPlayersPath;	
    
	public String listPlayersGames(String playerID) {
	    	
		String listGamesResp = ""; 
		String fileName = playerID + ".txt";		
		List<String> playerGamesList = new ArrayList<>();
		
		File file = new File(filePlayerPath, fileName);
		if (!file.exists()) {
			System.out.println("The file " + fileName + " does not exist.");
		    listGamesResp = "Record not found";
//		    return;
		}
			 
		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
			String line;
		    while ((line = reader.readLine()) != null) {
		    	playerGamesList.add(line);
		    }
		            
		    listGamesResp = buildJSONRespBody(playerGamesList);
		            
		} catch (IOException e) {
			System.out.println("An error occurred while reading the file: " + e.getMessage());
		    listGamesResp = "An error occurred while reading the file: ";
		}			 

		return listGamesResp;
	    	
	}
	
	
	public static String buildJSONRespBody(List<String> playerGamesList) {
		StringBuilder jsonrespbody = new StringBuilder();
		
		jsonrespbody.append("{ \n  \"list\": [\n");

        for (String game : playerGamesList) {
            jsonrespbody.append("    { \"id\":\"").append(game).append("\"},\n");
        }

        if (jsonrespbody.length() > 3) {
            jsonrespbody.setLength(jsonrespbody.length() - 2);
        }

        jsonrespbody.append("\n  ],\n  \"msg\": \"Records found\"\n}");

        String jsonresp = jsonrespbody.toString();; 
        
		return jsonresp;
	}
	 
}
