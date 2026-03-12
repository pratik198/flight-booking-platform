const Payment = require("../models/Payment");
const { v4: uuid } = require("uuid");

exports.createPayment = async (req,res)=>{

  const { bookingId, amount } = req.body;

  const payment = await Payment.create({
    bookingId,
    amount,
    method:"UPI",
    status:"success",
    transactionId: uuid()
  });

  res.json(payment);

};