const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    // ⭐ UPDATE THIS FIELD HERE:
    expiresAt: {
      type: Date,
      default: null,
      index: { expires: 0 } // Tells MongoDB to delete when this exact timestamp is reached
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('url', urlSchema);