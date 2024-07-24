import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ref,
  query,
  get,
  limitToFirst,
  startAt,
  endAt,
  orderByKey,
} from "firebase/database";
import { fbDataBase } from "../../firebaseConfig";

export const getTeachersPerPage = createAsyncThunk(
  "teachers/getPage",
  async ({ page, limit }, thunkAPI) => {
    try {
      const countRef = ref(fbDataBase, "teachersCount");
      const countSnapshot = await get(countRef);
      const totalRecords = countSnapshot.val() || 0;
      const totalPages = Math.ceil(totalRecords / limit);
      if (page < 1 || page > totalPages) {
        return thunkAPI.rejectWithValue("Invalid page number");
      }

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit - 1;

      const teachersRef = ref(fbDataBase, "teachers");

      const teachersQuery = query(
        teachersRef,
        orderByKey(),
        startAt(startIndex.toString()),
        endAt(endIndex.toString()),
        limitToFirst(limit)
      );

      const snapshot = await get(teachersQuery);
      const data = snapshot.val();
      const teachersArray = Object.values(data || {});

      return {
        totalRecords,
        totalPages,
        page,
        limit,
        teachers: teachersArray,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getTeacherById = createAsyncThunk(
  "teachers/teacherById",
  async (id, thunkAPI) => {
    try {
      const teachersRef = ref(fbDataBase, "teachers");
      const snapshot = await get(teachersRef);
      if (!snapshot.exists()) {
        return thunkAPI.rejectWithValue("No teachers data found");
      }

      const teachers = snapshot.val();
      const teacherArray = Object.values(teachers);
      const teacherData = teacherArray.find((teacher) => teacher._id === id);
      if (!teacherData) {
        return thunkAPI.rejectWithValue("Teacher not found");
      }

      return teacherData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getTeachersWithParams = createAsyncThunk(
  "teachers/withParams",
  async ({ page, limit, query }, thunkAPI) => {
    const teachersRef = ref(fbDataBase, "teachers");

    try {
      const snapshot = await get(teachersRef);

      if (!snapshot.exists()) {
        return thunkAPI.rejectWithValue("No teachers data found");
      }

      const teachers = snapshot.val();
      const teachersArray = Object.values(teachers);

      const filteredTeachers = teachersArray.filter((teacher) => {
        let matches = true;
        if (query.level && !teacher.levels.includes(query.level)) {
          matches = false;
        }
        if (query.language && !teacher.languages.includes(query.language)) {
          matches = false;
        }
        if (
          query.price_per_hour &&
          teacher.price_per_hour > parseFloat(query.price_per_hour)
        ) {
          matches = false;
        }
        return matches;
      });

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const startIndex = (pageNumber - 1) * limitNumber;

      const totalRecords = filteredTeachers.length;
      const totalPages = Math.ceil(totalRecords / limitNumber);

      if (pageNumber > totalPages) {
        return thunkAPI.rejectWithValue("Page not found");
      }

      const paginatedTeachers = filteredTeachers.slice(
        startIndex,
        startIndex + limitNumber
      );

      return {
        totalRecords,
        totalPages,
        page: pageNumber,
        limit: limitNumber,
        teachers: paginatedTeachers,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
