package com.svi.testService;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class SaveGame {
	
	static //@work
//	private static String projectPath = "C:\\BA Training\\Application Server\\FileSystemWebService\\WebService\\";
	
	//@home
//	private static String projectPath = "C:\\Users\\USER\\eclipse-workspace\\WebService\\";
//	private static String projectPath = "C:\\Users\\Tony\\git\\repository11\\WebService\\";
	dummyMain dM = new dummyMain();
	private static String projectPath = dM.getProjectPath();
	
//	private static String projectPath = System.getProperty("user.dir");
	// System.getProperty("user.dir") was being pointed to : C:\BA Training\UI UX\payara\payara5\glassfish\domains\domain1\config\records
	
    private static String recordsGamesDirectory = "records/games";
    private static String recordsPlayersDirectory = "records/players";

    private static String fileGamePath = projectPath + File.separator + recordsGamesDirectory;
    private static String filePlayerPath = projectPath + File.separator + recordsPlayersDirectory;
    
    
    public String saveGameFile(String gameID, String fileContent, String playerID) {
    	
    	String fileGameName = gameID+".txt";
    	  	
    	String saveGameResp = "";
    	
		File file = new File(fileGamePath, fileGameName);
		
		System.out.println("filePath: "+fileGamePath);
		
		try {
            if (file.createNewFile()) {
                System.out.println("File created successfully.");
                createGameFile(file, fileContent);
//                createUpdatePlayerFile(playerID, gameID);
            } else {
                System.out.println("File already exists.");
                updateGameFile(file, fileContent);
            }
            
            saveGameResp ="Record saved";
            
            
        } catch (IOException e) {
            System.out.println("An error occurred while creating the file: " + e.getMessage());
            saveGameResp ="Record NOT saved";
        }
    	
    	return saveGameResp;
        
    }
        
    
    private static void updateGameFile(File file, String fileContent) {
        
        try {
            FileWriter fileWriter = new FileWriter(file, true); // Use 'true' to append content
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.newLine();
            bufferedWriter.write(fileContent);
            bufferedWriter.close();

            System.out.println("File updated successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
        
    }


    private static void createGameFile(File file, String fileContent) {
        try {
            if (!file.exists()) {
                file.getParentFile().mkdirs();
                file.createNewFile();
            }

            FileWriter fileWriter = new FileWriter(file);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(fileContent);
            bufferedWriter.close();

            System.out.println("File created successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    } 
    
    
    public String createUpdatePlayerFile(String playerID, String gameID) {
    	String filePlayerName = playerID+".txt";  
    	File file = new File(filePlayerPath, filePlayerName);

    	String savePlayerResp = "";
    	
    	if (file.exists()) {
    		updatePlayerFile(file, gameID);
    		savePlayerResp = filePlayerName+" file Updated";
    	} else {
    		createPlayerFile(file, gameID);
    		savePlayerResp = filePlayerName+" file Created";
    	}
    	
    	return savePlayerResp;
    
    }
    
    
    private static void createPlayerFile(File file, String fileContent) {
        try {
            if (!file.exists()) {
                file.getParentFile().mkdirs();
                file.createNewFile();
            }

            FileWriter fileWriter = new FileWriter(file);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(fileContent);
            bufferedWriter.close();

            System.out.println("File created successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    } 
    
    
    private static void updatePlayerFile(File file, String fileContent) {
        
        try {
            FileWriter fileWriter = new FileWriter(file, true); // Use 'true' to append content
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.newLine();
            bufferedWriter.write(fileContent);
            bufferedWriter.close();

            System.out.println("File updated successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
        
    }
    
    
    public String checkGame(String gameID) {
    	String fileGameName = gameID+".txt";
    	File file = new File(fileGamePath, fileGameName);
    	
    	System.out.println("fileGameName: " + fileGameName);
        System.out.println("Project Path: " + projectPath);
        System.out.println("Records Games Directory: " + recordsGamesDirectory);
        System.out.println("File Game Path: " + fileGamePath);
        System.out.println("Full File Path: " + file.getAbsolutePath());
        System.out.println("File Exists: " + file.exists());
    	
    	String checkGameOutput ="";

        if (file.exists()) {
        	checkGameOutput ="input Game ID already used";
        } else {
        	checkGameOutput ="input Game ID can be used";
        }        
        return checkGameOutput;    	
    }

}
