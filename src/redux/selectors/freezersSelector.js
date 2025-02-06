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
  (feedingFreezer, feedingId) => feedingFreezer[feedingId] || []
);

export const selectFreezerItems = (state) => state.freezer.items || [];

export const selectLowStockWarnings = createSelector(
  [freezerSelector],
  (freezer) => freezer.lowStockWarnings
);
