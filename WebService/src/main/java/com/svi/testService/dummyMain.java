package com.svi.testService;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class dummyMain {

	public static void main(String[] args) {
//		createGameFile();
//		readRecordPlayerText();
//		readRecordGameText();
//		getProjectPath();
		checkGameId();
	}
	
	public static void checkGameId() {
        SaveGame sg = new SaveGame();
        String gameID = "G2";
        String checkGameOutput = sg.checkGame(gameID);
        System.out.println("checkGameOutput: " +checkGameOutput);
	}
	
	public String getProjectPath() {
		String projectPath = System.getProperty("user.dir") +"\\";
		System.out.println("Project path: " +projectPath);
		return projectPath;
	}
	
	
	
	public static void createGameFile() {
        String folderName = "records";
        String fileName = "temp2.txt";

        String fileContent = "hello,mockplayer1,X,3,2023-08-02 10:12:00";

        File directory = new File(folderName);

        if (!directory.exists()) {
            if (directory.mkdirs()) {
                System.out.println("Directory created successfully.");
            } else {
                System.out.println("Failed to create the directory.");
                return;
            }
        }

        File file = new File(directory, fileName);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            // Write the fileContent to the file
            writer.write(fileContent);
            System.out.println("File created successfully and content written.");
        } catch (IOException e) {
            System.out.println("An error occurred while writing the file: " + e.getMessage());
        }
    
		
//		String folderName = "records";
//		String fileName = "temp2.txt";
//		
//		String fileContent ="to follow";		
//		
//		File directory = new File(folderName);
//		
//		if (!directory.exists()) {
//            if (directory.mkdirs()) {
//                System.out.println("Directory created successfully.");
//            } else {
//                System.out.println("Failed to create the directory.");
//                return;
//            }
//        }
//		
//		File file = new File(directory, fileName);
//		
//		try {
//            // Create the file
//            if (file.createNewFile()) {
//                System.out.println("File created successfully.");
//            } else {
//                System.out.println("File already exists.");
//            }
//        } catch (IOException e) {
//            System.out.println("An error occurred while creating the file: " + e.getMessage());
//        }
	}
	
	
	public static void readRecordPlayerText() {
		String playerID = "mockplayer";
		String folderName = "records";
		String fileName = playerID + ".txt";
		
		List<String> playerGamesList = new ArrayList<>();
		
		File directory = new File(folderName);
		if (!directory.exists()) {
            System.out.println("The 'records' folder does not exist.");
            return;
        }
		
		 File file = new File(directory, fileName);
		 if (!file.exists()) {
	            System.out.println("The file " + fileName + " does not exist.");
	            return;
	     }
		 
		 try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	            // Read the contents of the file line by line
	            String line;
	            while ((line = reader.readLine()) != null) {
	            	playerGamesList.add(line);
//	                System.out.println(line); 
	            }
	            
	            for (String game : playerGamesList) {
		            System.out.println(game);
	            }
			 
	            buildJSONBodyList(playerGamesList);
	            
	     } catch (IOException e) {
	            System.out.println("An error occurred while reading the file: " + e.getMessage());
	     }
		 
		 
		 
	}
	
	public static void buildJSONBodyList(List<String> playerGamesList) {
		StringBuilder jsonrespbody = new StringBuilder();
		
		jsonrespbody.append("{ \n  \"list\": [\n");

        for (String game : playerGamesList) {
            jsonrespbody.append("    { \"id\":\"").append(game).append("\"},\n");
        }

        // Remove the last ",\n" from the formatted string
        if (jsonrespbody.length() > 3) {
            jsonrespbody.setLength(jsonrespbody.length() - 2);
        }

        jsonrespbody.append("\n  ],\n  msg: \"Records found\"\n}");

        System.out.println(jsonrespbody.toString());
		
	}
	
	
	public static void readRecordGameText() {
		String gameID = "mockgame1";
		String folderName = "records";
		String fileName = gameID + ".txt";
		
		List<String> gamesDetails = new ArrayList<>();
		
		File directory = new File(folderName);
		if (!directory.exists()) {
            System.out.println("The 'records' folder does not exist.");
            return;
        }
		
		 File file = new File(directory, fileName);
		 if (!file.exists()) {
	            System.out.println("The file " + fileName + " does not exist.");
	            return;
	     }
		 
		 try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	            // Read the contents of the file line by line
	            String line;
	            while ((line = reader.readLine()) != null) {
//	                System.out.println(line); // Print the content of each line
	                gamesDetails.add(line);
	            }
	            
	            buildJSONBodyResp(gamesDetails);
	            
	     } catch (IOException e) {
	            System.out.println("An error occurred while reading the file: " + e.getMessage());
	     }
	}
	
	
	public static void buildJSONBodyResp(List<String> gamesDetails) {
		
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
            .append("“gameid”:”").append(gameId).append("”,\n")
            .append("”playerid”:”").append(playerId).append("”,\n")
            .append("“symbol”:”").append(symbol).append("”,\n")
            .append("“location”:”").append(location).append("”,\n")
            .append("“datesaved”:” “").append(dateSaved).append("”\n")
            .append("},\n");
        }
		
        // Remove the last comma and newline from the formatted string
		if (jsonResp.length() > 3) {
            jsonResp.setLength(jsonResp.length() - 2);
        }
        
        jsonResp.append("\n  ],\n")
        .append("  msg: \"Records found\"\n")
        .append("}");

        System.out.println(jsonResp.toString());
		
	}

}
