var mongoose = require("mongoose");

var staffSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  services: []/* {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Service"
  } */,
  pictureURL: String,
  joinDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Staff", staffSchema);
