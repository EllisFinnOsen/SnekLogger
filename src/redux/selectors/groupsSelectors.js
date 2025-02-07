import { createSelector } from "reselect";

const EMPTY_ARRAY = [];
const selectAllGroups = (state) => state.groups.groups;
const selectGroupId = (_, groupId) => groupId;
const selectGroupPetsByGroupId = (state, groupId) =>
  state.groupPets[groupId] || EMPTY_ARRAY;

export const makeSelectGroupPets = () =>
  createSelector([selectGroupPetsByGroupId], (pets) => {
    //console.log("makeSelectGroupPets: pets reference", pets);
    return [...pets]; // Ensure a new array reference is returned
  });

export const selectGroupById = createSelector(
  [selectAllGroups, selectGroupId],
  (groups, groupId) => {
    const result = groups.find((g) => g.id === groupId);
    //console.log("selectGroupById:", { groupId, result });
    return result;
  }
);
