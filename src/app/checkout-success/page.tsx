import Order from "@/components/Order";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { getOrder } from "@/wix-api/orders";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClearCart from "./ClearCart";

export const metadata: Metadata = {
  title: "Checkout success"
};

interface PageProps {
  searchParams: {
    orderId: string
  };
}

export default async function Page({
  searchParams: { orderId }
}: PageProps) {
  const wixClient = getWixServerClient();
  const [
    order,
    loggedInMember
  ] = await Promise.all([
    getOrder(wixClient, orderId),
    getLoggedInMember(wixClient)
  ]);

  if (!order) {
    notFound();
  }

  const orderCreatedDate = order._createdDate
    ? new Date(order._createdDate)
    : null;
  
  return (
    <main className="flex flex-col items-center max-w-3xl mx-auto px-5 py-10 space-y-5">
      <h1 className="font-bold text-3xl text-primary">
        Order processed!
      </h1>
      <p>Please check your email for order summary.</p>
      <h2 className="font-bold text-2xl">
        Order Details
      </h2>
      <Order order={order} />
      {
        loggedInMember && (
          <Link
            className="block hover:underline text-primary"
            href="/profile"
          >
            View All Orders
          </Link>
        )
      }
      {
        orderCreatedDate && orderCreatedDate.getTime() > Date.now() - 60_000 * 5 && <ClearCart />
      }
    </main>
  );
}
