import { adminDB } from "@/lib/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  auth.protect();
  const { sessionClaims } = await auth();
  const { room } = await req.json();

  if (!sessionClaims?.email) {
    return NextResponse.json(
      { message: "Session email is missing" },
      { status: 400 }
    );
  }
  const session = liveblocks.prepareSession(sessionClaims.email, {
    userInfo: {
      name: sessionClaims?.fullName,
      email: sessionClaims?.email,
      avatar: sessionClaims?.image,
    },
  });

  const usersInRoom = await adminDB
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new NextResponse(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not authorized to access this room" },
      { status: 403 }
    );
  }
}
