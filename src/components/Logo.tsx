import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.PNG"
      alt="EA_DUBEA'S GIFT HUB"
      width={1024}
      height={1536}
      priority
      className={cn("h-16 w-auto object-contain", className)}
    />
  );
}
