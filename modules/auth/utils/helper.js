const mainHelper = require('../../../utils/helper');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const appleSignin = require('apple-signin-auth');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = async (user) => {
  const tokenObj = {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email,
  };
  if (user.roles && user.roles.length > 0) {
    tokenObj['roles'] = user.roles.map((a) => a.name);
  }

  const token = jwt.sign(tokenObj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
  });

  return token;
};

const generateOtp = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

exports.verifyGoogleToken = async (token) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

exports.verifyAppleToken = async (token) => {
  const response = await appleSignin.verifyIdToken(token, {
    audience: process.env.APPLE_CLIENT_ID,
    ignoreExpiration: true,
  });
  
  return response;
};

// // ✅ Safe mailjet sender (lazy-load and validate)
// const sendOtpMailjet = async (email, otp) => {
//   try {
//     const apiKey = process.env.MAILJET_API_KEY;
//     const apiSecret = process.env.MAILJET_API_SECRET;
//     const fromEmail = process.env.MAILJET_EMAIL;

//     if (!apiKey || !apiSecret || !fromEmail) {
//       throw new Error('Missing Mailjet API credentials in environment variables');
//     }

//     const mailjet = require('node-mailjet').apiConnect(apiKey, apiSecret);

//     const result = await mailjet.post('send', { version: 'v3.1' }).request({
//       Messages: [{
//         From: {
//           Email: fromEmail,
//           Name: "BookIT"
//         },
//         To: [{ Email: email }],
//         Subject: "Your OTP for BookIT Registration",
//         TextPart: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
//         HTMLPart: `<h3>Your OTP is <strong>${otp}</strong></h3><p>Valid for 10 minutes.</p>`
//       }]
//     });

//     return result;
//   } catch (error) {
//     console.error('Mailjet error:', error?.response?.body || error.message);
//     throw new Error('Failed to send OTP email');
//   }
// };

module.exports = {
  ...mainHelper,
  generateAccessToken,
  generateOtp,
  // sendOtpMailjet
};
