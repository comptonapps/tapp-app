const DB = require("../helpers/DB");
const { DB_TABLES, BCRYPT_WORK_FACTOR } = require("../constants");
const bcrypt = require("bcrypt");

class User {
  static async create(data) {
    const password = await bcrypt.hash(data.password, +BCRYPT_WORK_FACTOR);
    const user = await DB.create(DB_TABLES.USERS, { ...data, password });
    delete user.password;
    return user;
  }

  static async get() {
    return await DB.getRecords(DB_TABLES.USERS);
  }

  static async getById(id) {
    return await DB.getRecord(DB_TABLES.USERS, { id });
  }

  static async queryById(id) {
    // return await DB.query(`
    // SELECT id, username, first_name, last_name, email, city, state, zip, is_admin, created_at, updated_at,
    // (SELECT json_agg(res) AS place_ratings from
    //     (SELECT user_id, place_id, rating,
    //         (SELECT row_to_json(plc) AS place FROM
    //         (SELECT * FROM places WHERE places.id=place_id) AS plc)
    //         FROM place_ratings WHERE user_id=$1) as res),
    //         (SELECT json_agg(dres) AS drink_ratings from
    //         (SELECT user_id, drink_id, rating,
    //             (SELECT row_to_json(drk) AS drink FROM
    //             (SELECT * FROM drinks WHERE drinks.id=drink_id) AS drk)
    //             FROM drink_ratings WHERE user_id=$1) as dres),
    //             (SELECT json_agg(ores) AS places_owned FROM
    //             (SELECT user_id, place_id,
    //                 (SELECT row_to_json(pl) AS place FROM
    //                 (SELECT * FROM places WHERE places.id=place_id) AS pl)
    //                 FROM place_owners WHERE user_id=$1) as ores)
    //     FROM users WHERE id=$1`, [id]);

    return await DB.query(
      `
        SELECT id, username, first_name, last_name, email, city, state, zip, is_admin, created_at, updated_at,
        (SELECT json_agg(res) AS place_ratings from 
            (SELECT user_id, place_id, rating, 
                (SELECT row_to_json(plc) AS place FROM 
                (SELECT * FROM places WHERE places.id=place_id) AS plc) 
                FROM place_ratings WHERE user_id=$1) as res),
                (SELECT json_agg(dres) AS drink_ratings from 
                (SELECT user_id, drink_id, rating, 
                    (SELECT row_to_json(drk) AS drink FROM 
                    (SELECT * FROM drinks WHERE drinks.id=drink_id) AS drk) 
                    FROM drink_ratings WHERE user_id=$1) as dres),
                    (SELECT json_agg(ores) AS places_owned FROM 
                    (SELECT user_id, place_owners.place_id AS place_id, 
                        (SELECT row_to_json(pl) AS place FROM 
                        (SELECT places.*, AVG(place_ratings.rating) AS rating, COUNT(place_ratings.rating) AS num_ratings 
                            FROM places 
                            LEFT JOIN place_ratings 
                            ON places.id=place_ratings.place_id 
                            WHERE places.id=place_owners.place_id 
                            GROUP BY places.id) AS pl) 
                        FROM place_owners WHERE user_id=$1) as ores)
            FROM users WHERE id=$1`,
      [id]
    );
  }

  static async update(id, data) {
    return DB.updateRecord(DB_TABLES.USERS, data, { id });
  }

  static async delete(id) {
    await DB.deleteRecord(DB_TABLES.USERS, { id });
  }

  static async searchUsers(str) {
    const searchTokens = str.split(" ");
    const initialResult = await DB;
  }
}

module.exports = User;
