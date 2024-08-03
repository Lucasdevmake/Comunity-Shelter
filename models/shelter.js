const { ResourcePatternTypes } = require("kafkajs");
const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
    doctor: {
        type: Number,
        required: true,
    },
    volunteer: {
        type: Number,
        required: true,
    },
    supplyKit: {
        type: Number,
        required: true,
    },
    basicBasket: {
        type: Number,
        required: true,
    },
    transport: {
        type: Number,
        required: true,
    }
});

const ShelterSchema = new mongoose.Schema({
    _id: String,
    name: String,
    streetAdress: String,
    capacity: Number,
    email: String,
    occupancy: {
        type: Number,
        default: 0
    },
    resource: {
        type: ResourceSchema,
        required: true
    }
});

const Shelter = mongoose.model("Shelter", ShelterSchema);

module.exports = Shelter;
