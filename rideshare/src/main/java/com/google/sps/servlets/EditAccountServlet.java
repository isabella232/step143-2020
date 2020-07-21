package com.google.sps.servlets;
import com.google.gson.Gson;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
// import com.google.sps.data.Task;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.util.*;
import com.google.appengine.api.datastore.EntityNotFoundException;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/edit")
public class EditAccountServlet extends HttpServlet {

  /** Data holder for each individual Profile */
  public class Profile {
    public String name;
    public long capacity;
    public String driverEmail;
    public String driverId;
    public double rating;
    public long numratings;
    public ArrayList<String> usersRated;
    public ArrayList<Long> myRides;
    public String uploadUrl;
    public ArrayList<String> reviews;
    
    public Profile(String name, long capacity, String driverEmail, String driverId, double rating, long numratings, ArrayList<String> usersRated, ArrayList<Long> myRides, String uploadUrl, ArrayList<String> reviews) {
      this.name = name;
      this.capacity = capacity;
      this.driverId = driverId;
      this.driverEmail = driverEmail;
      this.rating = rating;
      this.numratings = numratings;
      this.usersRated = usersRated;
      this.myRides = myRides;
      this.uploadUrl = uploadUrl;
      this.reviews = reviews;
    }

    public String getName() {
      return name;
    }
    
    public long getCapacity() {
      return capacity;
    }

  }

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  UserService userService = UserServiceFactory.getUserService();
  BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();


  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    UserService userService = UserServiceFactory.getUserService();
    String profileId;
    if (request.getParameter("type").equals("1")) {
      profileId = userService.getCurrentUser().getUserId();
    } else {
      // type is set to ID
      profileId = request.getParameter("type");
    }

    try{
      Key profileEntityKey = KeyFactory.createKey("Profile", profileId);
      Entity profileEntity = datastore.get(profileEntityKey);

      List<Profile> profileDetails = new ArrayList<>();
      response.setContentType("application/json;");
      if (profileEntity.getProperty("name").equals(null)) {
        Gson gson = new Gson();
        String json = gson.toJson(profileDetails);
        response.getWriter().println(json);
      } else {
        String driverEmail = userService.getCurrentUser().getEmail();
        double rating = (double) profileEntity.getProperty("rating");
        long numratings = (long) profileEntity.getProperty("numratings");
        ArrayList<String> usersRated = (ArrayList<String>) profileEntity.getProperty("usersRated");
        ArrayList<Long> myRides = (ArrayList<Long>) profileEntity.getProperty("myRides");
        String uploadUrl = (String) profileEntity.getProperty("uploadUrl");
        ArrayList<String> reviews = (ArrayList<String>) profileEntity.getProperty("reviews");

        Profile temp = new Profile((String) profileEntity.getProperty("name"), (long) profileEntity.getProperty("capacity"), driverEmail, profileId, rating, numratings, usersRated, myRides, uploadUrl, reviews);
        profileDetails.add(temp);
        Gson gson = new Gson();
        String json = gson.toJson(profileDetails);
        response.getWriter().println(json);
      }
    } catch (EntityNotFoundException e) {
    } 
  }

  // A simple HTTP handler to extract text input from submitted web form and respond that context back to the user.
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    try {
      String name = request.getParameter("name");
      name = name.substring(0,1).toUpperCase() + name.substring(1);
      long capacity = Long.parseLong(request.getParameter("capacity"));
      String driverEmail = userService.getCurrentUser().getEmail();
      String driverId = userService.getCurrentUser().getUserId();
      String uploadUrl = request.getParameter("uploadUrl");

      Key profileEntityKey = KeyFactory.createKey("Profile", driverId);
      Entity profileEntity = datastore.get(profileEntityKey);

      profileEntity.setProperty("name", name);
      profileEntity.setProperty("capacity", capacity);
      profileEntity.setProperty("uploadUrl", uploadUrl);

      datastore.put(profileEntity);
      response.sendRedirect("/index.html");


    } catch (EntityNotFoundException e) {
      String name = request.getParameter("name");
      name = name.substring(0,1).toUpperCase() + name.substring(1);
      long capacity = Long.parseLong(request.getParameter("capacity"));
      String driverEmail = userService.getCurrentUser().getEmail();
      String driverId = userService.getCurrentUser().getUserId();
      String uploadUrl = request.getParameter("uploadUrl");

      ArrayList<String> usersRated = new ArrayList<String>();
      usersRated.add("");
      ArrayList<String> myRides = new ArrayList<String>();
      myRides.add("");
      ArrayList<String> reviews = new ArrayList<String>();
      reviews.add("");

      Entity entryEntity = new Entity("Profile", driverId);
      entryEntity.setProperty("name", name);
      entryEntity.setProperty("capacity", capacity);
      entryEntity.setProperty("driverId", driverId);
      entryEntity.setProperty("driverEmail", driverEmail);
      entryEntity.setProperty("rating", 0.0);
      entryEntity.setProperty("numratings", 0);
      entryEntity.setProperty("uploadUrl", uploadUrl);
      entryEntity.setProperty("usersRated", usersRated);
      entryEntity.setProperty("myRides", myRides);
      entryEntity.setProperty("reviews", reviews);
      datastore.put(entryEntity);

      response.sendRedirect("/index.html");
    } 
    
  }
}
