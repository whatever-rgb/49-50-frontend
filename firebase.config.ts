import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Конфигурация Firebase — данные берутся из Project Settings > General в консоли Firebase
const firebaseConfig = {

  apiKey: "AIzaSyBwWk4IFOqArbfeScLGXd_QXWSPKb1kiC4",

  authDomain: "restaurant-app-f5829.firebaseapp.com",

  projectId: "restaurant-app-f5829",

  storageBucket: "restaurant-app-f5829.firebasestorage.app",

  messagingSenderId: "231234385449",

  appId: "1:231234385449:web:875f3e7f435aded8134e38"

};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);