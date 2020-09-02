import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";

var firebaseConfig = {
	apiKey: "AIzaSyB0ttuHOf4KtlsAiEINSIEmpI4CWd-GT9Q",
	authDomain: "zoom-to-class.firebaseapp.com",
	databaseURL: "https://zoom-to-class.firebaseio.com",
	projectId: "zoom-to-class",
	storageBucket: "zoom-to-class.appspot.com",
	messagingSenderId: "553608766967",
	appId: "1:553608766967:web:db6336b974f1cd9a133af2",
	measurementId: "G-X4KPB6K4LJ",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.database();

export default firebase;
