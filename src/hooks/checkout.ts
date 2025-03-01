import { useState } from "react";
import { useToast } from "./use-toast";
import {
  getCheckoutUrlForCurrentCart,
  getCheckoutUrlForProduct,
  GetCheckoutUrlForProductValues
} from "@/wix-api/checkout";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useCartCheckout() {
  const { toast } = useToast();
  const [
    pending,
    setPending
  ] = useState(false);

  async function startCheckoutFlow() {
    setPending(true);

    try {
      const checkoutUrl = await getCheckoutUrlForCurrentCart(wixBrowserClient);
      window.location.href = checkoutUrl;
    } catch (error) {
      setPending(false);
      console.error(error);
      toast({
        variant: "destructive",
        description: "This feature is not available."
      });
    }
  }

  return {
    startCheckoutFlow,
    pending
  };
}

export function useQuickBuy() {
  const { toast } = useToast();
  const [
    pending,
    setPending
  ] = useState(false);

  async function startCheckoutFlow(values: GetCheckoutUrlForProductValues) {
    setPending(true);

    try {
      const checkoutUrl = await getCheckoutUrlForProduct(wixBrowserClient, values);
      window.location.href = checkoutUrl;
    } catch (error) {
      setPending(false);
      console.error(error);
      toast({
        variant: "destructive",
        description: "This feature is not available."
      });
    }
  }

  return {
    startCheckoutFlow,
    pending
  };
}
