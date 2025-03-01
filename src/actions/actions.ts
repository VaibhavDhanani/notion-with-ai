"use server";

import { adminDB } from "@/lib/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { Timestamp } from "firebase-admin/firestore";

export async function createNewDocument() {
  const { sessionClaims } = await auth();

  if (!sessionClaims || !sessionClaims.email) {
    throw new Error("Unauthorized: No email found in session.");
  }

  const collectionRef = adminDB.collection("documents");
  const documentRef = await collectionRef.add({
    title: "New Document",
  });

  await adminDB
    .collection("users")
    .doc(sessionClaims.email)
    .collection("rooms")
    .doc(documentRef.id)
    .set({
      userId: sessionClaims.email,
      role: "owner",
      createdAt: Timestamp.now(),
      roomId: documentRef.id,
    });

  return { documentId: documentRef.id };
}

export async function deleteDocument(roomId: string) {
  auth.protect();
  console.log("deleted document", roomId);
  try {
    // delete document itself
    await adminDB.collection("documents").doc(roomId).delete();

    // delete document ref from all users
    const query = await adminDB
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();
    const batch = adminDB.batch();
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    await liveblocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    console.log(error)
  }
}


export async function inviteUserToDocument(roomId: string, email: string) {
  auth.protect();
  const userRef = adminDB.collection("users").doc(email);
  const roomRef = adminDB.collection("documents").doc(roomId);
  const roomDoc = await roomRef.get();
  if (!roomDoc.exists) {
    throw new Error("Document not found");
  }

  await userRef.collection("rooms").doc(roomId).set({
    userId: email,
    role: "editor",
    createdAt: Timestamp.now(),
    roomId,
  });

  return { success: true };
} 

export async function removeUserFromDocument(roomId: string, userId: string) {
    auth.protect(); 
    const userRef = adminDB.collection("users").doc(userId);
    const roomRef = adminDB.collection("documents").doc(roomId);
    const roomDoc = await roomRef.get();
    if (!roomDoc.exists) {
      throw new Error("Document not found");
    }
    await userRef.collection("rooms").doc(roomId).delete();
    return { success: true };
}