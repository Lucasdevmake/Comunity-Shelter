const Shelter = require("../models/shelter");
const connect = require("../database");

module.exports.updateOcuppancy = async(event) => {
    const body = JSON.parse(event.body);
    const{ ocuppancy } = JSON.parse(event.body);
    const{ comunityShelterId } = event.pathParameters;

    await connect(); // _applicationDbContext

    const shelter = await Shelter.findById(comunityShelterId);

    if (shelter === null) {
        return {
            body: JSON.stringify({message: "Shelter Not Found"}),
            statusCode: 404
        }
    }

    if (!isValidCapacity(shelter, ocuppancy)) {
        return {
            body: JSON.stringify({message: "Shelter capacity is over"}),
            statusCode: 400
        }
    }

    await Shelter.updateOne(
    {
        _id: comunityShelterId
    },
    {
        $inc: { ocuppancy: ocuppancy }
    });

    return {
        statusCode: 204 //no content
    }
};

function isValidCapacity(shelter, ocuppancy) {
    const shelterOcuppancy = shelter.ocuppancy + ocuppancy;
    return shelterOcuppancy <= shelter.capacity;
};
