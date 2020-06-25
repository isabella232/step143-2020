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

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  /** Data holder for each individual ride */
  public class Ride {
    public String name;
    public long capacity;
    public long currentRiders;
    
    public Ride(String name, long capacity) {
      this.name = name;
      this.capacity = capacity;
      this.currentRiders = 0;
    }

    public Ride(String name, long capacity, long currentRiders) {
      this.name = name;
      this.capacity = capacity;
      this.currentRiders = currentRiders;
    }

    public String getName() {
      return name;
    }
    
    public long getCapacity() {
      return capacity;
    }

    public long getCurrentRiders() {
      return currentRiders;
    }

  }

  public int maxcount = 3;

  // all options: "newest (descending), oldest (ascending), alphabetical, reverse-alphabetical"
  public String sort = "newest";
  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  

  /** Responds with a JSON array containing comments data. */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    if (!(request.getParameter("sort") == null)) {
      sort = request.getParameter("sort");
    }
    Query query;
    if (sort.equals("alphabetical")) {
      query = new Query("Ride").addSort("name", SortDirection.ASCENDING);
    } else {
      query = new Query("Ride").addSort("name", SortDirection.DESCENDING);
    }
    
    PreparedQuery results = datastore.prepare(query);
    int count = 0;

    if (!(request.getParameter("maxcomments") == null)) {
      maxcount = Integer.parseInt(request.getParameter("maxcomments"));
    }

    List<Ride> allRides = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      long capacity = (long) entity.getProperty("capacity");
      String name = (String) entity.getProperty("name");
      Ride ride = new Ride(name, capacity, 0);
      allRides.add(ride);

      count++;
      if (count >= maxcount) {
        break;
      }
    }

    response.setContentType("application/json;");
    Gson gson = new Gson();
    String json = gson.toJson(allRides);
    response.getWriter().println(json);
  }

  // A simple HTTP handler to extract text input from submitted web form and respond that context back to the user.
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    
    // UserService userService = UserServiceFactory.getUserService();
    
    // Must be logged in to post comments
    String name = request.getParameter("name");
    long capacity = Long.parseLong(request.getParameter("capacity"));

    Entity entryEntity = new Entity("Ride");
    entryEntity.setProperty("name", name);
    entryEntity.setProperty("capacity", capacity);
    datastore.put(entryEntity);

    response.sendRedirect("/index.html");
    
  }
}
