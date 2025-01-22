import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";

interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia(
  { media }: ProductMediaProps
) {
  const [
    selectedMedia,
    setSelectedMedia
  ] = useState(media?.[0]);

  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);
  
  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];
  
  return (
    <div className="basis-2/5 h-fit md:sticky md:top-10 space-y-5">
      <div className="aspect-square bg-secondary">
        {
          selectedImage?.url ? (
            <Zoom key={selectedImage.url}>
              <WixImage
                alt={selectedImage.altText}
                className="sticky top-0"
                height={1000}
                mediaIdentifier={selectedImage.url}
                width={1000}
              />
            </Zoom>
          ) : selectedVideo?.url ? (
            <div className="bg-black flex items-center size-full">
              <video
                className="size-full"
                controls
              >
                <source
                  src={selectedVideo.url}
                  type={`video/${selectedVideo.format}`}
                />
              </video>
            </div>
          ) : null
        }
      </div>
      {
        media.length > 1 && (
          <div className="flex flex-wrap gap-5">
            {
              media.map((mediaItem) => (
                <MediaPreview
                  isSelected={mediaItem._id === selectedMedia?._id}
                  key={mediaItem._id}
                  mediaItem={mediaItem}
                  onSelect={() => setSelectedMedia(mediaItem)}
                />
              ))
            }
          </div>
        )
      }
    </div>
  );
}

interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview(
  { mediaItem, isSelected, onSelect }: MediaPreviewProps
) {
  const imageUrl = mediaItem.image?.url;
  const stillFrameMediaId = mediaItem.video?.stillFrameMediaId;
  const thumbnailUrl = mediaItem.thumbnail?.url;
  const resolvedThumbnailUrl = stillFrameMediaId && thumbnailUrl
    ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
    : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div className={cn(
      "bg-secondary cursor-pointer relative",
      isSelected && "outline outline-1 outline-primary"
    )}>
      <WixImage
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0].altText}
        height={100}
        mediaIdentifier={imageUrl || resolvedThumbnailUrl}
        onMouseEnter={onSelect}
        width={100}
      />
      {
        resolvedThumbnailUrl && (
          <span className="absolute bg-black/40 flex items-center justify-center left-1/2 rounded-full size-9 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <PlayIcon className="size-5 text-white/60" />
          </span>
        )
      }
    </div>
  );
}
