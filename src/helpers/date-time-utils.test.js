const dateTimeUtils = require("./date-time-utils");

test("Formating total miliseconds into day, hour, minute and second", () => {
  const formatResult = dateTimeUtils.getTotalDaysHoursMinutes(86401000);
  expect(formatResult.days).toBe(1);
  expect(formatResult.hours).toBe(0);
  expect(formatResult.minutes).toBe(0);
  expect(formatResult.seconds).toBe(1);
});

test("Converting from miliseconds to a number of total hours", () => {
  expect(dateTimeUtils.getTotalHours(43200000)).toBe(12);
});
