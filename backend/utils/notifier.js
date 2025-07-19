const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Twilio client (if SMS alerts are enabled)
let twilioClient;
if (process.env.TWILIO_ENABLED === 'true') {
  twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send email alert
exports.sendEmailAlert = async ({ subject, message, to }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message
  };
  
  await transporter.sendMail(mailOptions);
};

// Send SMS alert
exports.sendSMSAlert = async ({ to, body }) => {
  if (twilioClient) {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE,
      to
    });
  }
};