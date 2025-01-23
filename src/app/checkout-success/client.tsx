"use client";

import { useSearchParams } from "next/navigation";
import Page from "./page";

export default function ClientPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");

  return (
    <div>
      {
        orderId ? (
          <Page searchParams={
            { orderId }
          } />
        ) : (
          <p>Order ID not found</p>
        )
      }
    </div>
  );
}
