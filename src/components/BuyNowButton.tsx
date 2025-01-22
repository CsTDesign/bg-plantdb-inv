import { products } from "@wix/stores";
import { ButtonProps } from "./ui/button";
import { useQuickBuy } from "@/hooks/checkout";
import LoadingButton from "./LoadingButton";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyNowButtonProps extends ButtonProps {
  product: products.Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export default function BuyNowButton({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowButtonProps) {
  const {
    startCheckoutFlow,
    pending
  } = useQuickBuy();

  return (
    <LoadingButton
      className={cn("flex gap-3", className)}
      loading={pending}
      onClick={() => startCheckoutFlow({
        product,
        quantity,
        selectedOptions
      })}
      variant="secondary"
      {...props}
    >
      <CreditCard />
      Buy Now
    </LoadingButton>
  );
}

