import { z } from "zod";

//Categories form scehma
// export const categoryDetailsSchema = z.object({
//   name: z
//     .string({ error: "Category name is required" })
//     .min(2, "Category name must be at least 2 characters long")
//     .max(50, "Category name must be at most 50 characters long")
//     .regex(/^[a-zA-Z0-9\s]+$/, {
//       message: "Category name can only contain letters, numbers, and spaces",
//     }),
//   image: z
//     .object({
//       url: z.string().url("Image URL must be a valid URL"),
//     })
//     .array()
//     .length(1, "At least one image is required"),

//   url: z
//     .string({ error: "Category url is required" })
//     .min(2, "Category url must be at least 2 characters long")
//     .max(50, "Category url must be at most 50 characters long")
//     .regex(/^(?!.*(?:[ -_ ]){2,})[a-zA-Z0-9_-]+$/, {
//       message: "Category URL cannot have consecutive hyphens or underscores",
//     }),

//   featured: z.boolean().optional().default(false),
// });

export const subCategoryDetailsSchema = z
  .object({
    name: z
      .string({ error: "SubCategory name is required" })
      .min(2, "SubCategory name must be at least 2 characters long")
      .max(50, "SubCategory name must be at most 50 characters long")
      .regex(/^[a-zA-Z0-9\s]+$/, {
        message:
          "SubCategory name can only contain letters, numbers, and spaces",
      }),

    image: z
      .array(
        z.object({
          url: z.string().url("Image URL must be a valid URL"),
        })
      )
      .length(1, "At least one image is required"),

    url: z
      .string({ error: "SubCategory url is required" })
      .min(2, "SubCategory url must be at least 2 characters long")
      .max(50, "SubCategory url must be at most 50 characters long")
      .regex(/^(?!.*(?:[ -_ ]){2,})[a-zA-Z0-9_-]+$/, {
        message:
          "SubCategory URL cannot have consecutive hyphens or underscores",
      }),

    featured: z.boolean().default(false),
    categoryId: z.uuid(),
  })
  .strict();

//export the z.infer type
export type SubCategoryDetailsSchema = z.infer<typeof subCategoryDetailsSchema>;
