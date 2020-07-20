var mongoose = require("mongoose");

var staffSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  services: [
    String
  ],
  pictureURL: String,
  joinDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
