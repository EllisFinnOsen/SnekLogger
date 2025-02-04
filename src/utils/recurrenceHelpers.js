import { RRule } from "rrule";

/**
 * Given a recurring schedule object, generate upcoming occurrences.
 * @param {Object} schedule - The recurrence details from your feeding_schedules table.
 * @param {number} [count=10] - How many occurrences to generate.
 * @returns {Date[]} Array of Date objects representing upcoming occurrences.
 */
export const generateOccurrences = (schedule, count = 10) => {
  // Map your schedule.frequency string to the RRule constant.
  let freq;
  switch (schedule.frequency) {
    case "daily":
      freq = RRule.DAILY;
      break;
    case "weekly":
      freq = RRule.WEEKLY;
      break;
    case "monthly":
      freq = RRule.MONTHLY;
      break;
    case "yearly":
      freq = RRule.YEARLY;
      break;
    default:
      freq = RRule.DAILY;
  }

  // Construct the dtstart using the startDate and feedingTime.
  // Make sure feedingTime is in HH:MM format.
  const dtstart = new Date(`${schedule.startDate}T${schedule.feedingTime}:00`);

  // Build rrule options.
  const options = {
    freq,
    interval: schedule.interval || 1,
    dtstart,
  };

  // If the recurrence ends "after" a number of occurrences, set count.
  if (schedule.endType === "after" && schedule.occurrenceCount) {
    options.count = schedule.occurrenceCount;
  }
  // If the recurrence ends "on" a specific date, set until.
  if (schedule.endType === "on" && schedule.endDate) {
    // Here, we assume the endDate is stored in YYYY-MM-DD format.
    // You may want to adjust to include the time portion.
    options.until = new Date(`${schedule.endDate}T23:59:59`);
  }

  const rule = new RRule(options);
  // Generate occurrences; you can use rule.all() (if count is set) or rule.between() if you prefer.
  const occurrences = rule.all().slice(0, count);
  return occurrences;
};
