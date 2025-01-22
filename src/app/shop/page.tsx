import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getWixServerClient } from "@/lib/wix-client.server";
import { ProductsSort, queryProducts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
    collection?: string[];
    price_min?: string;
    price_max?: string;
    sort?: string;
  }
}

export function generateMetadata({
  searchParams: { q }
}: PageProps) {
  return {
    title: q ? `Search results: "${q}"` : "Products"
  };
}

export default async function Page({
  searchParams: {
    q,
    page = "1",
    collection: collectionIds,
    price_min,
    price_max,
    sort
  }
}: PageProps) {
  const title = q ? `Search results: "${q}"` : "Products";

  return (
    <div className="space-y-10">
      <h1 className="font-bold md:text-4xl text-3xl text-center">
        {title}
      </h1>
      <Suspense
        fallback={<LoadingSkeleton />}
        key={`${q}-${page}`}
      >
        <ProductResults
          collectionIds={collectionIds}
          page={parseInt(page)}
          priceMax={
            price_max ? parseInt(price_max) : undefined
          }
          priceMin={
            price_min ? parseInt(price_min) : undefined
          }
          q={q}
          sort={sort as ProductsSort}
        />
      </Suspense>
    </div>
  );
}

interface ProductResultsProps {
  q?: string;
  page: number;
  collectionIds?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: ProductsSort;
}

async function ProductResults({
  q,
  page,
  collectionIds,
  priceMin,
  priceMax,
  sort
}: ProductResultsProps) {
  const pageSize = 12;
  const products = await queryProducts(getWixServerClient(), {
    q,
    limit: pageSize,
    skip: (page - 1) * pageSize,
    collectionIds,
    priceMin,
    priceMax,
    sort
  });

  if (page > (products.totalPages || 1)) notFound();

  return (
    <div className="group-has-[[data-pending]]:animate-pulse space-y-10">
      <p className="text-center text-xl">
        {products.totalCount}{" "}
        {products.totalCount === 1 ? "product" : "products"} found
      </p>
      <div className="2xl:grid-cols-4 flex flex-col gap-5 grid-cols-2 sm:grid xl:grid-cols-3">
        {
          products.items.map((product) => (
            <Product
              key={product._id}
              product={product}
            />
          ))
        }
      </div>
      <PaginationBar
        currentPage={page}
        totalPages={products.totalPages || 1}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-9 mx-auto w-52" />
      <div className="2xl:grid-cols-4 flex flex-col gap-5 grid-cols-2 sm:grid xl:grid-cols-3">
        {
          Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              className="h-[26rem]"
              key={i}
            />
          ))
        }
      </div>
    </div>
  );
}
