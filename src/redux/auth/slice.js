import { createSlice } from "@reduxjs/toolkit";
import {
  register,
  logIn,
  logInWithGoogle,
  logOut,
  refreshUser,
  updateTheme,
} from "./operations";

const initialState = {
  user: { name: null, email: null, theme: "default", avatarURL: "" },
  isLoggedIn: false,
  isRefreshing: true,
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.user.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.error = null;
        state.isLoggedIn = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = {
          name: action.payload.displayName,
          email: action.payload.email,
          theme: state.user.theme,
          avatarURL: action.payload.photoURL,
        };
        state.token = action.payload.accessToken;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })
      //----------------------------------------------

      .addCase(logIn.pending, (state) => {
        state.error = null;
        state.isLoggedIn = false;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = {
          name: action.payload.name
            ? action.payload.name
            : action.payload.email,
          email: action.payload.email,
          theme: action.payload.theme ? action.payload.theme : state.user.theme,
          avatarURL: action.payload.photoURL,
        };
        state.token = action.payload.idToken;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action.payload;
      })
      //---------------------------------------------

      .addCase(logInWithGoogle.pending, (state) => {
        state.error = null;
        state.isLoggedIn = false;
      })
      .addCase(logInWithGoogle.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.user = {
          name: action.payload.name
            ? action.payload.name
            : action.payload.email,
          email: action.payload.email,
          theme: action.payload.theme ? action.payload.theme : state.user.theme,
          avatarURL: action.payload.photoURL,
        };
        state.token = action.payload.idToken;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(logInWithGoogle.rejected, (state, action) => {
        state.error = action.payload;
      })
      //---------------------------------------------

      .addCase(logOut.pending, (state) => {
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = {
          name: null,
          email: null,
          theme: "default",
          avatarURL: "",
        };
        state.isLoggedIn = false;
        state.error = null;
        state.token = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.error = action.payload;
      })
      //-------------------------------------------

      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.error = null;
        state.user = {
          name: action.payload.name
            ? action.payload.name
            : action.payload.email,
          email: action.payload.email,
          theme: action.payload.theme ? action.payload.theme : state.user.theme,
          avatarURL: action.payload.photoURL,
        };
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload;
      })
      //-----------------------------------------------

      .addCase(updateTheme.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.user.theme = action.payload.theme;
        state.error = null;
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setTheme } = authSlice.actions;
export default authSlice.reducer;
