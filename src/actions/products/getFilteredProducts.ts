//Function: getFilteredProducts
//Description: Retrieves products from the database based on various filter criteria
//Parameters:
// - filters: object - An object containing various filter criteria such as category, price range, etc.
// -sortBy: Sort the filtered results(Most popular, New Arrivals, Top Rated....)
// --page: The Current page number for pagination(default: 1)
// --pageSize: The number of products per page(default: 20)
//Returns: An object containing paginated products, filtered variants, and pagination metadata (totalPages, currentPage, totalVariants,PageSize)
import { db } from "@/lib/db";
import { VariantImageType, VariantSimplified } from "@/lib/type";

export const getFilteredProducts = async (
  filters: any = {},
  sortBy: string = "",
  page: number = 1,
  pageSize: number = 10,
) => {
  //Default values for page and pageSize
  const currentPage = page;
  const limit = pageSize;
  const offset = (currentPage - 1) * limit;

  //Build the where clause based on provided filters
  const whereClause: any = {
    //Example filter criteria
    AND: [],
  };

  //Get all filtered,sorted product
  const products = await db.product.findMany({
    where: whereClause,
    //orderBy: getSortOrder(sortBy),
    skip: offset,
    take: limit, //Limit the number of products per page
    include: {
      variants: {
        include: {
          images: true,
          sizes: true,
          colors: true,
        },
      },
    },
  });

  //Transform the products with filtered variants into ProductCardType Structure
  const productsWithFilteredVAriant = products.map((product) => {
    console.log(`The raw product`, product);
    //Here you can filter variants based on additional criteria if needed
    const filteredVariants = product.variants; //For now, we include all variants

    //Transform the filtered variants into the VariantSimplified structure
    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant.id,
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes,
    }));

    //Extract variant images for the product
    const variantImages: VariantImageType[] = filteredVariants.map(
      (variant) => ({
        url: `/product/${product.slug}/${variant.slug}`,
        image: variant.variantImage
          ? variant.variantImage
          : variant.images[0].imageUrl,
      }),
    );

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      rating: product.rating,
      sales: product.sales,
      variants,
      variantImages,
    };
  });
  //Retrieve  products matching the filters
  // const totalCount = await db.product.count({
  //     where: whereClause,
  // })
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products: productsWithFilteredVAriant,
    totalPages,
    currentPage,
    totalCount,
    pageSize,
  };
};
