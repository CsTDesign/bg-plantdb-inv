import { products } from "@wix/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductReview } from "@/hooks/reviews";
import { Label } from "../ui/label";
import WixImage from "../WixImage";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../LoadingButton";
import StarRatingInput from "./StarRatingInput";
import { useRef } from "react";
import { Button } from "../ui/button";
import { CircleAlert, ImageUp, Loader2, X } from "lucide-react";
import useMediaUpload, { MediaAttachment } from "./useMediaUpload";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Must have at least 5 characters")
    .max(100, "Cannot have more than 100 characters")
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, "Must have at least 10 characters")
    .max(3000, "Cannot have more than 3000 characters")
    .or(z.literal("")),
  rating: z.number().int().min(1, "Please rate this product")
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProductReviewDialogProps {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

export default function CreateProductReviewDialog({
  product,
  open,
  onOpenChange,
  onSubmitted
}: CreateProductReviewDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      rating: 0
    }
  });

  const mutation = useCreateProductReview();
  const {
    attachments,
    startUpload,
    removeAttachment,
    clearAttachments
  } = useMediaUpload();
  const router = useRouter();

  async function onSubmit({
    title,
    body,
    rating,
  }: FormValues) {
    if (!product._id) {
      throw Error("Product ID missing");
      
    }
    
    mutation.mutate(
      {
        productId: product._id,
        title,
        body,
        rating,
        media: attachments.filter((m) => m.url)
          .map((m) => ({
            url: m.url!,
            type: m.file.type.startsWith("image") ? "image" : "video"
          }))
      },
      {
        onSuccess: () => {
          form.reset();
          clearAttachments();
          onSubmitted();
          setTimeout(() => {
            router.refresh();
          }, 2000);
        }
      }
    );
  }

  const uploadInProgress = attachments.some(
    (m) => m.state === "uploading"
  );
  
  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Write Review
          </DialogTitle>
          <DialogDescription>
            Did you like this product? Share your thoughts with other customers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Product</Label>
            <div className="flex gap-3 items-center">
              <WixImage 
                height={50}
                mediaIdentifier={product.media?.mainMedia?.image?.url}
                width={50}
              />
              <span className="font-bold">{product.name}</span>
            </div>
          </div>
          <Form {...form}>
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRatingInput
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your review here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write a detailed review of this product.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-5">
                {
                  attachments.map((attachment) => (
                    <AttachmentPreview
                      attachment={attachment}
                      key={attachment.id}
                      onRemoveClick={removeAttachment}
                    />
                  ))
                }
                <AddMediaButton
                  disabled={
                    attachments.filter(
                      (a) => a.state !== "failed"
                    ).length >= 5
                  }
                  onFileSelected={startUpload}
                />
              </div>
              <LoadingButton
                disabled={uploadInProgress}
                loading={mutation.isPending}
                type="submit"
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AddMediaButtonProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}

function AddMediaButton({
  onFileSelected,
  disabled
}: AddMediaButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        size="icon"
        title="Add Media"
        type="button"
        variant="outline"
      >
        <ImageUp />
      </Button>
      <input
        accept="image/*, video/*"
        className="hidden sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);

          if (files.length) {
            onFileSelected(files[0]);
            e.target.value = "";
          }
        }}
        ref={fileInputRef}
        type="file"
      />
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}

function AttachmentPreview({
  attachment: {
    id,
    file,
    state,
    url
  },
  onRemoveClick
}: AttachmentPreviewProps) {
  return (
    <div className={cn(
      "relative size-fit",
      state === "failed" && "outline outline-1 outline-destructive"
    )}>
      {
        file.type.startsWith("image") ? (
          <WixImage
            alt="Attachment preview"
            className={cn(
              "max-h-24 max-w-24 object-contain",
              !url && "opacity-50"
            )}
            mediaIdentifier={url}
            placeholder={URL.createObjectURL(file)}
            scaleToFill={false}
          />
        ) : (
          <video
            className={cn(
              "max-h-24 max-w-24",
              !url && "opacity-50"
            )}
            controls
          >
            <source
              src={url || URL.createObjectURL(file)}
              type={file.type}
            />
          </video>
        )
      }
      {
        state === "uploading" && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin" />
          </div>
        )
      }
      {
        state === "failed" && (
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            title="Failed to upload media"
          >
            <CircleAlert className="text-destructive" />
          </div>
        )
      }
      <button
        className="absolute bg-background border -right-1.5 -top-1.5"
        onClick={() => onRemoveClick(id)}
        title="Remove media"
        type="button"
      >
        <X size={20} />
      </button>
    </div>
  );
}
