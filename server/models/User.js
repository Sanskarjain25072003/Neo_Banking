import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  accountNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Pre-save middleware
userSchema.pre("save", async function(next) {
  try {
    // Generate account number for new users or if missing
    if (!this.accountNumber) {
      this.accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
    
    // Hash password if it's modified
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
