import { z } from "zod";

export const addReviewSchema = z.object({
  variantName: z.string().min(1, "Variant name is required"),
  rating: z.number().min(1, "Please rate this product"),
  size: z.string().min(1, "Please select a size"),
  review: z
    .string()
    .min(
      1,
      "Your feedback matters! Please share your thoughts on this product.",
    ),
  quantity: z.string().default("1"), //min(1, "Quantity must be at least 1"),

  //   images: z
  //     .object({ url: z.string() })
  //     .array()
  //     .max(3, "You can upload up to 3 images"),
  // images: z
  //   .array(z.string())
  //   .max(3, "You can upload up to 3 images")
  //   .default([]),
  images: z
    .object({ url: z.string() })
    .array()
    .max(3, "You can upload up to 3 images for the review."),
  color: z.string().min(1, "Color is required"),
});

export type AddReviewSchema = z.infer<typeof addReviewSchema>;
