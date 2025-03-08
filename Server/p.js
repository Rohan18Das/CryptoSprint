const nodemailer = require('nodemailer');

// Step 1: Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  auth: {
    user: 'soumyaranjannayak0140@gmail.com', // Your email address
    pass: 'zubwpyofpwufopwg', // Your email password or app password
  },
});

const mailOptions = {
  from: 'soumyaranjanayak0140@gmail.com', // Sender email
  to: 'soumyarlibrary@gmail.com', // Receiver email
  subject: 'Demo: Payment Successful - Wallet Top-up', // Subject of the email
  text: 'Dear user, your payment of ₹100 was successful. Your wallet balance has been updated.', // Email content
  html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f7f7f7;">
        <h2 style="color: #4CAF50;">Payment Successful - Wallet Top-up</h2>
        <p>Dear user,</p>
        <p>Your payment of <strong>₹100</strong> was successful. Your wallet balance has been updated.</p>
        <p>Thank you for using our services.</p>
        <p style="margin-top: 40px;">Best regards,<br>The App Team</p>
      </div>
    </div>
  `,
};

// Step 3: Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error occurred..........!', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
