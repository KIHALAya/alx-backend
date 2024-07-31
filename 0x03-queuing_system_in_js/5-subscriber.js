import { createClient } from 'redis';

// Create Redis client
const client = createClient();

client.on('ready', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Subscribe to the channel
client.subscribe('holberton school channel');

// Handle messages received from the channel
client.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    client.unsubscribe('holberton school channel');
    client.quit();
  }
});

// Connect to Redis server
client.connect().catch(err => {
  console.error(`Error connecting to Redis: ${err.message}`);
});

