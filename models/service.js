var mongoose = require("mongoose");
var categories = require("../constants");

var serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  pictureURL: String,
  category: {
    type: String,
    enum: [...categories, ""],
    default: null
  },
  price: Number,
  duration: {
    type: Number,
    min: 0,
    max: 450
  },
  updated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
