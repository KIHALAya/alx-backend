import kue from 'kue';

// Create Kue queue
const queue = kue.createQueue();

// Job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a test message',
};

// Create a job in the queue named 'push_notification_code'
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    } else {
      console.error(`Failed to create job: ${err.message}`);
    }
  });

// Handle job completion
job.on('complete', () => {
  console.log('Notification job completed');
});

// Handle job failure
job.on('failed', () => {
  console.log('Notification job failed');
});

