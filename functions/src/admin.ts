import * as admin from "firebase-admin";
import serviceAccount from "../../admin.json";
import * as functions from "firebase-functions";

admin.initializeApp(
    {
      credential:
            admin.credential.cert(serviceAccount as admin.ServiceAccount),
    }
);

const db = admin.firestore();
export {admin, db, functions};

