import { createSelector } from "reselect";

const freezerSelector = (state) =>
  state.freezer || { items: [], lowStockWarnings: [] };

const feedingFreezerSelector = (state) => state.feedingFreezer || {};

export const selectFreezerItemById = createSelector(
  [freezerSelector, (_, freezerId) => freezerId],
  (freezer, freezerId) => freezer.find((item) => item.id === freezerId) || null
);

export const selectFeedingFreezerLinks = createSelector(
  [feedingFreezerSelector, (_, feedingId) => feedingId],
  (feedingFreezer, feedingId) => feedingFreezer[feedingId] || Object.freeze([])
);

export const selectFreezerItems = createSelector(
  [(state) => state.freezer.items || []],
  (items) => items // Keeps reference stable if `items` hasn't changed
);

export const selectLowStockWarnings = createSelector(
  [freezerSelector],
  (freezer) => freezer.lowStockWarnings
);
