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

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;


/** Servlet responsible for deleting tasks. */
@WebServlet("/leaveride")
public class LeaveRideServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long id = Long.parseLong(request.getParameter("id"));
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    UserService userService = UserServiceFactory.getUserService();

    try {
      Key rideEntityKey = KeyFactory.createKey("Ride", id);
      Entity rideEntity = datastore.get(rideEntityKey);
      String riderId = userService.getCurrentUser().getUserId();
      Key profileEntityKey = KeyFactory.createKey("Profile", riderId);
      Entity profileEntity = datastore.get(profileEntityKey);

      if (!rideEntity.getProperty("riderList").equals(null)) {
        long newCapacity = (long) rideEntity.getProperty("currentRiders") - 1;
        ArrayList<String> newRiderList = (ArrayList<String>) rideEntity.getProperty("riderList");
        newRiderList.remove(riderId);
        rideEntity.setProperty("currentRiders", newCapacity);
        rideEntity.setProperty("riderList", newRiderList);
        datastore.put(rideEntity);
        ArrayList<Long> newMyRides = (ArrayList<Long>) profileEntity.getProperty("myRides");
        newMyRides.remove(id);
        profileEntity.setProperty("myRides", newMyRides);
        datastore.put(profileEntity);
        response.sendRedirect("/index.html");
      } else {
        response.sendRedirect("/index.html");
      }
    } catch (EntityNotFoundException e) {

    } 
  }
}