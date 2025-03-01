"use client";
import { FormEvent, useState, useTransition } from "react";
import * as Y from "yjs";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { BotIcon, MessageCircleQuestion } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { Input } from "./ui/input";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTranstion] = useTransition();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    startTranstion(async () => {
      toast.info("Asking the AI...");
      const documentData = doc.get("document-store").toJSON();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/chat-to-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            question,
          }),
        }
      );
      if (res.ok) {
        const { message } = await res.json();
        console.log(message);
        setQuestion("");
        setAnswer(message);
        toast.success("AI generated the answer");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MessageCircleQuestion />
          Chat
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with document !!!</DialogTitle>
          <DialogDescription>
            Ask the question related to this document and get the answer from
            AI.
          </DialogDescription>
          <hr className="mt-5" />
          {/* {question && <p className="mt-5 text-gray-700">{question}</p>} */}
        </DialogHeader>
        {answer && (
          <div className="flex flex-col items-startmax-h-96 overflow-y-scroll gap-2p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-semibold">
                GPT {isPending ? "is thinking..." : "Says"}
              </p>
            </div>
            <p>{isPending ? "Thinking ..." : <Markdown>{answer}</Markdown>}</p>
          </div>
        )}
        <form
          className="flex flex-col sm:flex-row gap-2 p-2"
          onSubmit={handleAskQuestion}
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            placeholder="Ask a question"
            className="w-full"
          />

          <div className="flex justify-end mt-2 sm:mt-0">
            <Button
              type="submit"
              variant={"default"}
              disabled={!question || isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Thinking..." : "Ask"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatToDocument;
