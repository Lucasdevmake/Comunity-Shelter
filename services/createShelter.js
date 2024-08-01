const Shelter = require("../models/shelter");
const connect = require("../database");
const uuid = require("uuid");

module.exports.createShelter = async(event) => {
    const body = JSON.parse(event.body);
    const shelter = {
        _id: uuid.v4(),
        name: body.name,
        streetAdress: body.streetAdress,
        capacity: body.capacity
    };

    await connect.connect();

    await Shelter.create(shelter);

    return {
        statusCode: 201,
        body: JSON.stringify(shelter)
    }
};
