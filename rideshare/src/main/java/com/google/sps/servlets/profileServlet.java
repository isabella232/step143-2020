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
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
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
  BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

@Override
public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String userEmail = userService.getCurrentUser().getEmail();
    String profileId = userService.getCurrentUser().getUserId();
    // String uploadUrl = blobstoreService.createUploadUrl("/my-form-handler");
    if (!request.getParameter("seereviews").equals(null) && (request.getParameter("seereviews")).equals("1")) {

      try {
        System.out.println((String) request.getParameter("driverId"));
        Key profileKey = KeyFactory.createKey("Profile", (String) request.getParameter("driverId"));
        Entity profileEntity = datastore.get(profileKey);
        response.setContentType("text/html;");
        response.getWriter().println("<h2>" + "Reviews for <i>" + profileEntity.getProperty("name") + "</i>:" + "</h2>");
        ArrayList<String> totalreviews = (ArrayList<String>) profileEntity.getProperty("reviews");
        ArrayList<String> totalnames = (ArrayList<String>) profileEntity.getProperty("reviewnames");

        System.out.println(totalnames);

        for(int i = 1; i < totalreviews.size(); i++) {
          String temp = totalreviews.get(i);
          String identifier = temp.substring(0, 4);
          String reviewername;
          String date;
          if (identifier.equals("4NON")) {
            reviewername = "Anonymous";
            date = temp.substring(4, 19);
            temp = temp.substring(19);
          } else {
            reviewername = totalnames.get(i);
            date = temp.substring(4, 19);
            temp = temp.substring(19);
          }
          response.getWriter().println("<p>" + "<b>Review " + i + ":</b>" + " " + date + "<br/>" + "\"" + temp + "\"" + "<br/>" + "--" + reviewername + "</p>");
        }
        if (totalreviews.size() == 1) {
          response.getWriter().println("<p> There are no reviews for this user yet</p>");
        }
      } catch (EntityNotFoundException e) {}
    } else {
        try{
          response.setContentType("text/html;");

          Key profileKey = KeyFactory.createKey("Profile", profileId);
          Entity profileEntity = datastore.get(profileKey);
          String name = (String) profileEntity.getProperty("name");
          Long capacity = (Long) profileEntity.getProperty("capacity");
          String uploadUrl = (String) profileEntity.getProperty("uploadUrl");



          response.setContentType("text/html;");
          if (profileEntity.getProperty("name").equals(null)) {
              response.getWriter().println("<h6>If nothing is visible, try updating your " + "<a href=\"" + "/editAccount.html" + "\"> <p> information </p> </a><h6>");
          } else {              
              response.getWriter().println("<br/> <img id='profilePicture' src='" + uploadUrl + "' onerror='ReplaceImage()' alt='image' class='rounded'/> ");
              response.getWriter().println("<h1>" + name + "</h1> </hr>");
              
              response.getWriter().println("<div class= 'grid-container'>");

              response.getWriter().println("<div class='grid-item'> <p><b> ID#: </b>" + profileId + "</p> </div>");
              response.getWriter().println("<div class='grid-item'> <p><b> Email: </b>" + userEmail + "</p> </div>");
              response.getWriter().println("<div class='grid-item'> <p><b> Car Capacity: </b>" + capacity + "</p> </div>");

              response.getWriter().println(" <div> <hr/>");
              

              response.getWriter().println("<h3>" + "Reviews for driver:" + "</h3>");

              ArrayList<String> totalreviews = (ArrayList<String>) profileEntity.getProperty("reviews");
              ArrayList<String> totalnames = (ArrayList<String>) profileEntity.getProperty("reviewnames");

              // for(int i = 1; i < totalreviews.size(); i++) {
              //   String temp = totalreviews.get(i);
              //   String identifier = temp.substring(0, 5);
              //   String reviewername;
              //   String date;
              //   if (identifier.equals("4NON")) {
              //     reviewername = "Anonymous";
              //     date = temp.substring(-15);
              //     temp = temp.substring(4,-15);
              //   } else {
              //     reviewername = totalnames.get(i);
              //     date = temp.substring(-15);
              //     temp = temp.substring(4,-15);
              //   }

              //   response.getWriter().println("<br/>" + date + "<br/><p>" + temp + "<br/>" + reviewername + "</h3>");
              // }

          }
      } catch (EntityNotFoundException e) {} 
    }
  }

}
 
