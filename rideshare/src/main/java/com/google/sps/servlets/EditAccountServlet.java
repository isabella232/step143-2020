// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
    
    public Profile(String name, long capacity, String driverEmail, String driverId, double rating, long numratings) {
      this.name = name;
      this.capacity = capacity;
      this.driverId = driverId;
      this.driverEmail = driverEmail;
      this.rating = rating;
      this.numratings = numratings;
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

  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    UserService userService = UserServiceFactory.getUserService();

    String profileId = userService.getCurrentUser().getUserId();

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
        Profile temp = new Profile((String) profileEntity.getProperty("name"), (long) profileEntity.getProperty("capacity"), driverEmail, profileId, rating, numratings);
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

    String firstName = request.getParameter("firstName");
    String lastName = request.getParameter("lastName");

    String name = firstName + " " + lastName;
    long capacity = Long.parseLong(request.getParameter("capacity"));
    String driverEmail = userService.getCurrentUser().getEmail();
    String driverId = userService.getCurrentUser().getUserId();

    Entity entryEntity = new Entity("Profile", driverId);
    entryEntity.setProperty("name", name);
    entryEntity.setProperty("capacity", capacity);
    entryEntity.setProperty("driverId", driverId);
    entryEntity.setProperty("driverEmail", driverEmail);
    entryEntity.setProperty("rating", 0.0);
    entryEntity.setProperty("numratings", 0);
    datastore.put(entryEntity);

    response.sendRedirect("/index.html");
    
  }
}
