const { Kafka } = require('kafkajs');

async function notifyComunityShelter({comunityShelterId, name, email}) {
    try {
        const kafka = new Kafka({
            clientId: 'comunity_shelter',
            brokers: ['localhost:9092'],
        });
    
        const producer = kafka.producer({allowAutoTopicCreation: true});
        await producer.connect();
    
        await producer.send({
            topic: 'comunity_shelter_full_capacity',
            messages: [
              { value: JSON.stringify({comunityShelterId, name, email}) },
            ],
        })
    
        await producer.disconnect();
    } catch (error) {
        console.log("Fail", error);
    }
};

module.exports = {notifyComunityShelter};

