const mongoose = require("mongoose");
const priceSchema = new mongoose.Schema({
  cryptoCurrency: { type: String },
  price: { inr: { type: Number } },
});
module.exports = mongoose.model("price", priceSchema);
