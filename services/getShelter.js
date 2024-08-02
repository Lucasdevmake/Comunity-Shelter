const Shelter = require("../models/shelter");
const connect = require("../database");

module.exports.getShelter = async() => {
    await connect();

    const shelters = await Shelter.find();

    const sheltersOver = shelters.filter(shelter => {
        const capacityPercent = shelter.calculateOcuppancyRate();
        return capacityPercent >= 90;
    });

    return {
        statusCode: 200,
        body: JSON.stringify(sheltersOver)
    }
};
