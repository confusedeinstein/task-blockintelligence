const mongoose = require("mongoose");

const EmailWalletSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("EmailWallet", EmailWalletSchema);
