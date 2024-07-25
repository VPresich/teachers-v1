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

import { set, ref, get, push } from "firebase/database";
import { fbAuth, fbDataBase } from "../../firebaseConfig";

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        fbAuth,
        email,
        password
      );
      fbDataBase;
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      const theme = await getTheme("teachers", user.uid);

      const userData = {
        uid: user.uid,
        email: user.email,
        name,
        photoUrl: user.photoURL,
        theme: theme,
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
      const theme = await getTheme("teachers", user.uid);

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoUrl: user.photoURL,
        theme: theme,
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
      const theme = await getTheme("teachers", user.uid);

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoUrl: user.photoURL,
        theme: theme,
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

const getTheme = async (collection, userId) => {
  try {
    const themesRef = ref(fbDataBase, "themes");
    const snapshotThemes = await get(themesRef);

    let theme = "yellow";

    let themeRef = null;
    if (snapshotThemes.exists()) {
      snapshotThemes.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.user === userId && data.collection === collection) {
          theme = data.theme;
          themeRef = childSnapshot.ref;
        }
      });

      if (!themeRef) {
        const newThemeRef = push(themesRef);
        await set(newThemeRef, {
          user: userId,
          collection: collection,
          theme: theme,
        });
      }
    } else {
      const newThemeRef = push(themesRef);
      await set(newThemeRef, {
        user: userId,
        collection: collection,
        theme: theme,
      });
    }

    return theme;
  } catch {
    return "default";
  }
};

export const updateTheme = createAsyncThunk(
  "users/updateTheme",
  async ({ collection, newTheme }, thunkAPI) => {
    try {
      const user = fbAuth.currentUser;
      if (!user) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }
      const themesRef = ref(fbDataBase, "themes");
      const snapshotThemes = await get(themesRef);
      let themeUpdated = false;

      if (snapshotThemes.exists()) {
        snapshotThemes.forEach(async (childSnapshot) => {
          const data = childSnapshot.val();
          if (data.user === user.uid && data.collection === collection) {
            themeUpdated = true;
            const themeRef = ref(fbDataBase, `themes/${childSnapshot.key}`);
            await set(themeRef, {
              user: user.uid,
              collection: collection,
              theme: newTheme,
            });
          }
        });
      }

      if (!themeUpdated) {
        const newThemeRef = push(themesRef);
        await set(newThemeRef, {
          user: user.uid,
          collection: collection,
          theme: newTheme,
        });
      }

      return newTheme;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
