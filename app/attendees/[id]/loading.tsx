import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <main>
      <div className="flex w-full h-full">
        <Loader2 className="animate-spin" />
      </div>
    </main>
  );
}
