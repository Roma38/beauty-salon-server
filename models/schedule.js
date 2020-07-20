var mongoose = require("mongoose");

var schedule = mongoose.Schema({
  workDaysSchedule: {
    type: [[Number], [Number]],
    required: true,
  },
  saturdaySchedule: {
    type: [[Number], [Number]] || null,
    required: true,
  },
  sundaySchedule: {
    type: [[Number], [Number]] || null,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Schedule", schedule);
