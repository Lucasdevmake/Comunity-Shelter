const Shelter = require("../models/shelter");
const connect = require("../database");
const yup = require("yup");
const {isExchangeValid} = require("../validateExchange");

module.exports.exchangeResource = async(event) => {
    const body = JSON.parse(event.body);

    const validate = await validateExchange(body);

    if (!validate) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid Request"
            })
        }
    }

    await connect();
    const idReceiver = body.receiver.communityShelterId;
    const idGiver = body.giver.communityShelterId;
    const receiverShelter = await Shelter.findById(idReceiver);
    
    if (!isExchangeValid(receiverShelter, body.receiver.resource, body.giver.resource)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Exchange was not possible"
            })
        }
    }

    const giverShelter = await Shelter.findById(idGiver);

    const receiverResources = Object.keys(body.receiver.resource);
	const giverResources = Object.keys(body.giver.resource);

    console.log(receiverResources);
    console.log(giverResources);

    receiverResources.forEach(resource => {
		receiverShelter.resource[resource] -= body.receiver.resource[resource];
		giverShelter.resource[resource] += body.receiver.resource[resource];
	});

	giverResources.forEach(resource => {
		giverShelter.resource[resource] -= body.giver.resource[resource];
		receiverShelter.resource[resource] += body.giver.resource[resource];
	});

    console.log(receiverShelter);
    console.log(giverShelter);
    await Shelter.updateOne(
    {
        _id: idReceiver
    },
    {
        $set: {
            resource: receiverShelter.resource
        }
    });

    await Shelter.updateOne(
    {
        _id: idGiver
    },
    {
        $set: {
            resource: giverShelter.resource
        }
    });

    return {
        statusCode: 204
    }
};

async function validateExchange(body) {
    try {
        const bodySchema = yup.object().shape({
            communityShelterId: yup.string().uuid().required(),
            resource: yup.object().shape({
                doctor: yup.number().positive().integer(),
                volunteer: yup.number().positive().integer(),
                supplyKit: yup.number().positive().integer(),
                basicBasket: yup.number().positive().integer(),
                transport: yup.number().positive().integer()
            })
        })

        const schema = yup.object().shape({
            receiver: bodySchema,
            giver: bodySchema
        });

        await schema.validate(body);
        return true;

    } catch(error) {
        console.log(error);
        return false;
    }
};
