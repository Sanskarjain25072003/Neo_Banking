import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get user profile and balance
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        balance: req.user.balance,
        accountNumber: req.user.accountNumber
      }
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add money (deposit)
router.post("/add-money", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    // Update user balance
    req.user.balance += amount;
    await req.user.save();

    // Create transaction record
    const transaction = new Transaction({
      fromUser: req.user._id,
      amount: amount,
      type: "deposit",
      description: `Deposit of $${amount}`,
      balanceAfter: req.user.balance
    });
    await transaction.save();

    res.json({
      message: "Money added successfully",
      newBalance: req.user.balance,
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        balanceAfter: transaction.balanceAfter,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error("Add money error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send money (transfer)
router.post("/send-money", authenticateToken, async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount || amount <= 0) {
      return res.status(400).json({ message: "Valid email and amount are required" });
    }

    if (amount > req.user.balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Find recipient
    const recipient = await User.findOne({ email });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }

    // Update balances
    req.user.balance -= amount;
    recipient.balance += amount;

    await Promise.all([req.user.save(), recipient.save()]);

    // Create transaction records
    const senderTransaction = new Transaction({
      fromUser: req.user._id,
      toUser: recipient._id,
      amount: amount,
      type: "transfer",
      description: `Transfer to ${recipient.name} (${recipient.email})`,
      balanceAfter: req.user.balance
    });

    const receiverTransaction = new Transaction({
      fromUser: req.user._id,
      toUser: recipient._id,
      amount: amount,
      type: "transfer",
      description: `Transfer from ${req.user.name} (${req.user.email})`,
      balanceAfter: recipient.balance
    });

    await Promise.all([senderTransaction.save(), receiverTransaction.save()]);

    res.json({
      message: "Money sent successfully",
      newBalance: req.user.balance,
      transaction: {
        id: senderTransaction._id,
        amount: senderTransaction.amount,
        type: senderTransaction.type,
        description: senderTransaction.description,
        balanceAfter: senderTransaction.balanceAfter,
        createdAt: senderTransaction.createdAt
      }
    });
  } catch (error) {
    console.error("Send money error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get transaction history
router.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const transactions = await Transaction.find({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    })
    .populate("fromUser", "name email")
    .populate("toUser", "name email")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Transaction.countDocuments({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    });

    res.json({
      transactions: transactions.map(transaction => ({
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        balanceAfter: transaction.balanceAfter,
        createdAt: transaction.createdAt,
        fromUser: transaction.fromUser ? {
          name: transaction.fromUser.name,
          email: transaction.fromUser.email
        } : null,
        toUser: transaction.toUser ? {
          name: transaction.toUser.name,
          email: transaction.toUser.email
        } : null
      })),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
