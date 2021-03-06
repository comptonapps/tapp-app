const CONSTANTS = {
  SERVER_PORT: 3003,
  DB_TABLES: {
    USERS: "users",
    DRINKS: "drinks",
    PLACES: "places",
    DRAUGHTS: "draughts",
    PLACE_RATINGS: "place_ratings",
    DRINK_RATINGS: "drink_ratings",
    PLACE_OWNERS: "place_owners"
  },
  BCRYPT_WORK_FACTOR: +process.env.BCRYPT_WORK_FACTOR,
  PLACES_SORT_OPTIONS: {
    NAME: "name",
    RATING: "rating"
  },
  DRINKS_SORT_OPTIONS: {
    NAME: "name",
    RATING: "rating"
  }
};

module.exports = CONSTANTS;
