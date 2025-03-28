"use client";
import { db } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react";
import { collectionGroup, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

const useOwner = () => {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = React.useState(false);
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  useEffect(() => {
    if (usersInRoom?.docs && usersInRoom.docs.length > 0) {
      const owners = usersInRoom.docs.filter(
        (doc) => doc.data().role === "owner"
      );
      if (
        owners.some(
          (owner) =>
            owner.data().userId === user?.emailAddresses[0].emailAddress
        )
      ) {
        setIsOwner(true);
      }
    }
  }, [user, usersInRoom]);
  return isOwner;
};

export default useOwner;
