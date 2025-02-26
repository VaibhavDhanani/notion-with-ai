import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
    <main>
      <div className="flex items-center space-x-2 animate-pulse">
        <ArrowLeftCircle size={30} />
        <h1 className="font-bold">Get started with creating a new document</h1>
      </div>
    </main>
  );
}
