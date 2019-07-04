const moment = require("moment");

const dateTimeUtils = {
  /**
   * @description Build an object containing the total number of days, hours, minutes and seconds
   * from a milisecond total time
   * @param  {Number} totalMiliseconds The total number of miliseconds
   * @return {Object}                  Object containg days, hours, minutes and seconds properties.
   */
  getTotalDaysHoursMinutes: totalMiliseconds => {
    var days, hours, minutes, seconds;

    seconds = Math.floor(totalMiliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;

    return { days: days, hours: hours, minutes: minutes, seconds: seconds };
  },

  /**
   * @description Returns the total number of hours from a total number of miliseconds
   * @param  {Number} totalMiliseconds The total number of miliseconds
   * @return {Number}                  Total number of hours
   */
  getTotalHours: totalMiliseconds => {
    var hours, minutes, seconds;

    seconds = Math.floor(totalMiliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);

    return hours;
  },

  /**
   * @description Returns the date 30 prior to this date
   * @return {Date} Date corresponding 30 days ago
   */
  getLastMonth: () => {
    return moment()
      .subtract(1, "months")
      .format();
  }
};

module.exports = dateTimeUtils;
