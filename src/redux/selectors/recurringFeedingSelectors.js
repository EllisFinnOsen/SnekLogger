import { createSelector } from "reselect";

const recurringFeedingsSelector = (state) => state.recurringFeedings;

// Select all recurring feedings
export const selectAllRecurringFeedings = createSelector(
  [recurringFeedingsSelector],
  (recurringFeedings) => recurringFeedings
);
