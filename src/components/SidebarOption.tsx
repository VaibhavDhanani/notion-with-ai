"use client";

import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

const SidebarOption = ({ href, id }: { href: string; id: string }) => {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathName = usePathname();
  const isActive = pathName === href;

  if (loading) {
    return (
      <div className="p-2 rounded-md border border-gray-200 animate-pulse bg-gray-100">
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!data || error) return null;
  
  return (
    <Link
      href={href}
      className={`flex items-center p-2 rounded-md transition-all duration-200 hover:bg-gray-200 ${
        isActive 
          ? "bg-blue-100 border-l-4 border-blue-500 font-medium text-blue-700" 
          : "text-gray-700"
      }`}
    >
      <FileText size={16} className={`mr-2 ${isActive ? "text-blue-500" : "text-gray-500"}`} />
      <p className="truncate text-sm">{data.title || "Untitled Document"}</p>
    </Link>
  );
};

export default SidebarOption;