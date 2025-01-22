"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import Badge from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  checkInStock,
  findVariant
} from "@/lib/utils";
import { products } from "@wix/stores";
import { InfoIcon } from "lucide-react";
import ProductMedia from "./ProductMedia";
import ProductOptions from "./ProductOptions";
import ProductPrice from "./ProductPrice";
import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import BackInStockNotificationButton from "@/components/BackInStockNotificationButton";
import BuyNowButton from "@/components/BuyNowButton";

interface ProductDetailsProps {
  product: products.Product;
}

export default function ProductDetails(
  { product }: ProductDetailsProps
) {
  const [
    quantity,
    setQuantity
  ] = useState(1);
  const [
    selectedOptions,
    setSelectedOptions
  ] = useState<Record<string, string>>(
    product.productOptions?.map((option) => ({
      [option.name || ""]: option.choices?.[0].description || ""
    }))?.reduce((acc, curr) => ({
      ...acc,
      ...curr
    }), {}) || {}
  );

  const selectedVariant = findVariant(product, selectedOptions);
  const inStock = checkInStock(product, selectedOptions);

  const availableQuantity = selectedVariant?.stock?.quantity ?? product.stock?.quantity;
  const availableQuantityExceeded = !!availableQuantity && quantity > availableQuantity;
  
  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === selectedOptions[option.name || ""]
    );
    return selectedChoice?.media?.items ?? [];
  })
  
  return (
    <div className="flex flex-col gap-10 lg:gap-20 md:flex-row">
      <ProductMedia media={
        !!selectedOptionsMedia?.length
          ? selectedOptionsMedia
          : product.media?.items
      } />
      <div className="basis-3/5 space-y-5">
        <div className="space-y-2.5">
          <h1 className="font-bold lg:text-4xl text-3xl">
            {product.name}
          </h1>
          {
            product.brand && (
              <div className="text-muted-foreground">
                {product.brand}
              </div>
            )
          }
          {
            product.ribbon && (
              <Badge className="block">
                {product.ribbon}
              </Badge>
            )
          }
        </div>
        {
          product.description && (
            <div
              className="dark:prose-invert prose"
              dangerouslySetInnerHTML={{
                __html: product.description
              }}
            />
          )
        }
        <ProductPrice
          product={product}
          selectedVariant={selectedVariant}
        />
        <ProductOptions
          product={product}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex gap-2.5 items-center">
            <Input
              className="w-24"
              disabled={!inStock}
              name="quantity"
              onChange={(e) => setQuantity(Number(e.target.value))}
              type="number"
              value={quantity}
            />
            {
              !!availableQuantity && (
                availableQuantityExceeded || availableQuantity < 10
              ) && (
                <span className="text-destructive">
                  Only {availableQuantity} remaining
                </span>
              )
            }
          </div>
        </div>
        {
          inStock ? (
            <div className="flex gap-2.5 items-center">
              <AddToCartButton
                className="w-full"
                disabled={availableQuantityExceeded || quantity < 1}
                product={product}
                quantity={quantity}
                selectedOptions={selectedOptions}
              />
              <BuyNowButton
                disabled={availableQuantityExceeded || quantity < 1}
                product={product}
                quantity={quantity}
                selectedOptions={selectedOptions}
              />
            </div>
          ) : (
            <BackInStockNotificationButton
              className="w-full"
              product={product}
              selectedOptions={selectedOptions}
            />
          )
        }
        {
          !!product.additionalInfoSections?.length && (
            <div className="space-y-1.5 text-muted-foreground text-sm">
              <span className="flex gap-2 items-center">
                <InfoIcon className="size-5" />
                <span>Additional product information</span>
              </span>
              <Accordion type="multiple">
                {
                  product.additionalInfoSections.map((section) => (
                    <AccordionItem
                      key={section.title}
                      value={section.title || ""}
                    >
                      <AccordionTrigger>{section.title}</AccordionTrigger>
                      <AccordionContent>
                        <div
                          className="dark:prose-invert prose text-muted-foreground text-sm"
                          dangerouslySetInnerHTML={{
                            __html: section.description || ""
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))
                }
              </Accordion>
            </div>
          )
        }
      </div>
    </div>
  );
}
