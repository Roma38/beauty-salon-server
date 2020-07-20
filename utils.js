module.exports = function convertScheduleData(workingTime) {
  return workingTime
    ? workingTime.map(time => time.split(":")).map(string => +string)
    : null;
}