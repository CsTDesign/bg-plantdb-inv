import { products } from "@wix/stores";
import {
  Button,
  ButtonProps
} from "./ui/button";
import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";
import { z } from "zod";
import { requiredString } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";
import { env } from "@/env";

const formSchema = z.object({
  email: requiredString.email(),
});

type FormValues = z.infer<typeof formSchema>;

interface BackInStockNotificationButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

export default function BackInStockNotificationButton(
  { product, selectedOptions, ...props }: BackInStockNotificationButtonProps
) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  
  const mutation = useCreateBackInStockNotificationRequest();

  async function onSubmit({ email }: FormValues) {
    mutation.mutate({
      email,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
      product,
      selectedOptions
    });
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>
          Notify when available
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify when available</DialogTitle>
          <DialogDescription>
            Please enter your email to receive notifications when this product is available:
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />
            <LoadingButton
              loading={mutation.isPending}
              type="submit"
            >
              Notify me
            </LoadingButton>
          </form>
        </Form>
        {
          mutation.isSuccess && (
            <div className="py-2.5 text-green-500">
              Thank you! We will notify you when product is available.
            </div>
          )
        }
      </DialogContent>
    </Dialog>
  );
}
