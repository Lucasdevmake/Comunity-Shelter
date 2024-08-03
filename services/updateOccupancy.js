const Shelter = require("../models/shelter.js");
const connect = require("../database.js");
const { notifyComunityShelter } = require("../producer.js");
const { calculateOccupancyRate } = require("../calculateOccupancy.js");

module.exports.updateOccupancy = async(event) => {
    const{comunityShelterId} = event.pathParameters;
    const{occupancy} = JSON.parse(event.body);

    if (occupancy < 0) {
        return {
            body: JSON.stringify({message: "Occupancy quantity is not valid"}),
            statusCode: 400
        }
    }

    await connect();

    const shelter = await Shelter.findById(comunityShelterId);

    if (shelter === null) {
        return {
            body: JSON.stringify({message: "Shelter Not Found"}),
            statusCode: 404
        }
    }

    if (!isValidCapacity(shelter, occupancy)) {
        return {
            body: JSON.stringify({message: "Shelter capacity is over"}),
            statusCode: 400
        }
    }

    shelter.occupancy += occupancy; //incremento de ocupação do shelter

    if (calculateOccupancyRate(shelter) === 100) {
        console.log("Enviando notificação de abrigo cheio");
        await notifyComunityShelter(
        {
            comunityShelterId: shelter._id,
            name: shelter.name,
            email: shelter.email
        });
    }

    await Shelter.updateOne(
    {
        _id: comunityShelterId
    },
    {
        $set: {
            occupancy: shelter.occupancy
        }
    });

    return {
        statusCode: 204 //no content
    }
};

function isValidCapacity(shelter, occupancy) {
    const shelterOccupancy = shelter.occupancy + occupancy;
    return shelterOccupancy <= shelter.capacity;
};
