const DB = require('../helpers/DB');
const { 
    DB_TABLES,
    DRINKS_SORT_OPTIONS
 } = require('../constants');

class Drink {
    static async create(data) {
        return await DB.create(DB_TABLES.DRINKS, data);
    };

    // static async get() {
    //     const drinks = await DB.getRecords(DB_TABLES.DRINKS);
    //     return drinks;
    // };

    static async get(queryFilters={}) {
        let str = `SELECT drinks.*, AVG(rating) as rating,
                       COUNT(rating) as num_ratings
                       FROM drinks
                       LEFT JOIN drink_ratings 
                       ON drink_id=id GROUP BY id`;
        let vars = [];
        if (!Object.keys(queryFilters).length) {
            const results = await DB.query(str, vars);
            return results.rows;
        } else {            
            if (queryFilters.sort) {
                validateSortOption(queryFilters.sort, DRINKS_SORT_OPTIONS);
                str += ` ORDER BY ${queryFilters.sort}`
            };

            if (queryFilters.asc === false) {
                str += ' DESC'
            };

            if (queryFilters.limit) {
                str = addPaginationToQuery(str, {page: queryFilters.page, limit: queryFilters.limit})
            }

            const results = await DB.query(str, vars);
            return results.rows;
        };        
    };

    static async getById(id, location=null) {
        try {
        const str = `SELECT drinks.*, AVG(rating) as rating,
        COUNT(rating) as num_ratings
        FROM drinks
        LEFT JOIN drink_ratings 
        ON drink_id=id WHERE drink_id=${id} GROUP BY id`;
        const vars = [];
        const drinkResult = await DB.query(str, vars);
        const drink = drinkResult.rows[0];
        const draughtResults = await DB.query(`
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
            GROUP BY id`, [location.city, location.state]);
        const places = draughtResults.rows;
        drink.places = places;
        return drink;
            } catch (e) {
                console.log(e);
            }
        //return await DB.getRecord(DB_TABLES.DRINKS, {id});
    };

    static async getByUntappdId(id) {
        const result = await DB.query('SELECT * FROM drinks WHERE untappd_id=$1', [id]);
        if(result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }

    static async update(id, data) {
        return await DB.updateRecord(DB_TABLES.DRINKS, data, {id});
    };

    static async delete(id) {
        await DB.deleteRecord(DB_TABLES.DRINKS, {id});
    };
};

function validateSortOption(entry, options) {
    if (!Object.values(options).includes(entry)) {
        throw new ExpressError('sort parameter is not a valid option', 400);
    }
}

function addPaginationToQuery(str, { page=1, limit }) {
    return str += ` OFFSET ${(page-1)*limit} LIMIT ${limit}`;
}

module.exports = Drink;