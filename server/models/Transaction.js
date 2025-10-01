import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function() {
      return this.type !== "deposit";
    }
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function() {
      return this.type === "transfer";
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ["deposit", "transfer", "withdrawal"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed"
  },
  balanceAfter: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
transactionSchema.index({ fromUser: 1, createdAt: -1 });
transactionSchema.index({ toUser: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);
