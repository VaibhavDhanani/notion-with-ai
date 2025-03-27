import { adminDB } from "@/lib/firebase-admin";

async function testAdminDB() {
  try {
    const testQuery = await adminDB.collection("testCollection").limit(1).get();
    console.log("Firebase Admin Query Successful:", testQuery.docs.length);
  } catch (error) {
    console.error("Firebase Admin Error:", error);
  }
}

testAdminDB();
