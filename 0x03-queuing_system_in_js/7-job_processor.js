import kue from 'kue';

// Blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);
  
  if (blacklistedNumbers.includes(phoneNumber)) {
    const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
    done(new Error(errorMessage));
  } else {
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
  }
}

// Create Kue queue
const queue = kue.createQueue();

// Process jobs from the queue 'push_notification_code_2'
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Error handling
queue.on('error', (err) => {
  console.log(`Queue error: ${err.message}`);
});

