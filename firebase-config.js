import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfq6DjStYd_2sb2P6GyhvTX6IU-Pemn3Y",
  authDomain: "cxo-itm.firebaseapp.com",
  projectId: "cxo-itm",
  storageBucket: "cxo-itm.firebasestorage.app",
  messagingSenderId: "676622991012",
  appId: "1:676622991012:web:4955bd99541a8cf242b031",
  measurementId: "G-6KNY00W1M4"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { db, analytics };
