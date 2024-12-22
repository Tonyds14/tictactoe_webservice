package com.svi.testService;

import java.util.Set;

import javax.ws.rs.core.Application;
@javax.ws.rs.ApplicationPath("server2")

public class ApplicationConfig extends Application{
	
    @Override
    public Set<Class<?>> getClasses(){
        Set <Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }
    public void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(com.svi.testService.TestService.class);
        resources.add(com.svi.testService.CORSFilter.class);
    }


}
