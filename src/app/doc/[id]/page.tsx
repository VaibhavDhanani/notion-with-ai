"use client";
import Document from "@/components/Document";
import React, { use } from "react";

export type Params = {
  id: string;
};

// This is the page that will be rendered when the user navigates to /doc/[id]

const DocumentPage = ({ params }: { params: Promise<Params> }) => {
  const unwrappedParams: Params = use(params);
  const { id } = unwrappedParams;

  return (
    <div className="flex flex-1 flex-col max-h-screen">
      <Document id={id} />
    </div>
  );
};

export default DocumentPage;
