const Shelter = require("../models/shelter");
const connect = require("../database");

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

    if (shelter.calculateOccupancyRate() === 100) {
        // retorno de mensagem kafka
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
