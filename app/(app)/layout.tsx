import Navbar from "@/app/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children} <Toaster position="top-center" />
    </div>
  );
}
