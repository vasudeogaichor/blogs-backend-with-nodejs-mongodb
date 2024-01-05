// worker.js
const emailQueue = require('./queues');
const sendWelcomeEmail = require('./scripts/sendWelcomeMail');

emailQueue.process('sendWelcomeEmail', async (job) => {
  const { user } = job.data;

  try {
    // Use the function to send the welcome email
    await sendWelcomeEmail(user);

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Handle email sending error (e.g., log it, but don't propagate it)
  }
});
