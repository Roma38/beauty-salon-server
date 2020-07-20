var express = require("express");
var router = express.Router();
var Schedule = require("../models/schedule");
var convertScheduleData = require("../utils");

// Get schedule
router.get("/", function (req, res, next) {
  Schedule.find()
    .then(schedule => res.status(201).json(schedule))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error }); //TODO: status code
    });
});

//**************************************************************/

// Add schedule
router.post("/", function (req, res, next) {
  const { workDaysSchedule, saturdaySchedule, sundaySchedule } = req.body;

  const schedule = new Schedule({
    workDaysSchedule: convertScheduleData(workDaysSchedule),
    saturdaySchedule: convertScheduleData(saturdaySchedule),
    sundaySchedule: convertScheduleData(sundaySchedule)
  });

  schedule
    .save()
    .then(schedule => res.status(201).json(schedule))
    .catch(error => {
      console.error(error);
      res.status(500).json(error);
    });
});

// Edit schedule
router.put("/", function (req, res, next) {
  const schedule = req.body;

  Schedule.findByIdAndUpdate(schedule._id, schedule)
    .then(schedule => res.status(201).json(schedule))
    .catch(error => {
      if (error.code === 11000) {
        res
          .status(422)
          .json({ error: "Service with such name already exists" });
      }
      console.error(error);
      res.status(500).json(error);
    });
});

module.exports = router;
