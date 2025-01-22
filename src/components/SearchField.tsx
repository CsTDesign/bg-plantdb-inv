"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

interface SearchFieldProps {
  className?: string;
}

export default function SearchField({ className }: SearchFieldProps) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();

    if (!q) return;

    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }
  
  return (
    <form
      action="/shop"
      className={cn("grow", className)}
      method="GET"
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <Input
          className="pe-10"
          name="q"
          placeholder="Search"
        />
        <SearchIcon className="absolute right-3 size-5 text-muted-foreground top-1/2 transform -translate-y-1/2" />
      </div>
    </form>
  );
}
