import { Skeleton } from "@/components/ui/skeleton";
import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string
  };
}

export default function Layout({
  children,
  params
}: LayoutProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CollectionsLayout params={params}>
        {children}
      </CollectionsLayout>
    </Suspense>
  );
}

async function CollectionsLayout({
  children,
  params: { slug }
}: LayoutProps) {
  const collection = await getCollectionBySlug(getWixServerClient(), slug);
  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return (
    <main className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <div className="flex flex-col gap-10">
        {
          banner && (
            <div className="hidden relative sm:block">
              <WixImage
                alt={banner.altText}
                height={400}
                mediaIdentifier={banner.url}
                width={1280}
              />
              <div className="absolute bg-gradient-to-b from-transparent inset-0 to-black via-transparent" />
              <h1 className="absolute bottom-10 font-bold left-1/2 lg:text-5xl text-4xl text-white -translate-x-1/2">
                {collection.name}
              </h1>
            </div>
          )
        }
        <h1 className={cn(
          "font-bold md:text-4xl mx-auto text-3xl",
          banner && "sm:hidden"
        )}>
          {collection.name}
        </h1>
      </div>
      {children}
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <Skeleton className="h-10 mx-auto sm:aspect-[1280/400] sm:block sm:h-full sm:w-full w-48" />
      <div className="space-y-5">
        <h2 className="font-bold text-2xl">
          Products
        </h2>
        <div className="flex flex-col gap-5 grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:grid">
          {
            Array.from({ length: 8 })
              .map((_, i) => (
                <Skeleton
                  className="h-[26rem] w-full"
                  key={i}
                />
              ))
          }
        </div>
      </div>
    </main>
  );
}
