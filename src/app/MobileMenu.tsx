"use client";

import SearchField from "@/components/SearchField";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import UserButton from "@/components/UserButton";
import { twConfig } from "@/lib/utils";
import { members } from "@wix/members";
import { collections } from "@wix/stores";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import {
  usePathname,
  useSearchParams
} from "next/navigation";
import {
  useEffect,
  useState
} from "react";

interface MobileMenuProps {
  collections: collections.Collection[];
  loggedInMember: members.Member | null;
}

export default function MobileMenu({
  collections,
  loggedInMember
}: MobileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [
    isOpen,
    setIsOpen
  ] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > parseInt(twConfig.theme.screens.lg)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <Button
        className="inline-flex lg:hidden"
        onClick={() => setIsOpen(true)}
        size="icon"
        variant="ghost"
      >
        <MenuIcon />
      </Button>
      <Sheet
        onOpenChange={setIsOpen}
        open={isOpen}
      >
        <SheetContent
          className="w-full"
          side="left"
        >
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center py-10 space-y-10">
            <SearchField className="w-full" />
            <ul className="space-y-5 text-center text-lg">
              <li>
                <Link
                  className="font-semibold hover:underline"
                  href="/shop"
                >
                  Shop
                </Link>
              </li>
              {
                collections.map((collection) => (
                  <li key={collection._id}>
                    <Link
                      className="font-semibold hover:underline"
                      href={`/collections/${collection.slug}`}
                    >
                      {collection.name}
                    </Link>
                  </li>
                ))
              }
            </ul>
            <UserButton loggedInMember={loggedInMember} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
