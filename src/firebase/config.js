import app from 'firebase/app'
import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyA7OmdbYiQmChQhFQp9cVtvk3mb2r7PUGw",
    authDomain: "proyecto-rn-7d3cc.firebaseapp.com",
    projectId: "proyecto-rn-7d3cc",
    storageBucket: "proyecto-rn-7d3cc.appspot.com",
    messagingSenderId: "864865238477",
    appId: "1:864865238477:web:d5033e66c4c7c27eba9884"
  };

app.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const storage = app.storage()
export const db = app.firestore()