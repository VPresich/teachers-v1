import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const fbApiKey = import.meta.env.VITE_FB_APIKEY;
const fbAuthDomain = import.meta.env.VITE_FB_AUTHDOMAIN;
const fbDatabaseURL = import.meta.env.VITE_FB_DATABASEURL;
const fbProjectId = import.meta.env.VITE_FB_PROJECTID;
const fbstorageBucket = import.meta.env.VITE_FB_STORAGEBUCKET;
const fbMessagingSenderId = import.meta.env.VITE_FB_MESSAGINSENDERID;
const fbAppId = import.meta.env.VITE_FB_APPID;
const fbMeasurementId = import.meta.env.VITE_FB_MEASUREMENTID;

const firebaseConfig = {
  apiKey: fbApiKey,
  authDomain: fbAuthDomain,
  databaseURL: fbDatabaseURL,
  projectId: fbProjectId,
  storageBucket: fbstorageBucket,
  messagingSenderId: fbMessagingSenderId,
  appId: fbAppId,
  measurementId: fbMeasurementId,
};

const fbApp = initializeApp(firebaseConfig);
export const fbAuth = getAuth(fbApp);
export const fbStore = getFirestore(fbApp);
export const fbDataBase = getDatabase(fbApp);
