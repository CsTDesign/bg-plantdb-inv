import { getWixServerClient } from "@/lib/wix-client.server";
import { getProductById } from "@/wix-api/products";
import {
  notFound,
  redirect
} from "next/navigation";

function sanitizeSearchParams(params: any): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const key in params) {
    const value = params[key];
    if (typeof value === 'symbol') {
      continue; 
    }
    sanitized[key] = String(value);
  }

  return sanitized;
}

interface PageProps {
  params: {
    id: string
  };
  searchParams: any;
}

export default async function Page({
  params,
  searchParams
}: PageProps) {
  const sanitizedSearchParams = sanitizeSearchParams(searchParams);
  
  if (params.id === "someId") {
    const queryParams = new URLSearchParams(sanitizedSearchParams).toString();
    redirect(`/products/mum?${queryParams}`);
  }

  const product = await getProductById(getWixServerClient(), params.id);

  if (!product) notFound();

  const queryParams = new URLSearchParams(sanitizedSearchParams).toString();
  redirect(`/products/${product.slug}?${queryParams}`);
}
