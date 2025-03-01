// Sidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import NewDocumentButton from "./NewDocumentButton";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  collectionGroup,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import SidebarOption from "./SidebarOption";
import { RoomDocument } from "@/interface/interface";



const Sidebar = () => {
  const { user } = useUser();
  const [groupedData, setGroupData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
    viewer: RoomDocument[];
  }>({
    owner: [],
    editor: [],
    viewer: [],
  });
  
  const [data, loading, error] = useCollection(
    user &&
    query(
      collectionGroup(db, "rooms"),
      where("userId", "==", user.emailAddresses[0].emailAddress)
    )
  );

  useEffect(() => {
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
      viewer: RoomDocument[];
    }>(
      (acc, current) => {
        const roomData = current.data() as RoomDocument;
        acc[roomData.role].push({ id: current.id, ...roomData });
        return acc;
      },
      {
        owner: [],
        editor: [],
        viewer: [],
      }
    );

    setGroupData(grouped);
  }, [data]);

  const menuOptions = (
    <div className="flex flex-col space-y-6">
      <div className="space-y-2">
        <NewDocumentButton />
      </div>
      
      {/* My Documents */}
      <div className="space-y-3">
        <h2 className="text-gray-600 text-xs font-bold uppercase tracking-wider px-1">
          My Documents
        </h2>
        <div className="space-y-1">
          {groupedData.owner.length === 0 ? (
            <p className="text-gray-500 text-sm italic px-1">No documents found</p>
          ) : (
            groupedData.owner.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))
          )}
        </div>
      </div>

      {/* Shared with Me */}
      {(groupedData.editor.length > 0 || groupedData.viewer.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-gray-600 text-xs font-bold uppercase tracking-wider px-1">
            Shared With Me
          </h2>
          <div className="space-y-1">
            {groupedData.editor.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
            {groupedData.viewer.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-2 rounded-md border border-gray-200 animate-pulse bg-gray-100">
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!data || error) return null;
  
  return (
    <div className="p-3 md:p-5 bg-gray-100 border-r h-screen overflow-y-auto">
      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
              <MenuIcon size={24} />
            </div>
          </SheetTrigger>
          <SheetContent side={"left"} className="max-w-xs w-full">
            <div>{menuOptions}</div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:block">
        {menuOptions}
      </div>
    </div>
  );
};

export default Sidebar;

