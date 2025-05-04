const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  user: {
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    username: String,
  },
  billing: {
    name: String,
    phone:String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
  },
  payment: {
    method: String,
   
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Checkout', CheckoutSchema);
