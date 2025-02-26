import { initializeApp, getApp, App,getApps,cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../../service_key.json";

const credentials = serviceAccount as ServiceAccount;
const app: App = getApps().length === 0 ? initializeApp({ credential: cert(credentials) }) : getApp();

const adminDB = getFirestore(app);

export {app as adminApp, adminDB};