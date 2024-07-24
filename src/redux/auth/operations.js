import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { fbAuth, fbStore } from "../../firebaseConfig";

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        fbAuth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        accessToken: user.accessToken,
        photoUrl: user.photoURL,
      };

      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        fbAuth,
        email,
        password
      );

      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        accessToken: user.accessToken,
        photoUrl: user.photoURL,
      };

      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logInWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, thunkAPI) => {
    try {
      await signOut(fbAuth);
      const googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(fbAuth, googleProvider);

      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        accessToken: user.accessToken,
        photoUrl: user.photoURL,
      };
      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await signOut(fbAuth);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      return new Promise((resolve, reject) => {
        onAuthStateChanged(fbAuth, (user) => {
          if (user) {
            const userData = {
              uid: user.uid,
              email: user.email,
              name: user.displayName,
              accessToken: user.accessToken,
              photoUrl: user.photoURL,
            };
            resolve(userData);
          } else {
            reject(null);
          }
        });
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateTheme = createAsyncThunk(
  "users/themes",
  async (data, thunkAPI) => {
    try {
      const user = fbAuth.currentUser;
      if (user) {
        await setDoc(doc(fbStore, "users", user.uid), data, { merge: true });
        return data;
      } else {
        return thunkAPI.rejectWithValue("User not authenticated");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
