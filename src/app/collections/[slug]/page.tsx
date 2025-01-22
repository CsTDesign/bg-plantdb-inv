import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: {
    slug: string
  };
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({
  params: { slug },
  searchParams: { page }
}: PageProps): Promise<Metadata> {
  const collection = await getCollectionBySlug(
    getWixServerClient(), slug
  );
  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;
  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{
        url: banner.url
      }] : []
    }
  };
}

export default async function Page({
  params: { slug },
  searchParams: { page = "1" }
}: PageProps) {
  const collection = await getCollectionBySlug(
    getWixServerClient(), slug
  );
  if (!collection?._id) notFound();
  
  return (
    <div className="space-y-5">
      <h2 className="font-bold text-2xl">
        Products
      </h2>
      <Suspense
        fallback={<LoadingSkeleton />}
        key={page}
      >
        <Products
          collectionId={collection._id}
          page={parseInt(page)}
        />
      </Suspense>
    </div>
  );
}

interface ProductsProps {
  collectionId: string;
  page: number;
}

async function Products({
  collectionId,
  page
}: ProductsProps) {
  const pageSize = 12;
  const collectionProducts = await queryProducts(
    getWixServerClient(), {
      collectionIds: collectionId,
      limit: pageSize,
      skip: (page - 1) * pageSize
    }
  );

  if (!collectionProducts.length) notFound();
  if (page > (collectionProducts.totalPages || 1)) notFound();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-5 grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:grid">
        {
          collectionProducts.items.map((product) => (
            <Product
              key={product._id}
              product={product}
            />
          ))
        }
      </div>
      <PaginationBar
        currentPage={page}
        totalPages={collectionProducts.totalPages || 1}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:grid">
      {
        Array.from({ length: 12 })
          .map((_, i) => (
            <Skeleton
              className="h-[26rem] w-full"
              key={i}
            />
          ))
      }
    </div>
  );
}
