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

// Function to create a hash in Redis
function createHash() {
  const key = 'HolbertonSchools';
  const schools = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };

  for (const [field, value] of Object.entries(schools)) {
    client.hset(key, field, value, redis.print);
  }
}

// Function to display the hash from Redis
function displayHash() {
  const key = 'HolbertonSchools';
  client.hgetall(key, (err, obj) => {
    if (err) {
      console.error(`Error getting hash from Redis: ${err.message}`);
    } else {
      console.log(obj);
    }
  });
}

// Create and display the hash
createHash();
displayHash();

