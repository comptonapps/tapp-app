const { DB_TABLES, PLACES_SORT_OPTIONS } = require("../constants");
const DB = require("../helpers/DB");
const { ExpressError } = require("../expressError");

class Place {
  static async create(data) {
    return await DB.create(DB_TABLES.PLACES, data);
  }

  static async get(queryFilters = null) {
    let str = `SELECT places.*, AVG(rating) as rating,
                       COUNT(rating) as num_ratings
                       FROM places
                       LEFT JOIN place_ratings 
                       ON place_id=id`;
    let vars = [];
    if (!Object.keys(queryFilters).length) {
      str += " GROUP BY id";
      const results = await DB.query(str, vars);
      return results.rows;
    } else {
      if (queryFilters.city || queryFilters.state) {
        [str, vars] = this.addLocationToQuery(str, vars, queryFilters);
      }

      str += " GROUP BY id";
      if (queryFilters.sort) {
        validateSortOption(queryFilters.sort, PLACES_SORT_OPTIONS);
        str += ` ORDER BY ${queryFilters.sort}`;
      }

      if (queryFilters.asc === false) {
        str += " DESC";
      }

      if (queryFilters.limit) {
        str = addPaginationToQuery(str, {
          page: queryFilters.page,
          limit: queryFilters.limit
        });
      }

      const results = await DB.query(str, vars);
      return results.rows;
    }
  }

  static async getById(id) {
    let str = `SELECT places.*, AVG(rating) as rating,
                       COUNT(rating) as num_ratings
                       FROM places
                       LEFT JOIN place_ratings 
                       ON place_id=id WHERE id=${id}
                       GROUP BY id`;
    let vars = [];
    const placeResults = await DB.query(str, vars);
    const place = placeResults.rows[0];
    console.log(place);
    const draughtResults = await DB.query(`
            SELECT drinks.*, AVG(rating) as rating,
            COUNT(rating) as num_ratings
            FROM drinks
            LEFT JOIN drink_ratings 
            ON drink_ratings.drink_id=drinks.id 
            LEFT JOIN draughts
            ON draughts.drink_id=drinks.id
            AND active=true
            WHERE draughts.place_id=${+id}
            GROUP BY drinks.id`);
    console.log(draughtResults.rows);
    place.drinks = draughtResults.rows;
    return place;
    //return await DB.getRecord(DB_TABLES.PLACES, { id });
  }

  static async queryById(place_id) {
    const result = await DB.query(
      `
            SELECT places.*, 
            (SELECT json_agg(res ORDER BY res.active=true DESC, res.drink::json->>'maker', res.drink::json->>'name') AS draughts
                FROM (SELECT place_id, drink_id, active, 
                    (SELECT row_to_json(drk) AS drink FROM 
                    (SELECT * FROM drinks WHERE drinks.id=draughts.drink_id) AS drk)
                    FROM draughts WHERE place_id=$1) AS res) 
                FROM places 
                WHERE places.id=$1`,
      [place_id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    return await DB.updateRecord(DB_TABLES.PLACES, data, { id });
  }

  static async delete(id) {
    await DB.deleteRecord(DB_TABLES.PLACES, { id });
  }

  static addLocationToQuery(str, vars, obj) {
    const { city, state } = obj;
    const location = {};
    if (city) {
      location.city = city;
    }
    if (state) {
      location.state = state;
    }
    str += ` WHERE `;
    str += Object.keys(location)
      .map(k => {
        if (location[k]) {
          vars.push(location[k]);
          return `${k} ILIKE '%' || $${vars.length} || '%'`;
        }
      })
      .join(" AND ");
    return [str, vars];
  }
}

function validateSortOption(entry, options) {
  if (!Object.values(options).includes(entry)) {
    throw new ExpressError("sort parameter is not a valid option", 400);
  }
}

function addPaginationToQuery(str, { page = 1, limit }) {
  return (str += ` OFFSET ${(page - 1) * limit} LIMIT ${limit}`);
}

module.exports = Place;
