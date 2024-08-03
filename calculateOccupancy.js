function calculateOccupancyRate(shelter) {
    return (shelter.occupancy / shelter.capacity) * 100;
};

module.exports = {calculateOccupancyRate};
