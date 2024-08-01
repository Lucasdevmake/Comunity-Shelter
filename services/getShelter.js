const Shelter = require("../models/shelter");
const connect = require("../database");

module.exports.getShelter = async(event) => {
    await connect();

    const shelters = await Shelter.find();

    const sheltersOver = shelters.filter(shelter => {
        const capacityPercent = shelter.ocuppancy/shelter.capacity;
        return capacityPercent >= 0.9;
    });

    return {
        statusCode: 200,
        body: JSON.stringify(sheltersOver)
    }
};
