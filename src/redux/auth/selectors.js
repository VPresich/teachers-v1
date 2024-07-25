import { createSelector } from "reselect";

const selectAuth = (state) => state.auth;
export const selectUser = createSelector(selectAuth, (auth) => auth.user);
export const selectUserName = createSelector(
  selectAuth,
  (auth) => auth.user.name
);

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export const selectTheme = (state) => state.auth.theme;

export const selectIsRefreshing = createSelector(
  selectAuth,
  (auth) => auth.isRefreshing
);
