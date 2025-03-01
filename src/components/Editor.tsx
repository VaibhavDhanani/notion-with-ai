"use client";

import { useRoom } from "@liveblocks/react";
import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { EditorProps } from "@/types/types";
import { useSelf } from "@liveblocks/react/suspense";
import stringToColor from "@/lib/stringToColor";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

const BlockNote = ({ doc, provider, darkMode }: EditorProps) => {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,

      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),

      // Information for this user:
      user: {
        name: userInfo?.name || "Anonymous",
        color: stringToColor(userInfo?.name || "Anonymous"),
      },
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto my-4">
      <BlockNoteView
        editor={editor}
        className="min-h-screen"
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};



const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);
    return () => {
      yProvider?.destroy();
      yDoc?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-end gap-3">
        {/* AI chat and translate */}
        <TranslateDocument doc={doc} />
        <ChatToDocument doc={doc} />
        {/* <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button> */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
};

export default Editor;
