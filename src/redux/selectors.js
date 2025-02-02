import { createSelector } from "reselect";
import { startOfToday } from "date-fns";
// Input selector: gets the entire feedings array
const feedingsSelector = (state) => state.feedings;

// Memoized selector: filters feedings for a specific pet
export const selectFeedingsByPet = createSelector(
  [feedingsSelector, (_, petId) => Number(petId)],
  (feedings, petId) =>
    feedings.filter((feeding) => Number(feeding.petId) === petId)
);

// Selector to filter upcoming and incomplete feedings, then sort them by feedingDate (soonest first)
export const selectUpcomingFeedings = createSelector(
  [feedingsSelector],
  (feedings) =>
    feedings
      .filter(
        (feeding) =>
          new Date(feeding.feedingDate) > new Date() && feeding.complete === 0
      )
      .sort((a, b) => new Date(a.feedingDate) - new Date(b.feedingDate))
);

export const selectPastFeedings = createSelector(
  [feedingsSelector],
  (feedings) =>
    feedings.filter((feeding) => new Date(feeding.feedingDate) < new Date())
);

export const selectCompleteFeedings = createSelector(
  [feedingsSelector],
  (feedings) => feedings.filter((feeding) => feeding.complete === 1)
);

export const selectPastCompleteFeedings = createSelector(
  [feedingsSelector],
  (feedings) => {
    // Filter the feedings that are complete
    const completeFeedings = feedings.filter(
      (feeding) => feeding.complete === 1
    );

    // Clone the array so we don't mutate the original
    const clonedFeedings = completeFeedings.slice();

    // Log each feeding's combined timestamp for debugging
    clonedFeedings.forEach((feeding) => {
      const isoString = feeding.feedingDate + "T" + feeding.feedingTime;
      const timestamp = new Date(isoString).getTime();
      console.log(
        `Feeding ID: ${feeding.id} | Date: ${feeding.feedingDate} | Time: ${feeding.feedingTime} | ISO: ${isoString} | Timestamp: ${timestamp}`
      );
    });

    // Sort feedings from newest to oldest (descending)
    return clonedFeedings.sort((a, b) => {
      const aTime = new Date(a.feedingDate + "T" + a.feedingTime).getTime();
      const bTime = new Date(b.feedingDate + "T" + b.feedingTime).getTime();
      return bTime - aTime;
    });
  }
);

export const debugPastCompleteFeedings = (state) => {
  const feedings = state.feedings;
  const completeFeedings = feedings.filter((feeding) => feeding.complete === 1);
  completeFeedings.forEach((feeding) => {
    const isoString = feeding.feedingDate + "T" + feeding.feedingTime;
    const timestamp = new Date(isoString).getTime();
    console.log(
      `Feeding ID: ${feeding.id} | Date: ${feeding.feedingDate} | Time: ${feeding.feedingTime} | Timestamp: ${timestamp}`
    );
  });
  return completeFeedings.sort((a, b) => {
    const aTime = new Date(a.feedingDate + "T" + a.feedingTime).getTime();
    const bTime = new Date(b.feedingDate + "T" + b.feedingTime).getTime();
    return bTime - aTime;
  });
};

export const selectPastCompleteFeedingsByPet = createSelector(
  [feedingsSelector, (_, petId) => Number(petId)],
  (feedings, petId) =>
    feedings
      .filter((feeding) => {
        const feedingDateTime = new Date(
          `${feeding.feedingDate}T${feeding.feedingTime}`
        );
        // Instead of comparing to new Date(), compare the feeding’s date at midnight to today’s midnight.
        const feedingDay = new Date(`${feeding.feedingDate}T00:00:00`);
        const today = startOfToday();
        return (
          Number(feeding.petId) === petId &&
          feeding.complete === 1 &&
          feedingDay < today
        );
      })
      // Sort from newest to oldest (descending)
      .sort((a, b) => {
        const aTime = new Date(`${a.feedingDate}T${a.feedingTime}`).getTime();
        const bTime = new Date(`${b.feedingDate}T${b.feedingTime}`).getTime();
        return bTime - aTime;
      })
);
