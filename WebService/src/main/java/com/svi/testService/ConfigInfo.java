package com.svi.testService;

//import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.eclipse.jdt.internal.compiler.batch.Main;

//import com.svi.indexing.Main;

import java.io.FileInputStream;

public class ConfigInfo {
    private Properties properties;  
    String projectPath = "";
    public String recordGamesPath ="";
    public String recordPlayersPath ="";   
    
    
    public ConfigInfo() {
        loadProperties();
    }
    
    private void loadProperties() {
        properties = new Properties();
            
//        try (InputStream inputStream = Main.class.getClassLoader().getResourceAsStream("config/config.properties")) {
//            properties.load(inputStream);  
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        
        try 
        	(InputStream inputStream = Main.class.getClassLoader().getResourceAsStream("config/config.properties")) {
              properties.load(inputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Get the project path
        projectPath = System.getProperty("user.dir");

        // Replace the placeholder with the project path in the properties
        recordGamesPath = properties.getProperty("Records_Games");
//        recordGamesPath = recordGamesPath.replace("${projectPath}", projectPath);

        recordPlayersPath = properties.getProperty("Records_Players");
//        recordPlayersPath = recordPlayersPath.replace("${projectPath}", projectPath);

        // Use the updated directory paths for further processing
        System.out.println("recordGamesPath: " + recordGamesPath);
        System.out.println("recordPlayersPath: " + recordPlayersPath);
    }
    
  	public String getRecordGame() {
        return properties.getProperty("Records_Games");
    }
    
    public String getRecordPlayer() {
        return properties.getProperty("Records_Players");
    }
    

    
}
