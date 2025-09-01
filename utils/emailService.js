const axios = require('axios');

const sendOtpEmail = async (email, otp) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("Brevo API key is missing in environment variables");
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  const payload = {
    sender: {
      name: "Bookit",
      email: senderEmail,
    },
    to: [
      {
        email,
      },
    ],
    subject: "Your OTP Code",
    htmlContent: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  };

  try {
    const res = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      }
    );
    console.info(`✅ OTP email sent to ${email}`);
    return res.data;
  } catch (err) {
    console.error("❌ Brevo API Email Error:", err.response?.data || err.message);
    throw new Error("Failed to send email via Brevo");
  }
};

module.exports = {
  sendOtpEmail,
};
