"use client";
import React, { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/hooks/useOwner";
import { useRoom } from "@liveblocks/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { collectionGroup, query, where } from "firebase/firestore";
import { toast } from "sonner";
import { removeUserFromDocument } from "@/actions/actions";

const ManageUsers = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTranstion] = useTransition();
  const { user } = useUser();
  const isOwner = useOwner();
  const room = useRoom();
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleRemoveUser = (userId: string) => {
    startTranstion(async () => {
      if(!user) return;

      const {success} = await removeUserFromDocument(room.id, userId);
        if(success){
            toast.success(`Successfully removed ${userId}`);
        }
        else{
            toast.error("Failed to remove user");
        }
    });
    // setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is the list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>
        <hr className="my-2" />
        <div>
          {usersInRoom?.docs.map((doc) => (
            <div
              key={doc.data().userId}
              className="flex justify-between items-center  py-2"
            >
              <p className="font-semibold text-ellipsis text-pretty">
                {doc.data().userId === user?.emailAddresses[0].emailAddress
                  ? "You"
                  : doc.data().userId}
              </p>
              <div>
                <Button variant={"outline"} className="mx-2 gap-2">{doc.data().role}</Button>
                {isOwner && doc.data().userId != user?.emailAddresses[0].emailAddress &&  (
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveUser(doc.data().userId)}
                    disabled={isPending}
                    size={"sm"}
                  >
                    {isPending ? "Removing" : "X"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUsers;
