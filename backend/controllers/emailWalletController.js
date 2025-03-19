const EmailWallet = require("../models/EmailWallet");

exports.addEmailWallet = async (req, res) => {
  try {
    const { email, walletAddress } = req.body;

    if (!email || !walletAddress) {
      return res
        .status(400)
        .json({ message: "Email and wallet address are required." });
    }

    const existingEntry = await EmailWallet.findOne({
      $or: [{ email }, { walletAddress }],
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "Email or wallet address already exists." });
    }

    const newEntry = new EmailWallet({ email, walletAddress });
    await newEntry.save();

    res
      .status(201)
      .json({ message: "Data saved successfully", data: newEntry });
  } catch (err) {
    console.error("Error saving data:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getAllEmailWallets = async (req, res) => {
  try {
    const data = await EmailWallet.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
