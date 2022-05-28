const express = require('express');
const router = express.Router();
const { 
    userIsAuthenticated,
    checkForCorrectUserOrAdmin 
} = require('../middleware/auth');
const drinkQuerySchema = require('../schemata/drink/drinkQuerySchema.json');
const drinkCreateSchema = require('../schemata/drink/drinkCreateSchema.json');
const drinkUpdateSchema = require('../schemata/drink/drinkUpdateSchema.json');
const schemaValidator = require('../helpers/schemaValidator');
const Drink = require('../models/Drink');
const DrinkRatings = require('../models/DrinkRating');
const getData = require('../helpers/untappd');

router.get('/', userIsAuthenticated, async (req, res, next) => {
    try {
        req.query = unstringValues(req.query);
        schemaValidator(req.query, drinkQuerySchema);
        const drinks = await Drink.get(req.query);
        return res.json({drinks});
    } catch(e) {
        return next(e);
    }
});

router.get('/untappd', async (req, res, next) => {
    try {
        const results = await getData(req.query);
        return res.json({results});
    } catch(e) {
        return next(e);
    }
});

router.get('/search', async (req,res,next) => {
    const { q } = req.query;
    const decodedQuery = decodeURIComponent(q);
    const drinks = await Drink.searchDrinks(decodedQuery);
    return res.json({drinks});
});

router.get('/:id', userIsAuthenticated, async (req, res, next) => {
    try {
        const { city, state } = req.query;
        const location = { city, state };
        const { id } = req.params;
        const drink = await Drink.getById(id, location);
        return res.json({drink});
    } catch(e) {
        return next(e);
    }
});

router.get('/:drink_id/rating', userIsAuthenticated, async (req, res, next) => {
    try {
        const { drink_id } = req.params;
        const drink_ratings = DrinkRatings.getByDrinkId({ drink_id });
        return res.json({drink_ratings});
    } catch(e) {
        return next(e);
    }
});

router.post('/', checkForCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const drinkData = req.body;
        schemaValidator(drinkData, drinkCreateSchema);
        const drink = await Drink.create(drinkData);
        return res.status(201).json({drink});
    } catch(e) {
        return next(e);
    }
});

router.patch('/:id', checkForCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const drinkData = req.body;
        schemaValidator(drinkData, drinkUpdateSchema);
        const drink = await Drink.update(id, drinkData);
        return res.json({drink});
    } catch(e) {
        return next(e);
    }
});

router.delete('/:id', checkForCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        await Drink.delete(id);
        return res.json({message: "deleted"});
    } catch(e) {
        return next(e);
    }
});

function unstringValues(obj) {
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