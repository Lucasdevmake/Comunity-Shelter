const {calculateOccupancyRate} = require('./calculateOccupancy');

const resourcePoints = {
	doctor: 4,
	volunteer: 3,
	supplyKit: 7,
	transport: 5,
	basicBasket: 2
};

function isExchangeValid(receiverShelter, receiver, giver) {
	const receiverResources = Object.keys(receiver);
	const giverResources = Object.keys(giver);
	console.log(receiverResources);
	console.log(giverResources);

	let receiverPoints = 0;
	receiverResources.forEach(resource => {
		receiverPoints += resourcePoints[resource] * receiver[resource];
	});

	let giverPoints = 0;
	giverResources.forEach(resource => {
		giverPoints += resourcePoints[resource] * giver[resource];
	});
	console.log({
		receiverPoints, 
		giverPoints
	});
	const receiverShelterOccupation = calculateOccupancyRate(receiverShelter);
	if (receiverPoints !== giverPoints && receiverShelterOccupation < 90) {
		return false;
	}

	return true;
}

module.exports = {isExchangeValid};
