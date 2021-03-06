const DB = require("../helpers/DB");
const { DB_TABLES, DRINKS_SORT_OPTIONS } = require("../constants");
const { RecordNotFoundError } = require("../expressError");

class Drink {
  static async create(data) {
    return await DB.create(DB_TABLES.DRINKS, data);
  }

  // static async get() {
  //     const drinks = await DB.getRecords(DB_TABLES.DRINKS);
  //     return drinks;
  // };

  static async get(queryFilters = {}) {
    let str = `SELECT drinks.*, AVG(rating) as rating,
                       COUNT(rating) as num_ratings
                       FROM drinks
                       LEFT JOIN drink_ratings 
                       ON drink_id=id GROUP BY id`;
    let vars = [];
    if (!Object.keys(queryFilters).length) {
      str += " ORDER BY drinks.id";
      const results = await DB.query(str, vars);
      return results.rows;
    } else {
      if (queryFilters.sort) {
        validateSortOption(queryFilters.sort, DRINKS_SORT_OPTIONS);
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

  static async getById(id, location = null) {
    const str = `SELECT drinks.*, (SELECT AVG(rating) FROM drink_ratings WHERE drink_id=${id}) as rating,
        (SELECT COUNT(rating) FROM drink_ratings WHERE drink_id=${id}) as num_ratings
        FROM drinks
        WHERE id=${id}`;
    const vars = [];
    const drinkResult = await DB.query(str, vars);
    if (drinkResult.rows.length === 0) {
      throw new RecordNotFoundError();
    }
    const drink = drinkResult.rows[0];
    if (location) {
      const draughtResults = await DB.query(
        `
              SELECT places.*, AVG(rating) as rating, COUNT(rating) as num_ratings FROM places 
              LEFT JOIN place_ratings 
              ON place_ratings.place_id=id 
              LEFT JOIN draughts 
              ON draughts.place_id=id 
              AND drink_id=${id} 
              AND active=true 
              WHERE draughts.place_id 
              IN (SELECT id FROM places 
                  WHERE city ILIKE '%' || $1 || '%' 
                  AND state ILIKE '%' || $2 || '%') 
              GROUP BY id`,
        [location.city, location.state]
      );
      const places = draughtResults.rows;
      drink.places = places;
    }
    return drink;

    //return await DB.getRecord(DB_TABLES.DRINKS, {id});
  }

  static async getByUntappdId(id) {
    const result = await DB.query("SELECT * FROM drinks WHERE untappd_id=$1", [
      id
    ]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  static async searchDrinks(query) {
    let queryString = `SELECT drinks.*, AVG(rating) as rating,
        COUNT(rating) as num_ratings
        FROM drinks
        LEFT JOIN drink_ratings 
        ON drink_id=id`;
    let values = [];
    if (query !== "") {
      queryString += " WHERE ";
      const queryTokens = query.split(" ");
      const variableString = queryTokens
        .map(
          (t, i) =>
            `(name ILIKE '%' || $${i + 1} || '%' OR maker ILIKE '%' || $${i +
              1} || '%')`
        )
        .join(" AND ");
      queryString += variableString;
      values = queryTokens;
    }
    queryString += "  GROUP BY id";
    const result = await DB.query(queryString, values);
    return result.rows;
  }

  static async update(id, data) {
    return await DB.updateRecord(DB_TABLES.DRINKS, data, { id });
  }

  static async delete(id) {
    await DB.deleteRecord(DB_TABLES.DRINKS, { id });
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

module.exports = Drink;
