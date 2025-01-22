import DiscountBadge from "@/components/DiscountBadge";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";

interface ProductPriceProps {
  product: products.Product;
  selectedVariant: products.Variant | null;
}

export default function ProductPrice({
  product, selectedVariant
}: ProductPriceProps) {
  const priceData = selectedVariant?.variant?.priceData || product.priceData;
  if (!priceData) return null;

  const hasDiscount = priceData.discountedPrice !== priceData.price;

  return (
    <div className="flex font-bold gap-2.5 items-center text-xl">
      <span className={cn(
        hasDiscount && "line-through text-muted-foreground"
      )}>
        {priceData.formatted?.price}
      </span>
      {
        hasDiscount && <span>
          {priceData.formatted?.discountedPrice}
        </span>
      }
      {
        product.discount && <DiscountBadge data={product.discount} />
      }
    </div>
  );
}
