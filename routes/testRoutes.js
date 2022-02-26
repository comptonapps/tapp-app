const express = require('express');
const router = express.Router();
const db = require('../db');
const Drink = require('../models/Drink');

router.get('/', async (req, res, next) => {
    try {
        const location = { city, state } = req.params;
        const dataResponse = { user: 1 }
        //   SELECT user.*, json_agg(pr) from (SELECT * FROM place_ratings WHERE user_id=user.id) as place_ratings
        //const dbRes = await db.query('SELECT rating, row_to_json(place) AS place FROM (SELECT * FROM places) AS place LEFT JOIN place_ratings ON place_id=place.id WHERE user_id=1');
        const dbRes = await db.query(`
            SELECT id, username, first_name, last_name, email, city, state, zip, created_at, updated_at, 
            (SELECT json_agg(res) AS place_ratings from 
                (SELECT user_id, place_id, rating, 
                    (SELECT row_to_json(plc) AS place FROM 
                    (SELECT * FROM places WHERE places.id=place_id) AS plc) 
                    FROM place_ratings WHERE user_id=$1) as res) AS place_ratings,
                    (SELECT json_agg(dres) AS drink_ratings from 
                    (SELECT user_id, drink_id, rating, 
                        (SELECT row_to_json(drk) AS drink FROM 
                        (SELECT * FROM drinks WHERE drinks.id=drink_id) AS drk) 
                        FROM drink_ratings WHERE user_id=$1) as dres) AS drink_ratings 
                FROM users WHERE id=$1`, [1]);
        const place_ratings = dbRes.rows;
        dataResponse.place_ratings = dbRes.rows;
        return res.json({user: dbRes.rows[0]});
    } catch (e) {
        return next(e);
    }
});

router.get('/uid', async (req, res, next) => {
    try {
        const drink = await Drink.getByUntappdId(22222222222222);
        return res.json({drink});
    } catch(e) {
        return next(e);
    }
});

/* Which entities need sorting for search?  Drinks by name A-Z and by rating.  Places by location (city, state), name A-Z, rating.

What will the routes look like?

place?city=seattle&state=WA&page=2&limit=25&sort=name -OR- sort=rating&asc=false


WHAT DO WE HAVE TO VALIDATE HERE?

-We should validate that city is a string and state is a string with 2 characters.  Page and limit are integers.  
-sort is in an enum with possible sort options.  Asc is bool.

What would the router method look like? 

router.get('/', async (req, res, next) => {
    try {
        // 1. Get the req.query values
        const { sort, asc, page, limit, city, state } = req.query;

    } catch(e) {
        return next(e);
    }
});



asc is default true

sort by is default name

postgres command by rating: SELECT places.*, AVG(rating) avg_rating FROM places LEFT JOIN place_ratings ON id=place_id WHERE city='seattle' AND state='WA' GROUP BY id ORDER BY avg_rating





SELECT drinks.*, AVG(rating) FROM drinks LEFT JOIN drink_ratings ON id=drink_id GROUP BY id ORDER BY maker,name; 

enums:

const DB_TABLES {
    // we already have this
}

const SORT_TERMS {
    PLACES: {
        RATING: 'rating',
        NAME: 'name',
    },
    DRINKS: {
        NAME: 'name',
        RATING: 'rating'
    }
}

 SELECT row_to_json(place) AS place FROM (SELECT * FROM places WHERE id=4) AS place;

  SELECT rating, row_to_json(place) AS place FROM (SELECT * FROM places) AS place LEFT JOIN place_ratings ON place_id=place.id WHERE user_id=1;

  SELECT user.*, json_agg(pr) from (SELECT * FROM place_ratings WHERE user_id=user.id) as place_ratings

  What should be returned from a User.byId query?

  { user: {
      id: 1,
      username: 'compty',
      email: 'jcompton@gmail.com,
      city: 'Seattle',
      state: 'WA',
      place_ratings: {[{
          user_id: 1,
          rating: 4,
          place_id: 1,
          place: {
              name: Triangle Spirits,
              address: 123 Main St,
              city: 'Seattle',
              state: 'WA'
              zip: '98134'
          }
      },
    ]},
      drink_ratings: {[{
          user_id: 1,
          rating: 5,
          drink_id: 1,
          drink: {
              name: 'Pliny the Elder',
              maker: 'Russian River Brewing Co.'
          }
      }, {
          user_id: 
      }]

      }
  }}

  {user: {
      username: 'compty',
      email: 'compty@gmail.com',
      place_ratings: [
          {
            user_id: 1,
            rating: 5,
            place: {
                name: 'Triangle Spirits',
                address: '123 Main St.'
            }
          }, 
          {
            user_id: 1,
            rating: 4,
            place: {
                name: 'The Ballroom'
            }
          }],
      drink_ratings: [{},{}]
  }}

  SELECT place_ratings.*, (row_to_json(plc) FROM (SELECT * FROM places WHERE place_ratings.place_id=places.id) AS plc WHERE user_id=1;

  SELECT user_id, place_id, rating, row_to_json(plc) FROM (SELECT * FROM places WHERE places.id=place_id) AS plc FROM place_ratings WHERE user_id=1;
*/

module.exports = router;