import { getWixServerClient } from "@/lib/wix-client.server";
import { getProductById } from "@/wix-api/products";
import {
  notFound,
  redirect
} from "next/navigation";

interface PageProps {
  params: {
    id: string
  };
  // @ts-expect-error: Temporarily ignore "Unexpected any" error.
  searchParams: any;
}

export default async function Page({
  params,
  searchParams
}: PageProps) { 
  if (params.id === "someId") {
    redirect(`/products/mum?${new URLSearchParams(searchParams)}`);
  }

  const product = await getProductById(getWixServerClient(), params.id);

  if (!product) notFound();

  redirect(`/products/${product.slug}?${new URLSearchParams(searchParams)}`);
}
