"use client";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import React from "react";

const LiveBlocksProvider = ({ children }: { children: React.ReactNode }) => {
  if (!process.env.NEXT_PUBLIC_LIVE_BLOCKS_KEY) {
    throw new Error("NEXT_PUBLIC_LIVE_BLOCKS_KEY not found");
  }
  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/auth-endpoint"}>
      {children}
    </LiveblocksProvider>
  );
};

export default LiveBlocksProvider;
