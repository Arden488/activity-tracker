import firebase from "firebase";
import * as admin from "firebase-admin";
// import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAO2wJL1suOGZ3XSGQe_L4v1z9Ezia3sNw",
    authDomain: "tracker-47ddf.firebaseapp.com",
    projectId: "tracker-47ddf",
    storageBucket: "tracker-47ddf.appspot.com",
    messagingSenderId: "704615672308",
    appId: "1:704615672308:web:127db1ae7b6084d3d931a1",
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export default firebase;
