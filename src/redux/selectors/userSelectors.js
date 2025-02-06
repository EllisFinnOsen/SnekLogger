import { createSelector } from "reselect";

const userProfileSelector = (state) => state.user.profile;

export const selectUserProfile = createSelector(
  [userProfileSelector],
  (profile) => profile || { name: "", photo: "", birthdate: "" }
);
