const mongoose = require("mongoose");

const ShelterSchema = new mongoose.Schema({
    _id: String,
    name: String,
    streetAdress: String,
    capacity: Number
});

const Shelter = mongoose.model("Shelter", ShelterSchema);

module.exports = Shelter;
