import { formatCurrency } from "@/lib/utils";
import { products } from "@wix/stores";
import Link from "next/link";
import Badge from "./ui/badge";
import WixImage from "./WixImage";
import DiscountBadge from "./DiscountBadge";

interface ProductProps {
  product: products.Product;
}

export default function Product({ product }: ProductProps) {
  const mainImage = product.media?.mainMedia?.image;
  
  return (
    <Link
      className="bg-card border h-full"
      href={`/products/${product.slug}`}
    >
      <div className="overflow-hidden relative">
        <WixImage
          alt={mainImage?.altText}
          className="duration-300 hover:scale-105 transition-transform"
          height={700}
          mediaIdentifier={mainImage?.url}
          width={700}
        />
        <div className="absolute bottom-3 flex flex-wrap gap-2 items-center right-3">
          {
            product.ribbon && <Badge>
              {product.ribbon}
            </Badge>
          }
          {
            product.discount && <DiscountBadge data={product.discount} />
          }
          <Badge className="bg-secondary font-semibold text-secondary-foreground">
            {getFormattedPrice(product)}
          </Badge>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <h3 className="font-bold text-lg">
          {product.name}
        </h3>
        <div
          className="line-clamp-5"
          dangerouslySetInnerHTML={{
            __html: product.description || ""
          }}
        />
      </div>
    </Link>
  );
}

function getFormattedPrice(product: products.Product) {
  const minPrice = product.priceRange?.minValue;
  const maxPrice = product.priceRange?.maxValue;
  
  if (minPrice && maxPrice && minPrice !== maxPrice) {
    return `from ${formatCurrency(minPrice, product.priceData?.currency)}`
  } else {
    return (
      product.priceData?.formatted?.discountedPrice ||
      product.priceData?.formatted?.price ||
      "n/a"
    );
  }
}
