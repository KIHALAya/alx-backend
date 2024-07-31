import kue from 'kue';

// Create Kue queue
const queue = kue.createQueue();

// Function to send notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs in the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

// Handle Redis connection events
queue.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

