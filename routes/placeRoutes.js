const express = require("express");
const router = express.Router();
const {
  userIsAuthenticated,
  checkForCorrectUserOrAdmin
} = require("../middleware/auth");
const { verifyOwnership } = require("../middleware/verify");
const schemaValidator = require("../helpers/schemaValidator");
const placeCreateSchema = require("../schemata/place/placeCreateSchema.json");
const placeUpdateSchema = require("../schemata/place/placeUpdateSchema.json");
const placeQuerySchema = require("../schemata/place/placeQuerySchema.json");
const drinkCreateSchema = require("../schemata/drink/drinkCreateSchema");
const Place = require("../models/Place");
const PlaceRating = require("../models/PlaceRating");
const { getLatLng } = require("../helpers/getLatLng");
const createDraught = require("../helpers/createDraught");
const Draught = require("../models/Draught");

router.get("/", userIsAuthenticated, async (req, res, next) => {
  try {
    req.query = setValuesToIntegerType(req.query);
    schemaValidator(req.query, placeQuerySchema);
    const places = await Place.get(req.query);
    return res.json({ places });
  } catch (e) {
    return next(e);
  }
});

router.get("/google", async (req, res, next) => {
  try {
    const { address, city, state, zip } = req.query;
    const addressData = { address, city, state, zip }; //req.body.data;
    return res.json(await getLatLng(addressData));
  } catch (e) {
    return next(e);
  }
});

router.get("/search", userIsAuthenticated, async (req, res, next) => {
  try {
    const { q, city, state } = req.query;
    const results = await Place.searchPlaces(q, city, state);
    return res.json({ results });
  } catch (e) {
    return next(e);
  }
});

router.get("/:id", userIsAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const place = await Place.getById(id);
    return res.json({ place });
  } catch (e) {
    return next(e);
  }
});

router.get("/:place_id/rating", userIsAuthenticated, (req, res, next) => {
  try {
    const { place_id } = req.params;
    const place_ratings = PlaceRating.getByPlaceId(place_id);
    return res.json({ place_ratings });
  } catch (e) {
    return next(e);
  }
});

router.post("/", checkForCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const placeData = req.body;
    schemaValidator(placeData, placeCreateSchema);
    const place = await Place.create(placeData);
    return res.status(201).json({ place });
  } catch (e) {
    return next(e);
  }
});

router.post(
  "/:place_id/draught/drink",
  verifyOwnership,
  async (req, res, next) => {
    try {
      const { place_id } = req.params;
      const { active, drink: drinkData } = req.body;
      schemaValidator(drinkData, drinkCreateSchema);
      const { drink, draught } = await createDraught(
        place_id,
        drinkData,
        active
      );
      return res.status(201).json({ drink, draught });
    } catch (e) {
      return next(e);
    }
  }
);

router.patch(
  "/:place_id/draught/drink/:drink_id",
  verifyOwnership,
  async (req, res, next) => {
    try {
      const { place_id, drink_id } = req.params;
      const { active } = req.body;
      const draught = await Draught.update(drink_id, place_id, active);
      return res.json({ draught });
    } catch (e) {
      return next(e);
    }
  }
);

router.patch("/:place_id", verifyOwnership, async (req, res, next) => {
  try {
    const placeData = req.body;
    const { place_id: id } = req.params;
    schemaValidator(placeData, placeUpdateSchema);
    const place = await Place.update(id, placeData);
    return res.json({ place });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", checkForCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Place.delete(id);
    return res.json({ message: "deleted" });
  } catch (e) {
    return next(e);
  }
});

router.delete(
  "/:place_id/draught/drink/:drink_id",
  verifyOwnership,
  async (req, res, next) => {
    try {
      const { place_id, drink_id } = req.params;
      await Draught.delete(drink_id, place_id);
      return res.json({ message: "deleted" });
    } catch (e) {
      return next(e);
    }
  }
);

function setValuesToIntegerType(obj) {
  if (obj.page) {
    obj.page = +obj.page;
  }

  if (obj.limit) {
    obj.limit = +obj.limit;
  }

  if (obj.asc) {
    if (+obj.asc === 0) {
      obj.asc = false;
    } else {
      obj.asc = true;
    }
  }
  return obj;
}

module.exports = router;
