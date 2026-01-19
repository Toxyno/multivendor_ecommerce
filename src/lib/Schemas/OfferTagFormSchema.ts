import { z } from "zod";

export const offerTagFormSchema = z.object({
  name: z
    .string({ message: "offertage name must be a string." })
    .min(2, { message: "Offer tag name must be at least 2 characters long." })
    .max(50, { message: "Offer tag   name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9\s&$.%,']+$/, {
      message:
        "Only letters, numbers, and spaces are allowed in the category name.",
    }),
  url: z
    .string({ message: "offer tag url must be a string." })
    .min(2, { message: "Offer tag url must be at least 2 characters long." })
    .max(50, { message: "Offer tag   url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
});

export type OfferTagFormSchema = z.infer<typeof offerTagFormSchema>;
