
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-XCZmG3FqgosYvat9JSSWSkTsOOvB_kg",
    authDomain: "ioclfastag-f5414.firebaseapp.com",
    projectId: "ioclfastag-f5414",
    storageBucket: "ioclfastag-f5414.appspot.com",
    messagingSenderId: "664114528303",
    appId: "1:664114528303:web:8aee0c4ce607ec788886da",
    measurementId: "G-X4CGPPQFVE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { auth, firestore, storage };

export default app; 
