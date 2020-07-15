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
import com.google.appengine.api.datastore.Query.StContainsFilter;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.EntityNotFoundException;
import java.util.*;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  /** Data holder for each individual ride */
  public class Ride {
    public long id;
    public String name;
    public long capacity;
    public long currentRiders;
    public String driverEmail;
    public String driverId;
    public ArrayList<String> riderList;  
    public String start;
    public String end;
    public String ridedate;
    public String ridetime;
    public String price;
    public String paymentMethod;

    public Ride(long id, String name, long capacity, String driverEmail, String driverId, ArrayList<String> riderList) {
      this.id = id;
      this.name = name;
      this.capacity = capacity;
      this.currentRiders = 0;
      this.driverEmail = driverEmail;
      this.driverId = driverId;
      this.riderList = riderList;
    }

    public Ride(long id, String name, long capacity, long currentRiders, String driverEmail, 
    String driverId, ArrayList<String> riderList, GeoPt start, GeoPt end, String ridedate, String ridetime, String price,
    String paymentMethod) {
      this.id = id;
      this.name = name;
      this.capacity = capacity;
      this.currentRiders = currentRiders;
      this.driverEmail = driverEmail;
      this.driverId = driverId;
      this.riderList = riderList;
      this.start = start.toString();
      this.end = end.toString();
      this.ridedate = ridedate;
      this.ridetime = ridetime;
      this.price = price;
      this.paymentMethod = paymentMethod;
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

  public int maxcount = 5;

  // all options: alphabetical, reverse-alphabetical, location"
  public String sort = "alphabetical";
  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  UserService userService = UserServiceFactory.getUserService();


  /** Responds with a JSON array containing comments data. */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    if (!(request.getParameter("sort") == null)) {
      sort = request.getParameter("sort");
    }
    String type = request.getParameter("type");
    Query query;
    List<Ride> allRides = new ArrayList<>();
    if (type.equals("table")){
      try{
        if (sort.equals("startdistance")) {
          GeoPt start = new GeoPt(Float.parseFloat(request.getParameter("startlat")), Float.parseFloat(request.getParameter("startlng")));
          double maxdistance = Double.parseDouble(request.getParameter("maxdistance"));
          StContainsFilter radiusFilter = new StContainsFilter("start", new Query.GeoRegion.Circle(start, maxdistance));
          query = new Query("Ride").setFilter(radiusFilter);
        } else if (sort.equals("reverse-alphabetical")){
          query = new Query("Ride").addSort("name", SortDirection.DESCENDING);
        } else if (sort.equals("date")) {
          query = new Query("Ride").addSort("ridedate", SortDirection.ASCENDING);
        } else if (sort.equals("fardate")) {
          query = new Query("Ride").addSort("ridedate", SortDirection.DESCENDING);  
        } else {
          query = new Query("Ride").addSort("name", SortDirection.ASCENDING);
        }
        
        PreparedQuery results = datastore.prepare(query);
        int count = 0;

        if (!(request.getParameter("maxcomments") == null)) {
          maxcount = Integer.parseInt(request.getParameter("maxcomments"));
        }

      
        for (Entity entity : results.asIterable()) {
          long id = entity.getKey().getId();

          Entity profEntity = datastore.get(KeyFactory.createKey("Ride", id));
          profEntity.setProperty("id", id);
          datastore.put(profEntity);

          long capacity = (long) entity.getProperty("capacity");
          String name = (String) entity.getProperty("name");
          long currentRiders = (long) entity.getProperty("currentRiders");
          String driverEmail = (String) entity.getProperty("driverEmail");
          String driverId = (String) entity.getProperty("driverId");
          ArrayList<String> riderList = (ArrayList<String>) entity.getProperty("riderList");
          GeoPt start = (GeoPt) entity.getProperty("start");
          GeoPt end = (GeoPt) entity.getProperty("end");
          String ridedate = (String) entity.getProperty("ridedate");
          String ridetime = (String) entity.getProperty("ridetime");
          String price = (String) entity.getProperty("price");
          String paymentMethod = (String) entity.getProperty("paymentMethod");

          Ride ride = new Ride(id, name, capacity, currentRiders, driverEmail, driverId, riderList, start, end, ridedate, ridetime, price, paymentMethod);
          allRides.add(ride);

          count++;
          if (count >= maxcount) {
            break;
          }
        }
      } catch (EntityNotFoundException e) {
      throw new Error("Mistake");
    } 
    } else {
       try{
        String userId = userService.getCurrentUser().getUserId();
        Entity profileEntity = datastore.get(KeyFactory.createKey("Profile", userId));

        ArrayList<String> iterableMyRides = (ArrayList<String>) profileEntity.getProperty("myRides");

        Filter containsFilter = new Query.FilterPredicate("id", Query.FilterOperator.IN, iterableMyRides);
        query = new Query("Ride").setFilter(containsFilter);

        PreparedQuery results = datastore.prepare(query);

        for (Entity entity : results.asIterable()) {
          long id = entity.getKey().getId();
          long capacity = (long) entity.getProperty("capacity");
          String name = (String) entity.getProperty("name");
          long currentRiders = (long) entity.getProperty("currentRiders");
          String driverEmail = (String) entity.getProperty("driverEmail");
          String driverId = (String) entity.getProperty("driverId");
          ArrayList<String> riderList = (ArrayList<String>) entity.getProperty("riderList");
          GeoPt start = (GeoPt) entity.getProperty("start");
          GeoPt end = (GeoPt) entity.getProperty("end");
          String ridedate = (String) entity.getProperty("ridedate");
          String ridetime = (String) entity.getProperty("ridetime");
          String price = (String) entity.getProperty("price");
          String paymentMethod = (String) entity.getProperty("paymentMethod");

          Ride ride = new Ride(id, name, capacity, currentRiders, driverEmail, driverId, riderList, start, end, ridedate, ridetime, price, paymentMethod);
          allRides.add(ride);
       }
       } catch (EntityNotFoundException e) {
      throw new Error("Entity not found updating myRides");
    } 
    }
      

    response.setContentType("application/json;");
    Gson gson = new Gson();
    String json = gson.toJson(allRides);
    response.getWriter().println(json);
  }

  // A simple HTTP handler to extract text input from submitted web form and respond that context back to the user.
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    UserService userService = UserServiceFactory.getUserService();

    String driverEmail = userService.getCurrentUser().getEmail();
    String driverId = userService.getCurrentUser().getUserId();
    
    //String name = request.getParameter("name");
    //long capacity = Long.parseLong(request.getParameter("capacity"));
    try{
      Entity rideEntity = datastore.get(KeyFactory.createKey("Profile", driverId));
      String name = (String) rideEntity.getProperty("name");
      long capacity = (long) rideEntity.getProperty("capacity");

      GeoPt start = new GeoPt(Float.parseFloat(request.getParameter("lat")), Float.parseFloat(request.getParameter("lng")));
      GeoPt end = new GeoPt(Float.parseFloat(request.getParameter("endlat")), Float.parseFloat(request.getParameter("endlng")));

      String ridedate = request.getParameter("ridedate");
      String ridetime = request.getParameter("ridetime");


      String price = request.getParameter("price");
      String paymentMethod = request.getParameter("paymentMethod");
      


      Entity entryEntity = new Entity("Ride");

      entryEntity.setProperty("name", name);
      entryEntity.setProperty("capacity", capacity);
      entryEntity.setProperty("currentRiders", 0);
      entryEntity.setProperty("driverEmail", driverEmail);
      entryEntity.setProperty("driverId", driverId);
      ArrayList<String> riderlist = new ArrayList<String>();
      riderlist.add("");
      entryEntity.setProperty("riderList", riderlist);
      entryEntity.setProperty("start", start);
      entryEntity.setProperty("end", end);
      entryEntity.setProperty("ridedate", ridedate);
      entryEntity.setProperty("ridetime", ridetime);
      entryEntity.setProperty("price", price);
      entryEntity.setProperty("paymentMethod", paymentMethod);
      
      datastore.put(entryEntity);

      response.sendRedirect("/index.html");

    } catch (EntityNotFoundException e) {
      throw new Error("Error: You need to edit account information before posting a ride");

    } 
    // ArrayList<Double> start = new ArrayList<Double>();
    // start.add(Double.parseDouble(request.getParameter("lat")));
    // start.add(Double.parseDouble(request.getParameter("lng")));
    // ArrayList<Double> end = new ArrayList<Double>();
    // end.add(Double.parseDouble(request.getParameter("endlat")));
    // end.add(Double.parseDouble(request.getParameter("endlng")));
    
  }
}
