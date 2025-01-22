import winter from "@/assets/winter.jpg";
import Product from "@/components/Product";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getCollectionBySlug } from "../wix-api/collections";
import { queryProducts } from "../wix-api/products";
import { getWixServerClient } from "@/lib/wix-client.server";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <div className="bg-secondary flex items-center md:h-96">
        <div className="md:w-1/2 p-10 space-y-7 text-center">
          <h1 className="font-bold md:text-4xl text-3xl">
            Where Quality is Foremost since 1971.
          </h1>
          <p>Want to revive your landscaping? Beat the spring-time rush and schedule a 1-on-1 meeting with one of our designers.</p>
          <Button asChild>
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
        <div className="h-full hidden md:block relative w-1/2">
          <Image
            alt="Banner"
            className="h-full object-cover"
            src={winter}
          />
          <div className="absolute bg-gradient-to-r from-secondary inset-0 to-transparent via-transparent" />
        </div>
      </div>
      <p>
        Banner images by{" "}
        <a
          href="https://www.freepik.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Freepik
        </a>.
      </p>
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  const wixClient = getWixServerClient();
  
  const collection = await getCollectionBySlug(wixClient, "featured-products");

  if (!collection?._id) {
    return null;
  }

  const featuredProducts = await queryProducts(
    wixClient, {
      collectionIds: collection._id
    }
  );

  if (!featuredProducts.items.length) {
    return null;
  }
  
  return (
    <div className="space-y-5">
      <h2 className="font-bold text-2xl">
        Native to Missouri
      </h2>
      <div className="flex flex-col gap-5 grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:grid">
        {
          featuredProducts.items.map((product) => (
            <Product
              key={product._id}
              product={product}
            />
          ))
        }
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 grid-cols-2 lg:grid-cols-4 md:grid-cols-3 pt-12 sm:grid">
      {
        Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            className="h-[26rem] w-full"
            key={i}
          />
        ))
      }
    </div>
  );
}
