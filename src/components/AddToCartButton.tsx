import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { addToCart } from "@/wix-api/cart";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import LoadingButton from "./LoadingButton";
import { useAddItemToCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) {
  const mutation = useAddItemToCart();
  
  return (
    <LoadingButton
      {...props}
      className={cn("flex gap-3", className)}
      loading={mutation.isPending}
      onClick={
        () => mutation.mutate({
          product,
          selectedOptions,
          quantity
        })
      }
    >
      <ShoppingCartIcon />
      Add to Cart
    </LoadingButton>
  );
}
