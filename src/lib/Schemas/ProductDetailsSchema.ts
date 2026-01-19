import { z } from "zod";

export const productDetailsSchema = z
  .object({
    name: z
      .string({
        error: "Product name is required",
      })
      .min(2, "Product name must be at least 2 characters long")
      .max(200, "Product name must be at most 200 characters long")
      .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
        message:
          "Product name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.",
      }),

    variantName: z
      .string({
        error: "Product variant name is required",
      })
      .min(2, "Product variant name must be at least 2 characters long")
      .max(100, "Product variant name must be at most 100 characters long")
      .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
        message:
          "Product variant name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.",
      }),

    variantDescription: z
      .string({
        error: "Product variant description is required",
      })
      .optional(),
    images: z
      .object({ url: z.string() })
      .array()
      .min(3, "At least three product images are required")
      .max(6, "You can upload up to 6 product images"),

    variantImage: z
      .object({ url: z.string() })
      .array()
      .length(1, "Choose a product variant image"),

    categoryId: z
      .string({ error: "Category is required" })
      .refine((val) => val !== "", {
        message: "Category is required",
      })
      .uuid(),
    description: z
      .string({
        error: "Product description is required",
      })
      .min(200, "Product description must be at least 30 characters long"),

    subCategoryId: z
      .string({ error: "Subcategory is required" })
      .refine((val) => val !== "", {
        message: "Subcategory is required",
      })
      .uuid(),

    brand: z
      .string({
        error: "Brand name is required",
      })
      .min(2, "Brand name must be at least 2 characters long")
      .max(50, "Brand name must be at most 100 characters long"),

    sku: z
      .string({
        error: "SKU is required",
      })
      .min(2, "SKU must be at least 2 characters long")
      .max(50, "SKU must be at most 50 characters long"),

    keywords: z
      .string({
        error: "Keywords are required",
      })
      .array()
      .min(5, "Keywords must be at least 5 characters long")
      .max(100, "Keywords must be at most 100 characters long"),
    colors: z
      .object({ color: z.string() })
      .array()
      .min(1, "At least one color is required")
      .refine((colors) => colors.every((color) => color.color.length > 0), {
        message: "All color inputs must be filled",
      }),

    sizes: z
      .object({
        size: z.string(),
        quantity: z.coerce
          .number()
          .min(1, { message: "Quantity must be at least 1" }),
        price: z.coerce
          .number()
          .min(0.01, { message: "Price must be at least 0.01" }),
        discount: z.coerce.number().min(0).default(0),
      })
      .array()
      .min(1, "At least one size is required")
      .refine(
        (sizes) =>
          sizes.every(
            (size) =>
              size.size.length > 0 && size.quantity > 0 && size.price > 0
          ),
        {
          message: "All size inputs must be filled correctly",
        }
      ),
    product_specs: z
      .object({
        name: z.string(),
        value: z.string(),
      })
      .array()
      .min(1, "Please provide at least one product specification")
      .refine(
        (product_specs) =>
          product_specs.every(
            (spec) => spec.name.length > 0 && spec.value.length > 0
          ),
        {
          message: "All product specification inputs must be filled correctly",
        }
      ),
    variant_specs: z
      .object({
        name: z.string(),
        value: z.string(),
      })
      .array()
      .min(1, "Please provide at least one variant specification")
      .refine(
        (variant_specs) =>
          variant_specs.every(
            (spec) => spec.name.length > 0 && spec.value.length > 0
          ),
        {
          message: "All variant specification inputs must be filled correctly",
        }
      ),
    questions: z
      .object({
        question: z.string(),
        answer: z.string(),
      })
      .array()
      .min(1, "Please provide at least one product question")
      .refine(
        (questions) =>
          questions.every(
            (question) =>
              question.question.length > 0 && question.answer.length > 0
          ),
        {
          message: "All product question inputs must be filled correctly",
        }
      ),
    isSale: z.boolean().default(false),
    saleEndDate: z.string().optional(),
  })
  .strict();

//   url: z
//     .string({ error: "Category url is required" })
//     .min(2, "Product url must be at least 2 characters long")
//     .max(50, "Product url must be at most 50 characters long")
//     .regex(/^(?!.*(?:[ -_ ]){2,})[a-zA-Z0-9_-]+$/, {
//       message: "Category URL cannot have consecutive hyphens or underscores",
//     }),

//   featured: z.boolean().default(false),
//   status: z.string().default("PENDING").optional(),
//   logo: z
//     .object({ url: z.string() })
//     .array()
//     .length(1, "Choose a logo image"),
//   cover: z
//     .object({ url: z.string() })
//     .array()
//     .length(1, "Choose a cover image"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
//   description: z
//     .string({
//       error: "Product description is required",
//       message: "Product description must be a valid string.",
//     })
//     .min(30, "Product description must be at least 30 characters long")
//     .max(800, "Product description must be at most 800 characters long"),
// })
// .strict();

//export the z.infer type
export type ProductDetailsSchema = z.infer<typeof productDetailsSchema>;
