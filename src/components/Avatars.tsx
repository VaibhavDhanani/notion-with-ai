"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { TooltipProvider } from "./ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

const Avatars = () => {
  const otherUsers = useOthers();
  const self = useSelf();
  const allUsers = [self, ...otherUsers];
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-500 font-light">
        currently editing the document
      </p>
      <div className="flex -space-x-5">
        {allUsers.map((other, i) => (
          <TooltipProvider key={other?.id + i}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 hover:z:50">
                  <AvatarImage src={other?.info.avatar} />
                  <AvatarFallback>{other?.info.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self?.id == other?.id ? "You" : other?.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default Avatars;
