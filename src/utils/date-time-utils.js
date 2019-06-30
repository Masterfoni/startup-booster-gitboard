import moment from "moment";

export default class DateTimeUtils {
  static getTotalDaysHoursMinutes = totalMiliseconds => {
    var days, hours, minutes, seconds;

    seconds = Math.floor(totalMiliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;

    return { days: days, hours: hours, minutes: minutes, seconds: seconds };
  };

  static getTotalHours = totalMiliseconds => {
    var hours, minutes, seconds;

    seconds = Math.floor(totalMiliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);

    return hours;
  };

  static getLastMonth = () => {
    return moment()
      .subtract(1, "months")
      .format();
  };
}
