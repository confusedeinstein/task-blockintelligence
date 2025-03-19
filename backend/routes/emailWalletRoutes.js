const express = require("express");
const {
  addEmailWallet,
  getAllEmailWallets,
} = require("../controllers/emailWalletController");

const router = express.Router();

if (!addEmailWallet || !getAllEmailWallets) {
  throw new Error("Controller functions are undefined. Check your imports.");
}

router.post("/email-wallet", addEmailWallet);
router.get("/email-wallets", getAllEmailWallets);

module.exports = router;
