import { createClient } from 'redis';

// Create Redis client
const client = createClient();

client.on('ready', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Connect to Redis server
client.connect().catch(err => {
  console.error(`Error connecting to Redis: ${err.message}`);
});

// Function to set a new value in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(`Reply: ${reply}`);
    }
  });
}

// Function to display a value from Redis
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error(`Error getting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(reply);
    }
  });
}
