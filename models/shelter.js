const mongoose = require("mongoose");

const ShelterSchema = new mongoose.Schema({
    _id: String,
    name: String,
    streetAdress: String,
    capacity: Number,
    email: String,
    occupancy: {
        type: Number,
        default: 0
    }
});

ShelterSchema.methods.calculateOcuppancyRate = function() {
    return (this.occupancy / this.capacity) * 100;
}

const Shelter = mongoose.model("Shelter", ShelterSchema);

module.exports = Shelter;
