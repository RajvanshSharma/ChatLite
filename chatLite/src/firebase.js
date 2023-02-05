import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase
  .initializeApp({
    apiKey: "AIzaSyBmEDu2cPxcltSNMnvFVX6X1LKg3XC0Jbo",
    authDomain: "chatlite-85565.firebaseapp.com",
    projectId: "chatlite-85565",
    storageBucket: "chatlite-85565.appspot.com",
    messagingSenderId: "387680140428",
    appId: "1:387680140428:web:d66fb7f2ba4948a932cfa9",
  })
  .auth();
