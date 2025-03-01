import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";

export type User = {
  fullName: string;
  email: string;
  image: string;
};

export type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};
