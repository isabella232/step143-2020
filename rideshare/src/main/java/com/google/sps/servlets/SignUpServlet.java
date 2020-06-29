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
@WebServlet("/signup")
public class SignUpServlet extends HttpServlet {

  /** Data holder for each individual Profile */
  public class Profile {
    public long id;
    public String name;
    public long capacity;
    
    public Profile(long id, String name, long capacity) {
      this.id = id;
      this.name = name;
      this.capacity = capacity;
    }

    public String getName() {
      return name;
    }
    
    public long getCapacity() {
      return capacity;
    }

  }

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  // A simple HTTP handler to extract text input from submitted web form and respond that context back to the user.
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    
    String name = request.getParameter("firstName");
    long capacity = Long.parseLong(request.getParameter("capacity"));

    Entity entryEntity = new Entity("Profile");
    entryEntity.setProperty("name", name);
    entryEntity.setProperty("capacity", capacity);
    datastore.put(entryEntity);

    response.sendRedirect("/index.html");
    
  }
}
