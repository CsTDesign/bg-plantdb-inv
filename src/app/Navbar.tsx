import { Trees } from "lucide-react";
import Link from "next/link";
import { getCart } from "../wix-api/cart";
import { getWixServerClient } from "@/lib/wix-client.server";
import ShoppingCartButton from "./ShoppingCartButton";
import UserButton from "@/components/UserButton";
import { getLoggedInMember } from "@/wix-api/members";
import { getCollections } from "@/wix-api/collections";
import MainNavigation from "./MainNavigation";
import SearchField from "@/components/SearchField";
import MobileMenu from "./MobileMenu";
import { Suspense } from "react";

export default async function Navbar() {
  const wixClient = getWixServerClient();
  const [cart, loggedInMember, collections] = await Promise.all([
    getCart(wixClient),
    getLoggedInMember(wixClient),
    getCollections(wixClient)
  ]);
  
  return (
    <header className="bg-background shadow-sm">
      <div className="flex gap-5 items-center justify-between max-w-7xl mx-auto p-5">
        <Suspense>
          <MobileMenu
            collections={collections}
            loggedInMember={loggedInMember}
          />
        </Suspense>
        <div className="flex flex-wrap gap-5 items-center">
          <Link
            className="flex gap-4 items-center"
            href="/"
          >
            <Trees className="h-16 text-green-700 w-16" />
            <span className="font-bold text-xl">
              Baxter Gardens Nurser-E
            </span>
          </Link>
          <MainNavigation
            className="hidden lg:flex"
            collections={collections}
          />
        </div>
        <SearchField className="hidden lg:inline max-w-96" />
        <div className="flex gap-5 items-center justify-center">
          <UserButton
            className="hidden lg:inline-flex"
            loggedInMember={loggedInMember}
          />
          <ShoppingCartButton initialData={cart} />
        </div>
      </div>
    </header>
  );
}
