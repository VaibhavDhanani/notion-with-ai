"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { createNewDocument } from "@/actions/actions";
import { useRouter } from "next/navigation";

const NewDocumentButton = () => {
  const [isPending,startTransition] = useTransition();
  const router= useRouter();

  const handleCreateNewDocument = () => {
    startTransition(async ()=>{
      const {documentId} = await createNewDocument();
      router.push(`/documents/${documentId}`);
    })
  
  }
  return (
    <div>
      <Button onClick={handleCreateNewDocument} disabled={isPending} >
        {isPending ? "Creating..." : "New Document"}
      </Button>
    </div>
  );
};

export default NewDocumentButton;
