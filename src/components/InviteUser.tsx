"use client";
import React, { FormEvent, useTransition } from "react";
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
import { usePathname } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const InviteUser = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTranstion] = useTransition();
  const pathName = usePathname();
  const [email, setEmail] = React.useState("");

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    const roomId = pathName.split("/").pop();
    if (!roomId) {
      return;
    }

    startTranstion(async () => {
      const success = await inviteUserToDocument(roomId,email);

      if (success) {
        setIsOpen(false);
        toast.success(`Successfully invited ${email}`);
        setEmail("");
      } else {
        toast.error("Failed to invite user");
      }
    });
  };
  return (
    
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
      <DialogTrigger>Invite</DialogTrigger>
    </Button>
    <DialogContent>
      <form className="grid py-2" onSubmit={handleInvite}>
        <DialogHeader>
          <DialogTitle>Invite user to collaborate !!!</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite to collaborate on
            this document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-8 items-center gap-4 my-2">
          <Label htmlFor="email" className="text-left">
            Email
          </Label>
          <Input
            id="inputEmail"
            type="email"
            value={email}
            className="col-span-6"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <DialogFooter className="sm:flex sm:justify-end gap-2 ">
          <Button
            type="submit"
            variant={"outline"}
            disabled={!email || isPending}
          >
            {isPending ? "Inviting" : "Invite"}
          </Button>
          <DialogClose asChild>
            <Button variant={"secondary"} type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
    
  );
};

export default InviteUser;
