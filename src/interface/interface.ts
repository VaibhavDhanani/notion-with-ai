import { DocumentData } from "firebase/firestore";

export interface RoomDocument extends DocumentData {
    roomId: string;
    userId: string;
    role: "owner" | "editor" | "viewer";
    createdAt: string;
  }