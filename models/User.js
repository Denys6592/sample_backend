const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      default: "freelancer",
    },
    userName: {
      type: String,
      unique: true,
    },
    uid: {
      type: String,
      unique: true,
      required: true
    },
    provider: {
      type: String,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
    },
    friends: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    workHistory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "WorkHistory",
      },
    ],
    education: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Education",
      },
    ],
    portfolios: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Portfolio",
      },
    ],
    skills: {
      type: Array,
    },
    hourlyRate: {
      type: Number,
    },
    review: {
      type: Number,
    },
    portfolios: {
      type: Array,
    },
    linkedInProfile: {
      type: String,
    },
    behanceProfile: {
      type: String,
    },
    githubProfile: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);