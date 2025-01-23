import { SUPPORT_EMAIL } from "@/lib/constants";
import { orders } from "@wix/ecom";
import { formatDate } from "date-fns"
import Link from "next/link";
import Badge from "./ui/badge";
import { cn } from "@/lib/utils";
import WixImage from "./WixImage";

interface OrderProps {
  order: orders.Order;
}

export default function Order({ order }: OrderProps) {
  const paymentStatusMap: Record<orders.PaymentStatus, string> = {
    [orders.PaymentStatus.PAID]: "Paid",
    [orders.PaymentStatus.NOT_PAID]: "Not paid",
    [orders.PaymentStatus.FULLY_REFUNDED]: "Refunded",
    [orders.PaymentStatus.PARTIALLY_PAID]: "Partially paid",
    [orders.PaymentStatus.PARTIALLY_REFUNDED]: "Partially refunded",
    [orders.PaymentStatus.PENDING]: "Pending",
    [orders.PaymentStatus.UNSPECIFIED]: "No information",
    [orders.PaymentStatus.PENDING_MERCHANT]: "Pending merchant",
    [orders.PaymentStatus.CANCELED]: "Canceled",
    [orders.PaymentStatus.DECLINED]: "Declined"
  };
  const fulfillmentStatusMap: Record<orders.FulfillmentStatus, string> = {
    [orders.FulfillmentStatus.FULFILLED]: "Delivered",
    [orders.FulfillmentStatus.NOT_FULFILLED]: "Not delivered",
    [orders.FulfillmentStatus.PARTIALLY_FULFILLED]: "Partially delivered",
  };

  const paymentStatus = order.paymentStatus
    ? paymentStatusMap[order.paymentStatus]
    : null;
  const fulfillmentStatus = order.fulfillmentStatus
    ? fulfillmentStatusMap[order.fulfillmentStatus]
    : null;

  const shippingDestination = order.shippingInfo?.logistics?.shippingDestination;
  
  return (
    <div className="border p-5 space-y-5 w-full">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="font-bold">
          Order #{order.number}
        </span>
        {
          order._createdDate && (
            <span>
              {
                formatDate(order._createdDate, "MMM d, yyyy")
              }
            </span>
          )
        }
        <Link
          className="hover:underline ms-auto text-sm"
          href={
            `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
              `Order #${order.number} help`
            )}&body=${encodeURIComponent(`
              Help request for order #${order.number}\n\n<Describe your help request>`
            )}`
          }
        >
          Need help?
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="basis-96">
          <div className="space-y-0.5">
            <div className="flex font-semibold gap-3 items-center">
              <span>
                Subtotal: {order.priceSummary?.subtotal?.formattedAmount}
              </span>
              <Badge className={cn(
                "bg-secondary text-secondary-foreground",
                order.paymentStatus === orders.PaymentStatus.NOT_PAID && "bg-red-500 text-white",
                order.paymentStatus === orders.PaymentStatus.PAID && "bg-green-500 text-white"
              )}>
                {paymentStatus || "No information"}
              </Badge>
            </div>
            <div className="font-semibold">
              {fulfillmentStatus || "No information"}
            </div>
          </div>
          <div className="divide-y">
            {
              order.lineItems?.map((item) => (
                <OrderItem
                  item={item}
                  key={item._id}
                />
              ))
            }
          </div>
        </div>
        {
          shippingDestination && (
            <div className="space-y-0.5">
              <div className="font-semibold">
                Delivery address:
              </div>
              <p>
                {shippingDestination.contactDetails?.firstName}{" "}
                {shippingDestination.contactDetails?.lastName}
              </p>
              <p>
                {shippingDestination.address?.streetAddress?.name}{" "}
                {shippingDestination.address?.streetAddress?.number}
              </p>
              <p>
                {shippingDestination.address?.postalCode}{" "}
                {shippingDestination.address?.city}
              </p>
              <p>
                {
                  shippingDestination.address?.subdivision ||
                  shippingDestination.address?.country
                }
              </p>
              <p className="font-semibold">
                {order.shippingInfo?.title}
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
}

interface OrderItemProps {
  item: orders.OrderLineItem;
}

function OrderItem({ item }: OrderItemProps) {
  return (
    <div className="flex flex-wrap gap-3 last:pb-0 py-5">
      <WixImage
        alt={item.productName?.translated || "Product image"}
        className="bg-secondary flex-none"
        height={110}
        mediaIdentifier={item.image}
        width={110}
      />
      <div className="space-y-0.5">
        <p className="font-bold line-clamp-1">
          {item.productName?.translated}
        </p>
        <p>
          {item.quantity} x {item.price?.formattedAmount}
        </p>
        {
          !!item.descriptionLines?.length && (
            <p>
              {
                item.descriptionLines.map(
                  (line) => line.colorInfo?.translated || line.plainText?.translated
                ).join(", ")
              }
            </p>
          )
        }
      </div>
    </div>
  );
}
