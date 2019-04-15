import Rebase from 're-base';
import firebase from 'firebase';



// var config = {
// 	apiKey: "AIzaSyBpP9gbbtlp5bqwjn9i_aKWXBf-kU2gK74",
// 	authDomain: "zerogames-158710.firebaseapp.com",
// 	databaseURL: "https://zerogames-158710.firebaseio.com",
// 	projectId: "zerogames-158710",
// 	storageBucket: "zerogames-158710.appspot.com",
// 	messagingSenderId: "348531466471"
// }

var config = {
    apiKey: "AIzaSyAXOpZOiCozHSC6Hj23LRfsAjqo8fNMIO0",
    authDomain: "compute-160011.firebaseapp.com",
    databaseURL: "https://compute-160011.firebaseio.com",
    projectId: "compute-160011",
    storageBucket: "compute-160011.appspot.com",
    messagingSenderId: "804087036155"
};


const app = firebase.initializeApp(config);
const base = Rebase.createClass(app.database())

const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();

export {app, base, GoogleAuthProvider}

