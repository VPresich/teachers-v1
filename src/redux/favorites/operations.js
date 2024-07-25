import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInst } from "../../api/axiosInst";
import { fbAuth, fbDataBase } from "../../firebaseConfig";
import { ref, get, set, push, remove } from "firebase/database";

export const fetchFavoritesByTeacherIds = createAsyncThunk(
  "teachers/getFavoritsByTeacherIds",
  async (ids, thunkAPI) => {
    try {
      const promises = ids.map((id) => axiosInst.get(`teachers/${id}`));
      const responses = await Promise.all(promises);
      const data = responses.map((response) => response.data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, thunkAPI) => {
    try {
      const user = fbAuth.currentUser;
      if (!user) return thunkAPI.rejectWithValue("The user is not authorized");

      const favoritesRef = ref(fbDataBase, "favorites");
      const snapshot = await get(favoritesRef);

      const favorites = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.user === user.uid) {
            favorites.push(data.teacher);
          }
        });
      }

      console.log("favorites", favorites);

      return favorites;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (idTeacher, thunkAPI) => {
    try {
      const user = fbAuth.currentUser;
      if (!user) return thunkAPI.rejectWithValue("The user is not authorized");

      const favoritesRef = ref(fbDataBase, "favorites");
      const snapshot = await get(favoritesRef);

      let exists = false;

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.user === user.uid && data.teacher === idTeacher) {
            exists = true;
          }
        });
      }
      if (exists) {
        return thunkAPI.rejectWithValue("This favorite already exists");
      }
      const newFavoriteRef = push(favoritesRef);
      await set(newFavoriteRef, {
        user: user.uid,
        teacher: idTeacher,
      });

      return { teacher: idTeacher };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// export const removeFavorite = createAsyncThunk(
//   "favorites/removeFavorite",
//   async (idTeacher, thunkAPI) => {
//     try {
//       const response = await axiosInst.delete(`favorites/${idTeacher}`);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (idTeacher, thunkAPI) => {
    try {
      const user = fbAuth.currentUser;
      if (!user) return thunkAPI.rejectWithValue("The user is not authorized");

      const favoritesRef = ref(fbDataBase, "favorites");
      const snapshot = await get(favoritesRef);

      let favoriteKey = null;

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.user === user.uid && data.teacher === idTeacher) {
            favoriteKey = childSnapshot.key;
          }
        });
      }

      if (favoriteKey) {
        const favoriteRef = ref(fbDataBase, `favorites/${favoriteKey}`);
        await remove(favoriteRef);
        return { teacher: idTeacher };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
