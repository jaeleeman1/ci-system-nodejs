importScripts('https://www.gstatic.com/firebasejs/3.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.8.0/firebase-messaging.js');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAn_RTcg2y4ek16TUM-R0aMjCZ_ILFUCZQ",
    authDomain: "web-quick-386a3.firebaseapp.com",
    databaseURL: "https://web-quick-386a3.firebaseio.com",
    projectId: "web-quick-386a3",
    storageBucket: "web-quick-386a3.appspot.com",
    messagingSenderId: "653680124187"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.requestPermission()
.then(function () {
    console.log('Have permission');
    return messaging.getToken();
})
.then(function (token) {
    console.log(token);
})
.catch (function () {
    console.log('Error occured');
})

messaging.onMessage(function (payload) {
    console.log('onMessage: ', payload);
});