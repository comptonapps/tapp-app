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

Next, install Postgres on your machine and create and seed a database.  From the project root directory in the terminal:
```console
psql < data.sql
```
This will create a postgress database called wat_db

Start the app!
```console
npm run start:all
```

## FEATURES
- Google Geolocation API
  - Used on the server to give a latitude and longitude value to Place records.  This is used in the client app for map display.
- Google Autocomplete API
  - For city and state user input.  Gives consistent data and is a better user experience.
- Google Maps API
  - Uses latitude and longitude coordinates from a Place record to display a map for the user.
- Untappd API
  - The source of truth for creating draught objects for places.  Prevents duplicate records in the database.
- react-star-ratings Node package
  - A well built package for displaying interactive star ratings.  These are used for places and drinks in the app.
- Toastify
  - A node package for displaying pop up messages for the user.

## USER FLOW
1.  Login/Register for an account.  
2.  Authentication redirects the user to the dashboard, where they can view Places Rated, Drinks Rated, and Places Owned.  Each cell within the categories is a link which will take the user to the place or drink.  If the user owns the place that is clicked, they will have the option to click a link to edit the place data/draught list.
3.  The nav bar gives the user 4 options:  Places, Drinks, Dash (dashboard), and Logout.  Places will display a list of places in the city which was specified upon signup.  The user can change their preferred location from the Places page and this data will be stored in redux and localStorage for future visits.  Places displayed are always location specific.  Selecting a place will take the user to the place page, where they can view a map, rate the place, and view the current draught list.  Drinks will display all drinks in the database.  If a drink is selected, the user is taken to the drink page, where they can rate the drink and a list of location specific places is displayed for the user to browse.  Selecting a place will take them to the place page.  Logout will take the user to the logout page.


## TESTING

The backend API has many tests for database CRUD as well as all routes for accessing data.  The tests use the Jest Testing Library.
To run tests, from the root directory:
```console
jest --runInBand
```

## BACKEND

The backend is a Node application with an Express server and it uses a PostgreSQL database.

[API docs here:]('https://wat-api-docs.herokuapp.com')

## Contributors

Jonathan Compton - github.com/comptonapps

