const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendResponse = (
  res,
  statusCode = 200,
  status = true,
  message = '',
  data = null,
  token = null
) => {
  return res.status(statusCode).json({
    statusCode,
    status,
    message,
    data,
    token,
  });
};

const verifyToken = function (token, callback) {
  return jwt.verify(token, process.env.JWT_SECRET, {}, callback);
};

const sendOtp = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP code for PredixyAI is ${otp}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log(`OTP sent to ${phoneNumber}`);
  } catch (error) {
    throw { error };
  }
};

const generateOrderNumber = () => {
  const now = new Date();

  // Format date and time parts
  const datePart = `${now.getFullYear()}${padToTwoDigits(
    now.getMonth() + 1
  )}${padToTwoDigits(now.getDate())}`;
  const timePart = `${padToTwoDigits(now.getHours())}${padToTwoDigits(
    now.getMinutes()
  )}${padToTwoDigits(now.getSeconds())}`;

  // Generate a random 4-digit number
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  // Combine parts
  return `${datePart}-${timePart}-${randomPart}`;
};

// Helper function to pad single-digit numbers with a leading zero
const padToTwoDigits = (num) => num.toString().padStart(2, '0');

// "15 January 2025"
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options); // Use British English for day-month-year format
};

const totalTaxCalculation = (subTotal, selectedTaxItem, discountAmount) => {
  let totalTax = 0;
  if (Number(subTotal) >= 0) {
    const data = selectedTaxItem;
    if (Number(discountAmount) > 0) {
      totalTax =
        ((Number(subTotal) - Number(discountAmount)) / 100) *
        Number(data.tax_amount);
    } else {
      totalTax = (Number(subTotal) / 100) * Number(data.tax_amount);
    }
  }
  return parseFloat(totalTax.toFixed(2));
};


function convertINRtoUSD(rupees, usdRate="85.68") {
  
  const exchangeRate = 1 / usdRate; // Convert USD to INR rate to INR to USD rate
  return `$${(rupees * exchangeRate).toFixed(2)}`; // Rounds to 2 decimal places
}


module.exports = {
  sendResponse,
  verifyToken,
  sendOtp,
  generateOrderNumber,
  formatDate,
  totalTaxCalculation,
  convertINRtoUSD
};
