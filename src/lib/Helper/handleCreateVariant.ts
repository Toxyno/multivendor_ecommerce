import slugify from "slugify";
import { db } from "../db";
import { ProductWithVariantType } from "../type";
import { generateUniqueSlug } from "../utilsServer";

const handleCreateVariant = async (product: ProductWithVariantType) => {
  const variantSlug = await generateUniqueSlug(
    slugify(product.variantName, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "productVariant"
  );

  const variantData = {
    id: product.variantId,
    productId: product.productId,
    variantName: product.variantName,
    variantDescription: product.variantDescription,
    slug: variantSlug,
    isSale: product.isSale,
    saleEndDate: product.isSale ? product.saleEndDate : "",
    sku: product.sku,
    keywords: product.keywords.join(","),
    //weight: product.weight,
    //variantImage: product.images,
    images: {
      create: product.images.map((img) => ({
        imageUrl: img.url,
        alt: "" + img.url.split("/").pop() || "",
      })),
    },
    variantImage: product.variantImage ? product.variantImage.url : "",
    colors: {
      create: product.colors.map((color) => ({
        name: color.color,
        hexCode: color.hexCode || "",
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
      create: product.variant_specs.map((spec) => ({
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
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  const new_variant = await db.productVariant.create({ data: variantData });
  return new_variant;
};

export default handleCreateVariant;
