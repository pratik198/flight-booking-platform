const Payment = require("../models/Payment");
const { v4: uuid } = require("uuid");

exports.processPayment = async (bookingId, amount, method) => {

  const payment = await Payment.create({
    bookingId,
    amount,
    method,
    status: "success",
    transactionId: uuid()
  });

  return payment;

};