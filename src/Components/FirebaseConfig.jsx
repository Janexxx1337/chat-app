import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAO0g3am9dUuFeiZIYKuEcoyHNpF859_5A",
    authDomain: "chatapp-9305d.firebaseapp.com",
    projectId: "chatapp-9305d",
    storageBucket: "chatapp-9305d.appspot.com",
    messagingSenderId: "504666273329",
    appId: "1:504666273329:web:74ecdbb369e9adaedb0710",
    measurementId: "G-BDM3DFRGJH"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

export { auth, database };
