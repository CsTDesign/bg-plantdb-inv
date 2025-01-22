"use client";

import { members } from "@wix/members";
import { products } from "@wix/stores";
import { useState } from "react";
import { Button } from "../ui/button";
import CreateProductReviewDialog from "./CreateProductReviewDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { useSearchParams } from "next/navigation";

interface CreateProductReviewButtonProps {
  product: products.Product;
  loggedInMember: members.Member | null;
  hasExistingReview: boolean;
}

export default function CreateProductReviewButton({
  product,
  loggedInMember,
  hasExistingReview
}: CreateProductReviewButtonProps) {
  const searchParams = useSearchParams();
  const [
    showReviewDialog,
    setShowReviewDialog
  ] = useState(searchParams.has("createReview"));
  const [
    showConfirmationDialog,
    setShowConfirmationDialog
  ] = useState(false);

  return (
    <>
      <Button
        disabled={!loggedInMember}
        onClick={() => setShowReviewDialog(true)}
      >
        {
          loggedInMember ? "Write review" : "Login to write review"
        }
      </Button>
      <CreateProductReviewDialog
        onOpenChange={setShowReviewDialog}
        onSubmitted={() => {
          setShowReviewDialog(false);
          setShowConfirmationDialog(true);
        }}
        open={showReviewDialog && !hasExistingReview && !!loggedInMember}
        product={product}
      />
      <ReviewSubmittedDialog
        onOpenChange={setShowConfirmationDialog}
        open={showConfirmationDialog}
      />
      <ReviewAlreadyExistsDialog
        onOpenChange={setShowReviewDialog}
        open={showReviewDialog && hasExistingReview}
      />
    </>
  );
}

interface ReviewSubmittedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ReviewSubmittedDialog({
  open,
  onOpenChange
}: ReviewSubmittedDialogProps) {
  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thank you for your review!</DialogTitle>
          <DialogDescription>Your review has been submitted successfully. It will be visible upon approval.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReviewAlreadyExistsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ReviewAlreadyExistsDialog({
  open,
  onOpenChange
}: ReviewAlreadyExistsDialogProps) {
  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review already exists</DialogTitle>
          <DialogDescription>You have already reviewed this particular product. You may only write one review per product.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
