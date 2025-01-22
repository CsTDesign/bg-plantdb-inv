import { Loader2 } from "lucide-react";
import {
  Button,
  ButtonProps
} from "./ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      className={cn("flex gap-2 items-center", className)}
      disabled={loading || disabled}
    >
      {loading && <Loader2 className="animate-spin size-5" />}
      {props.children}
    </Button>
  );
}
