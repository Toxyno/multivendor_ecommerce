"use server";
import { ProductWithVariantType } from "@/lib/type";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import handleCreateVariant from "@/lib/Helper/handleCreateVariant";
import handleProductCreate from "@/lib/Helper/handleProductCreate";

export const upsertProduct = async (
  product: ProductWithVariantType,
  storeUrl: string
) => {
  try {
    // Retrieve current user
    const user = await currentUser();

    // Check if user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Ensure user has seller privileges
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );

    // Ensure product data is provided
    if (!product) throw new Error("Please provide product data.");

    // Find the store by URL
    const store = await db.store.findUnique({
      where: { url: storeUrl, ownerId: user.id },
    });
    if (!store) throw new Error("Store not found.");

    // Check if the product already exists
    const existingProduct = await db.product.findUnique({
      where: { id: product.productId },
    });

    // Check if the variant already exists
    const existingVariant = await db.productVariant.findUnique({
      where: { id: product.variantId },
    });

    if (existingProduct) {
      if (existingVariant) {
        // Update existing variant and product
      } else {
        // Create new variant
        await handleCreateVariant(product);
      }
    } else {
      // Create new product and variant
      await handleProductCreate(product, store.id);
    }
  } catch (error) {
    throw error;
  }
};

// //Function: upsertProduct
// //Description: This function is used to create or update a Product in the database ensuring uniqueness of name, url, email and phone number .
// //Permission Level: Seller Only
// //Parameters:
// // -Product: ProductWithVariant object contsaining details of the product and its variants.
// // -storeuirl: The URL of the store to which the product belongs
// // Returns: Newly created or updated product with  its variants.....#

// "use server";

// import "server-only";
// import { db } from "@/lib/db";
// import { currentUser } from "@clerk/nextjs/server";
// import { ProductWithVariantType } from "@/lib/type";
// import slugify from "slugify";
// import { generateUniqueSlug } from "@/lib/utilsServer";

// // ...existing code...
// export const upsertProduct = async (
//   product: ProductWithVariantType,
//   storeurl: string
// ) => {
//   try {
//     // get the current user
//     const user = await currentUser();
//     //Ensure the user is authenticated
//     if (!user) throw new Error("Unauthenticated user");
//     //Ensure the user has the seller role
//     const role = (
//       user.privateMetadata?.role as string | undefined
//     )?.toUpperCase();
//     if (role !== "SELLER") throw new Error("Unauthorized user");
//     if (!product) throw new Error("Product data is required");

//     const existingProduct = await db.product.findUnique({
//       where: {
//         id: product.productId,
//       },
//     });

//     if (existingProduct) {
//       let errorMessage = "";
//       if (existingProduct.name === product.name) {
//         errorMessage = "Product with the same name already exists";
//       }
//       if (errorMessage) throw new Error(errorMessage);
//     }
//     //Find the store URL
//     const store = await db.store.findUnique({
//       where: {
//         url: storeurl,
//       },
//     });
//     if (!store) throw new Error("Store not found");

//     //generate the unique slugs for product and variant
//     const productSlug = await generateUniqueSlug(
//       slugify(product.name, {
//         replacement: "-",
//         lower: true,
//         trim: true,
//       }),
//       "product"
//     );

//     const variantSlug = await generateUniqueSlug(
//       slugify(product.variantName, {
//         replacement: "-",
//         lower: true,
//         trim: true,
//       }),
//       "productVariant"
//     );

//     // common data for product and variant
//     const commonProductData = {
//       name: product.name,
//       description: product.description,
//       slug: productSlug,
//       brand: product.brand,
//       store: { connect: { id: store.id } },
//       category: { connect: { id: product.categoryId } },
//       subCategory: { connect: { id: product.subCategoryId } },
//       createdAt: product.createdAt,
//       updatedAt: product.updatedAt,
//     };

//     const commonVariantData = {
//       variantName: product.variantName,
//       variantDescription: product.variantDescription,
//       slug: variantSlug,
//       isSale: product.isSale,
//       sku: product.sku,
//       keywords: Array.isArray(product.keywords)
//         ? product.keywords.join(",")
//         : product.keywords ?? "",
//       images: {
//         create: product.images.map((image) => ({
//           imageUrl: image.url,
//           alt: image.url.split("/").pop() || "",
//         })),
//       },
//       colors: {
//         create: product.colors.map((color) => ({
//           name: color.color,
//           hexCode: (color as any).hexCode ?? "",
//         })),
//       },
//       sizes: {
//         create: product.sizes.map((size) => ({
//           size: size.size,
//           quantity: size.quantity,
//           price: size.price,
//           discount: size.discount,
//         })),
//       },
//     };

//     //if product exists, update it otherwise create a new product
//     if (existingProduct) {
//       const variantData = {
//         ...commonVariantData,
//         product: { connect: { id: existingProduct.id } },
//       };
//       return await db.productVariant.create({
//         data: variantData,
//       });
//     } else {
//       //otherwise, create a new product with variants
//       const productData = {
//         ...commonProductData,
//         id: product.productId ?? undefined,
//         variants: {
//           create: [
//             {
//               id: product.variantId ?? undefined,
//               ...commonVariantData,
//             },
//           ],
//         },
//       };
//       return await db.product.create({ data: productData });
//     }

//     //perform upsert for product and create a variant (adjust relations as needed)
//     // const result = await db.product.upsert({
//     //   where: { id: product.productId ?? "" },
//     //   update: {
//     //     ...commonProductData,
//     //     variants: {
//     //       create: [
//     //         {
//     //           ...commonVariantData,
//     //         },
//     //       ],
//     //     },
//     //   },
//     //   create: {
//     //     id: product.productId,
//     //     ...commonProductData,
//     //     variants: {
//     //       create: [
//     //         {
//     //           ...commonVariantData,
//     //         },
//     //       ],
//     //     },
//     //   },
//     // });

//     //return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Failed to upsert product: ${(error as Error).message}`);
//   }
// };

// Function: upsertProduct
// Description: Upserts a product and its variant into the database, ensuring proper association with the store.
// Access Level: Seller Only
// Parameters:
//   - product: ProductWithVariant object containing details of the product and its variant.
//   - storeUrl: The URL of the store to which the product belongs.
// Returns: Newly created or updated product with variant details.
