import { RRule, datetime } from "rrule";
import { openDatabase } from "./index";

export const addRecurringFeeding = async ({
  petId,
  frequency,
  interval,
  customUnit,
  endType,
  endDate,
  occurrenceCount,
  feedingTimestamp,
  preyType,
  preyWeight,
  preyWeightType,
  notes,
  complete,
}) => {
  const db = await openDatabase();

  let freq;
  switch (frequency) {
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
    case "custom":
      freq =
        customUnit === "day"
          ? RRule.DAILY
          : customUnit === "week"
            ? RRule.WEEKLY
            : customUnit === "month"
              ? RRule.MONTHLY
              : RRule.YEARLY;
      break;
    default:
      throw new Error("Invalid frequency");
  }

  const rruleOptions = {
    freq,
    interval,
    dtstart: new Date(feedingTimestamp || new Date()), // ✅ Ensure dtstart is valid
  };

  if (endType === "on" && endDate) {
    rruleOptions.until = new Date(endDate);
  }

  if (endType === "after" && occurrenceCount) {
    rruleOptions.count = occurrenceCount;
  }

  const rule = new RRule(rruleOptions);

  try {
    await db.runAsync(
      `INSERT INTO recurring_feedings (petId, rrule, feedingTimestamp, preyType, preyWeight, preyWeightType, notes, complete) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petId,
        rule.toString(),
        feedingTimestamp,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        complete,
      ]
    );

    console.log("✅ Recurring Feeding Inserted:", {
      petId,
      rrule: rule.toString(),
      feedingTimestamp,
      preyType,
    });
  } catch (error) {
    console.error("❌ Error inserting recurring feeding:", error);
  }
};

export const getUpcomingFeedings = async () => {
  const db = await openDatabase();
  try {
    const result = await db.getAllAsync("SELECT * FROM recurring_feedings");

    if (!result || result.length === 0) {
      console.warn("⚠️ No recurring feedings found in DB.");
      return [];
    }

    let upcomingFeedings = [];

    result.forEach((row) => {
      try {
        const rule = RRule.fromString(row.rrule);
        const occurrences = rule.between(
          new Date(),
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Next 2 weeks
        );

        occurrences.forEach((date, index) => {
          upcomingFeedings.push({
            id: `${row.id}-${date.toISOString()}`, // Ensure unique ID per occurrence
            petId: row.petId,
            feedingTimestamp: date.toISOString(),
            preyType: row.preyType,
            preyWeight: row.preyWeight,
            preyWeightType: row.preyWeightType,
            notes: row.notes,
            complete: 0,
          });
        });
      } catch (error) {
        console.error("❌ Error parsing RRule:", row.rrule, error);
      }
    });

    console.log("✅ Fetched Upcoming Feedings:", upcomingFeedings);
    return upcomingFeedings;
  } catch (error) {
    console.error("❌ Error fetching upcoming feedings:", error);
    return [];
  }
};

export const logRecurringFeedings = async () => {
  const db = await openDatabase();
  const upcomingFeedings = await getUpcomingFeedings();

  if (!Array.isArray(upcomingFeedings) || upcomingFeedings.length === 0) {
    console.warn("No upcoming recurring feedings found.");
    return [];
  }

  const insertedFeedings = [];

  for (const feeding of upcomingFeedings) {
    const existing = await db.getAllAsync(
      `SELECT id FROM feedings WHERE petId = ? AND feedingTimestamp = ?`,
      [feeding.petId, feeding.feedingTimestamp]
    );

    if (existing.length === 0) {
      await db.runAsync(
        `INSERT INTO feedings (petId, feedingTimestamp, preyType, preyWeight, preyWeightType, notes, complete) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          feeding.petId,
          feeding.feedingTimestamp,
          feeding.preyType,
          feeding.preyWeight,
          feeding.preyWeightType,
          feeding.notes,
          feeding.complete,
          0,
        ]
      );
      insertedFeedings.push(feeding);
    }
  }

  return insertedFeedings;
};
