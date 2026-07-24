// One-off bootstrap script — creates the first admin Auth account + matching
// staff/{uid} Firestore doc. Run once, then delete (or keep for future staff
// bootstrapping, but never commit real passwords printed to a log anywhere).
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "adubeagiftshop";
const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];
const NAME = process.argv[4] ?? "Admin";

if (!EMAIL || !PASSWORD) {
  console.error("Usage: node scripts/bootstrap-admin.mjs <email> <password> [name]");
  process.exit(1);
}

const app = initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const auth = getAuth(app);
const db = getFirestore(app);

let user;
try {
  user = await auth.createUser({ email: EMAIL, password: PASSWORD, displayName: NAME });
  console.log("Created new Auth user:", user.uid);
} catch (err) {
  if (err.code === "auth/email-already-exists") {
    user = await auth.getUserByEmail(EMAIL);
    console.log("Auth user already existed:", user.uid);
  } else {
    throw err;
  }
}

await db.collection("staff").doc(user.uid).set({
  name: NAME,
  email: EMAIL,
  role: "Admin",
  active: true,
  createdAt: new Date().toISOString(),
});

console.log("staff/" + user.uid + " doc written with role Admin, active true.");
