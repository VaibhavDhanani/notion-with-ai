"use client";
import React, { useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument } from "@/actions/actions";
import { toast } from "sonner";

const DeleteDocument = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending,startTranstion] = useTransition();
    const pathName = usePathname();
    const router = useRouter();

  const handleDelete =async  () =>{
    const roomId = pathName.split("/").pop();
    if(!roomId){return}

    startTranstion(async () => {
        const success = await deleteDocument(roomId);

        if(success){
            setIsOpen(false);
            router.replace("/");
            toast.success("Document Deleted successfully");
        } else {
            toast.error("Failed to delete document");
        }
    })

  }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="destructive">
          <DialogTrigger>Delete</DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete ?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:flex sm:justify-end gap-2">
            <Button type="button" variant={"destructive"} onClick={handleDelete} disabled={isPending}>Confirm</Button>
            <DialogClose asChild>
                <Button variant={"secondary"} type="button" >Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteDocument;
