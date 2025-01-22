"use client";

import LoadingButton from "@/components/LoadingButton";
import { Skeleton } from "@/components/ui/skeleton";
import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { getProductReviews } from "@/wix-api/reviews";
import { useInfiniteQuery } from "@tanstack/react-query";
import { reviews } from "@wix/reviews";
import { products } from "@wix/stores";
import {
  CornerDownRight,
  Star,
  Trees
} from "lucide-react";
import Zoom from "react-medium-image-zoom";
import { media as wixMedia } from "@wix/sdk";

interface ProductReviewsProps {
  product: products.Product
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ["product-reviews", product._id],
    queryFn: async ({ pageParam }) => {
      if (!product._id) {
        throw Error("Product ID missing")
      }

      const pageSize = 2;

      return getProductReviews(wixBrowserClient, {
        productId: product._id,
        limit: pageSize,
        cursor: pageParam
      });
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.filter((item) => (
          item.moderation?.moderationStatus === reviews.ModerationModerationStatus.APPROVED
        ))
      }))
    }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.cursors.next
  });

  const reviewItems = data?.pages.flatMap((page) => page.items) || [];
  
  return (
    <div className="space-y-5">
      {
        status === "pending" && <ProductReviewsLoadingSkeleton />
      }
      {
        status === "error" && (
          <p className="text-destructive">
            Error fetching reviews.
          </p>
        )
      }
      {
        status === "success" && !reviewItems.length && !hasNextPage && (
          <p>No reviews yet</p>
        )
      }
      <div className="divide-y">
        {
          reviewItems.map((review) => (
            <Review
              key={review._id}
              review={review}
            />
          ))
        }
      </div>
      {
        hasNextPage && (
          <LoadingButton
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            More reviews...
          </LoadingButton>
        )
      }
    </div>
  );
}

interface ReviewProps {
  review: reviews.Review;
}

function Review({
  review: {
    author,
    reviewDate,
    content,
    reply
  }
}: ReviewProps) {
  return (
    <div className="first:pt-0 last:pb-0 py-5">
      <div className="space-y-1.5">
        <div className="flex gap-2 items-center">
          {
            Array.from({ length: 5 })
              .map((_, i) => (
                <Star
                  className={cn(
                    "size-5 text-primary",
                    i < (content?.rating || 0) && "fill-primary"
                  )}
                  key={i}
                />
              ))
          }
          {
            content?.title && (
              <h3 className="font-bold">
                {content.title}
              </h3>
            )
          }
        </div>
        <p className="text-muted-foreground text-sm">
          by {author?.authorName || "Anonymous"}
          {
            reviewDate && (
              <>{" "}
                on {
                  new Date(reviewDate).toLocaleDateString()
                }
              </>
            )
          }
        </p>
        {
          content?.body && (
            <div className="whitespace-pre-line">
              {content.body}
            </div>
          )
        }
        {
          !!content?.media?.length && (
            <div className="flex flex-wrap gap-2">
              {
                content.media.map((media) => (
                  <MediaAttachment
                    key={media.image || media.video}
                    media={media}
                  />
                ))
              }
            </div>
          )
        }
      </div>
      {
        reply?.message && (
          <div className="border-t ms-10 mt-2.5 pt-2.5 space-y-1">
            <div className="flex gap-2 items-center">
              <CornerDownRight className="size-5" />
              <Trees className="size-5 text-green-700" />
              <span className="font-bold">BG-Design-Team</span>
            </div>
            <div className="whitespace-pre-line">
              {reply.message}
            </div>
          </div>
        )
      }
    </div>
  );
}

export function ProductReviewsLoadingSkeleton() {
  return (
    <div className="space-y-10">
      {
        Array.from({ length: 2 })
          .map((_, i) => (
            <div
              className="space-y-1.5"
              key={i}
            >
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-16 w-72" />
            </div>
          ))
      }
    </div>
  );
}

interface MediaAttachmentProps {
  media: reviews.Media;
}

function MediaAttachment({ media }: MediaAttachmentProps) {
  if (media.image) {
    <Zoom>
      <WixImage
        alt="Review media"
        className="max-h-40 max-w-40 object-contain"
        mediaIdentifier={media.image}
        scaleToFill={false}
      />
    </Zoom>
  }

  if (media.video) {
    return (
      <video
        className="max-h-40 max-w-40"
        controls
      >
        <source
          src={wixMedia.getVideoUrl(media.video).url}
          type="video/mp4"
        />
      </video>
    );
  }

  return (
    <span className="text-destructive">
      Unsupported media type
    </span>
  );
}
