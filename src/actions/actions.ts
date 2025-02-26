"use server";

import { adminDB } from "@/lib/firebase-admin";
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

    await adminDB.collection("users")
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
