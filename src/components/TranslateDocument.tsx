"use client";
import { FormEvent, useState, useTransition } from "react";
import * as Y from "yjs";
import {
    Dialog, DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";

type Language =
  | "english"
  | "spanish"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "portuguese"
  | "bengali"
  | "russion"
  | "japanese";

const languages: Language[] = [
  "english",
  "spanish",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "portuguese",
  "bengali",
  "russion",
  "japanese",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTranstion] = useTransition();
  const [language, setLanguage] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    startTranstion(async () => {
      toast.info("Translating the document...");
      const documentData = doc.get("document-store").toJSON();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/translate-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLanguage: language,
          }),
        }
      );
      if (res.ok) {
        const {translated_text} = await res.json();
        console.log(translated_text)
        setSummary(translated_text);
        toast.success("Document translated successfully");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the Document !!!</DialogTitle>
          <DialogDescription>
            Select a language and AI will generate the summary of this document
            in the selected language.
          </DialogDescription>
          <hr className="mt-5" />
        </DialogHeader>
        {summary && (
            <div className="flex flex-col items-startmax-h-96 overflow-y-scroll gap-2p-5 bg-gray-100">
                <div className="flex">
                    <BotIcon className="w-10 flex-shrink-0" />
                    <p className="font-semibold">
                        GPT {isPending ? "is thinking..." : "Says"}
                    </p>
                </div>
                <p>{isPending ? "Thinking ..." : <Markdown>{summary}</Markdown>}</p>
            </div>
        )}
        <form className="flex gap-2 p-2" onSubmit={handleAskQuestion}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent className="h-60" side="bottom">
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <DialogFooter className="sm:flex sm:justify-end gap-2 ">
            <Button type="submit" variant={"default"} disabled={!language || isPending}>
              {isPending ? "Translating..." : "Translate"}
            </Button>
          </DialogFooter>
        </form>
        
      </DialogContent>
    </Dialog>
  );
};

export default TranslateDocument;
