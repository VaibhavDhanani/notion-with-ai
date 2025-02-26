"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";

const Document = ({ id }: { id: string }) => {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTranstion] = useTransition();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    startTranstion(async () => {
      await updateDoc(doc(db, "documents", id), {
        title: input.trim(),
      });
    });
  };

  if (loading) {
    return (
      <div className="p-2 rounded-md border border-gray-200 animate-pulse bg-gray-100">
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!data || error) return null;

  return (
    <div>
      <div>
        <form onSubmit={updateTitle}>
          <div className="flex max-w-5xl mx-auto items-center space-x-2 pb-5">
            <Input
              value={input}
              type="text"
              placeholder="doc title"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating" : "Update"}{" "}
            </Button>
          </div>
        </form>
      </div>
      <div className="">
    {/* avatar & manageuser */}
      </div>
        {/* Collabrative code editor  */}
    <hr className="pb-10" />
    <Editor />
    </div>
  );
};

export default Document;
