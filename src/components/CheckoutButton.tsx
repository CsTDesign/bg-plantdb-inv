import { useCartCheckout } from "@/hooks/checkout";
import { ButtonProps } from "./ui/button";
import LoadingButton from "./LoadingButton";

export default function CheckoutButton(props: ButtonProps) {
  const {
    startCheckoutFlow,
    pending
  } = useCartCheckout();

  return (
    <LoadingButton
      loading={pending}
      onClick={startCheckoutFlow}
      {...props}
    >
      Checkout
    </LoadingButton>
  );
}
