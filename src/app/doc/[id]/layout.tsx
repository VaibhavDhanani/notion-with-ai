import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import React, { use } from "react";
import { Params } from "./page";

const DocLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) => {
    const unwrappedParams: Params = use(params);
      const { id } = unwrappedParams;
    
  auth.protect();
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
