const Shelter = require("../models/shelter");
const connect = require("../database");
const uuid = require("uuid");
const yup = require("yup");

module.exports.createShelter = async(event) => {
    const body = JSON.parse(event.body);
    const valid = await validateBody(body);

    if (!valid) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Invalid Request"})
        }
    }

    const shelter = {
        _id: uuid.v4(),
        name: body.name,
        email: body.email,
        streetAdress: body.streetAdress,
        capacity: body.capacity,
        resource: body.resource
    };

    await connect();

    await Shelter.create(shelter);

    return {
        statusCode: 201,
        body: JSON.stringify(shelter)
    }
};

async function validateBody(body) {
    try {
        const schema = yup.object().shape({
            name: yup.string().required(),
            streetAdress: yup.string().required(),
            capacity: yup.number().required().positive().integer(),
            email: yup.string().email().required(),
            resource: yup.object().shape({
                doctor: yup.number().required().positive().integer(),
                volunteer: yup.number().required().positive().integer(),
                supplyKit: yup.number().required().positive().integer(),
                basicBasket: yup.number().required().positive().integer(),
                transport: yup.number().required().positive().integer()
            })
        })

        await schema.validate(body);
        return true;

    } catch(error) {
        console.log(error);
        return false;
    }
};
