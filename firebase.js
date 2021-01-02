import * as fb from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCwmGHFNOyayldxA-MxPOdRyvmFdkx6GMs",
    authDomain: "call-boda.firebaseapp.com",
    databaseURL: "https://call-boda.firebaseio.com",
    projectId: "call-boda",
    storageBucket: "call-boda.appspot.com",
    messagingSenderId: "99208868044",
    appId: "1:99208868044:web:0b61c728850a7243229269",
    measurementId: "G-2J0H5N5W19"
  };

  

const firebase = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app();

export default firebase;