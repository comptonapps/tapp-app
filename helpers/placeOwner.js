// The purpose of this function is to create a place record and relationship 'place_owner' record in the db.

const PlaceOwner = require('../models/PlaceOwner');
const Place = require('../models/Place');
const db = require('../db');
const { ExpressError } = require('../expressError');

async function placeAndOwner(placeData, user_id) {
    await db.query('BEGIN');
    try {
        const place = await Place.create(placeData);
        try {
            const place_owner = await PlaceOwner.createRelationship(user_id, place.id);
            await db.query('COMMIT');
            return [place, place_owner];
        } catch (e) {
            await db.query('ROLLBACK');
            throw new ExpressError("Error creating place and relationship", 500);
        }
    } catch(e) {
        throw new ExpressError("Error creating place record", 500);
    }
};

module.exports = placeAndOwner;