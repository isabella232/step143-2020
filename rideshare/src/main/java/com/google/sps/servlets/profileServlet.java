package com.google.sps.servlets;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.util.*;
import com.google.appengine.api.datastore.EntityNotFoundException;

 
@WebServlet("/profile")
public class profileServlet extends HttpServlet {
   
public class Profile {
    public String name;
    public long capacity;
    public String driverEmail;
    public String driverId;
    
    public Profile(String name, long capacity, String driverEmail, String driverId) {
      this.name = name;
      this.capacity = capacity;
      this.driverId = driverId;
      this.driverEmail = driverEmail;
    }
    public String getName() {
      return name;
    }
    public long getCapacity() {
      return capacity;
    }}

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  UserService userService = UserServiceFactory.getUserService();

public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");

    String userEmail = userService.getCurrentUser().getEmail();
    String profileId = userService.getCurrentUser().getUserId();
    
    try{
        response.setContentType("text/html;");

        Key profileKey = KeyFactory.createKey("Profile", profileId);
        Entity profileEntity = datastore.get(profileKey);
        String name = (String) profileEntity.getProperty("name");
        Long capacity = (Long) profileEntity.getProperty("capacity");

        response.setContentType("text/html;");
        if (profileEntity.getProperty("name").equals(null)) {
            response.getWriter().println("<h6>If nothing is visible, try updating your " + "<a href=\"" + "/editAccount.html" + "\"> <p> information </p> </a><h6>");
        } else {
            response.getWriter().println(profileEntity.getProperty("name"));
            response.getWriter().println("<p>Hello " + userEmail + "!</p>");
            response.getWriter().println("<p>welcome to your profile page "+ name +".</p>");
            response.getWriter().println("<p>your current car capacity is " + capacity + "!</p>");

        }
    }catch (EntityNotFoundException e) {} 
  }

}
 
