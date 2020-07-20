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
@WebServlet("/ratedriver")
public class RateDriverServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String driverId = request.getParameter("driverId").trim();
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    UserService userService = UserServiceFactory.getUserService();
    String currentUserId = userService.getCurrentUser().getUserId();

    try {
      Key profileEntityKey = KeyFactory.createKey("Profile", driverId);
      Entity profileEntity = datastore.get(profileEntityKey);
      
      ArrayList<String> usersRated = (ArrayList<String>) profileEntity.getProperty("usersRated");
      ArrayList<String> reviews = (ArrayList<String>) profileEntity.getProperty("reviews");
      if (usersRated.contains(currentUserId)) {
        throw new Error("You can only rate a single driver once");
      } else{
        double rating = (double) profileEntity.getProperty("rating");
        long numratings = (long) profileEntity.getProperty("numratings");

        long newnumratings = numratings + 1;
        double newrating = (Double.parseDouble(request.getParameter("rating")) + (rating * numratings)) / newnumratings;

        // if there is no review, don't add it
        if (!request.getParameter("review").equals(null) && !request.getParameter("review").equals("")) {
          reviews.add(request.getParameter("review"));
        }

        profileEntity.setProperty("rating", newrating);
        profileEntity.setProperty("numratings", newnumratings);
        profileEntity.setProperty("reviews", reviews);
        usersRated.add(currentUserId);
        profileEntity.setProperty("usersRated", usersRated);
        datastore.put(profileEntity);
        response.sendRedirect("/index.html");
      }

    } catch (EntityNotFoundException e) {
      System.out.println("ERROR");
    } 
  }
}