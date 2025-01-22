"use client";

import CheckoutButton from "@/components/CheckoutButton";
import { Button } from "@/components/ui/button";
import {
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import WixImage from "@/components/WixImage";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity
} from "@/hooks/cart";
import { currentCart } from "@wix/ecom";
import {
  Loader2,
  ShoppingCartIcon,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ShoppingCartButtonProps {
  initialData: currentCart.Cart | null;
}

export default function ShoppingCartButton(
  { initialData }: ShoppingCartButtonProps
) {
  const [
    sheetOpen,
    setSheetOpen
  ] = useState(false);
  
  const cartQuery = useCart(initialData);
  const totalQuantity = cartQuery.data?.lineItems?.reduce(
    (acc, item) => acc + (item.quantity || 0), 0
  ) || 0;

  return (
    <>
      <div className="relative">
        <Button
          onClick={() => setSheetOpen(true)}
          size="icon"
          variant="ghost"
        >
          <ShoppingCartIcon />
          <span className="absolute bg-primary flex items-center justify-center right-0 rounded-full size-5 text-primary-foreground text-xs top-0">
            {totalQuantity < 10 ? totalQuantity : "9+"}
          </span>
        </Button>
      </div>
      <Sheet
        onOpenChange={setSheetOpen}
        open={sheetOpen}
      >
        <SheetContent className="flex flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              Your cart{" "}
              <span className="text-base">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col grow overflow-y-auto pt-1 space-y-5">
            <ul className="space-y-5">
              {
                cartQuery.data?.lineItems?.map((item) => (
                  <ShoppingCartItem
                    item={item}
                    key={item._id}
                    onProductLinkClicked={() => setSheetOpen(false)}
                  />
                ))
              }
            </ul>
            {
              cartQuery.isPending && (
                <Loader2 className="animate-spin mx-auto" />
              )
            }
            {
              cartQuery.error && (
                <p className="text-destructive">
                  {cartQuery.error.message}
                </p>
              )
            }
            {
              !cartQuery.isPending &&
              !cartQuery.data?.lineItems?.length && (
                <div className="flex grow items-center justify-center text-center">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-lg">
                      Your cart is empty.
                    </p>
                    <Link
                      className="hover:underline text-primary"
                      href="/shop"
                      onClick={() => setSheetOpen(false)}
                    >
                      Start shopping now
                    </Link>
                  </div>
                </div>
              )
            }
          </div>
          <hr />
          <div className="flex gap-5 items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm">Subtotal:</p>
              <p className="font-bold">
                {/* @ts-expect-error: subtotal is optional */}
                {cartQuery.data?.subtotal?.formattedConvertedAmount}
              </p>
              <p className="text-muted-foreground text-xs">
                Price before sales tax and/or shipping
              </p>
            </div>
            <CheckoutButton
              disabled={!totalQuantity || cartQuery.isFetching}
              size="lg"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface ShoppingCartItemProps {
  item: currentCart.LineItem;
  onProductLinkClicked: () => void;
}

function ShoppingCartItem(
  { item, onProductLinkClicked }: ShoppingCartItemProps
) {
  const updateQuantityMutation = useUpdateCartItemQuantity();
  
  const removeItemMutation = useRemoveCartItem();
  
  const productId = item._id;
  if (!productId) return null;

  const slug = item.url?.split("/").pop();

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <li className="flex gap-3 items-center">
      <div className="flex-none relative size-fit">
        <Link
          href={`/products/${slug}`}
          onClick={onProductLinkClicked}
        >
          <WixImage
            alt={item.productName?.translated || "Product image"}
            className="bg-secondary flex-none"
            height={110}
            mediaIdentifier={item.image}
            width={110}
          />
        </Link>
        <button
          className="absolute bg-background border p-0.5 -right-1 rounded-full -top-1"
          onClick={() => removeItemMutation.mutate(productId)}
        >
          <X className="size-3" />
        </button>
      </div>
      <div className="space-y-1.5 text-xl">
        <Link
          href={`/products/${slug}`}
          onClick={onProductLinkClicked}
        >
          <p className="font-bold">
            {item.productName?.translated || "Item"}
          </p>
        </Link>
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
        <div className="flex gap-2 items-center">
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {
            item.fullPrice &&
              item.fullPrice.amount !== item.price?.amount && (
                <span className="line-through text-muted-foreground">
                  {item.fullPrice.formattedConvertedAmount}
                </span>
              )
          }
        </div>
        <div className="flex gap-1.5 items-center">
          <Button
            disabled={item.quantity === 1}
            onClick={() => updateQuantityMutation.mutate({
              productId,
              newQuantity: !item.quantity ? 0 : item.quantity - 1
            })}
            size="sm"
            variant="outline"
          >
            -
          </Button>
          <span>
            {item.quantity}
          </span>
          <Button
            disabled={quantityLimitReached}
            onClick={() => updateQuantityMutation.mutate({
              productId,
              newQuantity: !item.quantity ? 1 : item.quantity + 1
            })}
            size="sm"
            variant="outline"
          >
            +
          </Button>
          {
            quantityLimitReached && <span>Quantity limit reached</span>
          }
        </div>
      </div>
    </li>
  );
}
