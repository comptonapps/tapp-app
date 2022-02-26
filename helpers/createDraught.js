const Drink = require('../models/Drink');
const Draught = require('../models/Draught');
const DB = require('./DB');


async function createDraught(place_id, drinkData, active) {
    let drink = await Drink.getByUntappdId(drinkData.untappd_id);
    if (drink) {
        const draught = await Draught.create({place_id, drink_id: drink.id});
        return { drink, draught };
    } else {
        drink = await Drink.create(drinkData);
        const draught = await Draught.create({ drink_id: drink.id, place_id, active});
        return { drink, draught };
    };
};

module.exports = createDraught;