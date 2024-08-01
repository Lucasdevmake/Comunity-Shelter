const mongoose = require("mongoose");

const ShelterSchema = new mongoose.Schema({
    _id: String,
    name: String,
    streetAdress: String,
    capacity: Number,
    email: String,
    ocuppancy: {
        type: Number,
        default: 0
    }
});

const Shelter = mongoose.model("Shelter", ShelterSchema);

module.exports = Shelter;
