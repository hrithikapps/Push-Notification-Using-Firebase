importScripts("https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js");

const FIREBASE_CONFIG = {
    // CONFIG

    apiKey: "AIzaSyDCnh8weSKET7qaa7X29zpwvgYrWi538sU",
    authDomain: "cometchat-test-project.firebaseapp.com",
    projectId: "cometchat-test-project",
    storageBucket: "cometchat-test-project.appspot.com",
    messagingSenderId: "908533477990",
    appId: "1:908533477990:web:4a7ef271de0301d12eb3a7",
    measurementId: "G-FBNRNZ7WZV"

};



const initializedFirebaseApp = firebase.initializeApp(FIREBASE_CONFIG);

const messaging = initializedFirebaseApp.messaging();