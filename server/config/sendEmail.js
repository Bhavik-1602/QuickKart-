import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.log("Provide MAIL_USER and MAIL_PASS inside the .env file");
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'hotmail', 'yahoo', or a custom SMTP
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Email sending function
const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.MAIL_USER}>`,
      to: sendTo,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
