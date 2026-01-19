import { z } from "zod";

export const storeDetailsSchema = z
  .object({
    name: z
      .string({ error: "Store name is required" })
      .min(2, "Store name must be at least 2 characters long")
      .max(50, "Store name must be at most 50 characters long")
      .regex(/^[a-zA-Z0-9\s]+$/, {
        message: "Store name can only contain letters, numbers, and spaces",
      }),

    url: z
      .string({ error: "Category url is required" })
      .min(2, "Store url must be at least 2 characters long")
      .max(50, "Store url must be at most 50 characters long")
      .regex(/^(?!.*(?:[ -_ ]){2,})[a-zA-Z0-9_-]+$/, {
        message: "Category URL cannot have consecutive hyphens or underscores",
      }),

    featured: z.boolean().default(false),
    status: z.string().default("PENDING").optional(),
    logo: z
      .object({ url: z.string() })
      .array()
      .length(1, "Choose a logo image"),
    cover: z
      .object({ url: z.string() })
      .array()
      .length(1, "Choose a cover image"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    description: z
      .string({
        required_error: "Store description is required",
      })
      .min(30, "Store description must be at least 30 characters long")
      .max(500, "Store description must be at most 500 characters long"),
  })
  .strict();

//export the z.infer type
export type StoreDetailsSchema = z.infer<typeof storeDetailsSchema>;
