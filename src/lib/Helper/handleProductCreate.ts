import { db } from "../db";
import { ProductWithVariantType } from "../type";
import { generateUniqueSlug } from "../utilsServer";
import slugify from "slugify";

const handleProductCreate = async (
  product: ProductWithVariantType,
  storeId: string
) => {
  // Generate unique slugs for product and variant
  const productSlug = await generateUniqueSlug(
    slugify(product.name, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "product"
  );

  const variantSlug = await generateUniqueSlug(
    slugify(product.variantName, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "productVariant"
  );
  const productData = {
    id: product.productId,
    name: product.name,
    description: product.description,
    slug: productSlug,
    store: { connect: { id: storeId } },
    category: { connect: { id: product.categoryId } },
    subCategory: { connect: { id: product.subCategoryId } },
    //offerTag: { connect: { id: product.offerTagId } },
    brand: product.brand,
    specs: {
      create: product.product_specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
      })),
    },
    questions: {
      create: product.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    },
    variants: {
      create: [
        {
          id: product.variantId,
          variantName: product.variantName,
          variantDescription: product.variantDescription,
          slug: variantSlug,
          variantImage: product.images.map((img) => img.url).join(","),
          sku: product.sku,
          // weight: product.weight,
          keywords: product.keywords.join(","),
          isSale: product.isSale,
          saleEndDate: product.isSale ? product.saleEndDate : undefined,
          images: {
            create: product.images.map((img) => ({
              imageUrl: img.url,
              alt: img.url.split("/").pop() || "",
            })),
          },
          colors: {
            create: product.colors.map((color) => ({
              name: color.color,
              hexCode: (color as any).hexCode ?? "#000000",
            })),
          },
          sizes: {
            create: product.sizes.map((size) => ({
              size: size.size,
              price: size.price,
              quantity: size.quantity,
              discount: size.discount,
            })),
          },
          specs: {
            create: product.product_specs.map((spec) => ({
              name: spec.name,
              value: spec.value,
            })),
          },

          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      ],
    },
    //   shippingFeeMethod: product.shippingFeeMethod,
    //   freeShippingForAllCountries: product.freeShippingForAllCountries,
    //   freeShipping: product.freeShippingForAllCountries
    //     ? undefined
    //     : product.freeShippingCountriesIds &&
    //       product.freeShippingCountriesIds.length > 0
    //     ? {
    //         create: {
    //           eligibaleCountries: {
    //             create: product.freeShippingCountriesIds.map((country) => ({
    //               country: { connect: { id: country.value } },
    //             })),
    //           },
    //         },
    //       }
    //     : undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
  const new_product = await db.product.create({ data: productData });
  return new_product;
};
export default handleProductCreate;
