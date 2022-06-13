# Whats On tApp?
## An online resource for finding and rating beer
[Hosted here on Heroku](https://whats-on-tapp.herokuapp.com)

What's on tApp is an app that let's search bars and restaurants (Places) to see what is currently on draught, as well as searching for 
products (Drinks) to see which bar/restaurants are currently offering them.  Places and Drinks can be rated from one to five stars by
each user.  Each place has the option to display the location in a Google Map.  If a user owns a restaurant, they can create the draught 
list by searching the Untappd API for existing beverages.  The frontend is a React/Redux app and the back end is an express/postgress app.

To install:
```console
npm install && cd client && npm install
```

## FEATURES


## TESTING

The backend API has many tests for database CRUD as well as all routes for accessing data.  The tests use the Jest Testing Library.
To run tests, from the root directory:
```console
jest --runInBand
```

## BACKEND

The backend is a Node application with an Express server and it uses a PostgreSQL database.

