import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { getWixServerClient } from "@/lib/wix-client.server";
import { Suspense } from "react";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { products } from "@wix/stores";
import { getLoggedInMember } from "@/wix-api/members";
import CreateProductReviewButton from "@/components/reviews/CreateProductReviewButton";
import ProductReviews, { ProductReviewsLoadingSkeleton } from "./ProductReviews";
import { getProductReviews } from "@/wix-api/reviews";

interface PageProps {
  params: {
    slug: string;
  }
}

export async function generateMetadata({
  params: { slug }
}: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(getWixServerClient(), slug);
  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image;

  return {
    title: product.name,
    description: "Get this product here",
    openGraph: {
      images: mainImage?.url
        ? [
          {
            url: mainImage.url,
            width: mainImage.width,
            height: mainImage.height,
            alt: mainImage.altText || ""
          }
        ] : undefined
    }
  };
}

export default async function Page({
  params: { slug }
}: PageProps) {
  const product = await getProductBySlug(getWixServerClient(), slug);
  if (!product?._id) notFound();

  return (
    <main className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <ProductDetails product={product} />
      <hr />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <hr />
      <div className="space-y-5">
        <h2 className="font-bold text-2xl">
          User Reviews
        </h2>
        <Suspense fallback={<ProductReviewsLoadingSkeleton />}>
          <ProductReviewsSection product={product} />
        </Suspense>
      </div>
    </main>
  );
}

interface RelatedProductsProps {
  productId: string;
}

async function RelatedProducts({ productId }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(
    getWixServerClient(), productId
  );

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-2xl">
        Related Products
      </h2>
      <div className="flex flex-col gap-5 grid-cols-2 lg:grid-cols-4 sm:grid">
        {
          relatedProducts.map((product) => (
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

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 grid-cols-2 lg:grid-cols-4 pt-12 sm:grid">
      {
        Array.from({ length: 4 })
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

interface ProductReviewsSectionProps {
  product: products.Product
}

async function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  if (!product._id) return null;

  const wixClient = getWixServerClient();
  const loggedInMember = await getLoggedInMember(wixClient);
  const existingReview = loggedInMember?.contactId
    ? (await getProductReviews(wixClient, {
        contactId: loggedInMember.contactId,
        productId: product._id
      })).items[0]
    : null;

  return (
    <div className="space-y-5">
      <CreateProductReviewButton
        hasExistingReview={!!existingReview}
        loggedInMember={loggedInMember}
        product={product}
      />
      <ProductReviews product={product} />
    </div>
  );
}
