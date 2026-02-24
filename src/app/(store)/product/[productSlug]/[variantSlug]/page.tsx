import { getFilteredProducts } from "@/actions/products/getFilteredProducts";
import { getProductPageData } from "@/actions/products/getProductPageData";
import ProductDescription from "@/components/store/productPage/ProductDescription";
import RelatedProducts from "@/components/store/productPage/ProductInfo/relatedProducts";
import ProductPageContainer from "@/components/store/productPage/ProductPageContainer";
import ProductSpecs from "@/components/store/productPage/ProductSpecs";
import { Separator } from "@/components/ui/separator";
import { notFound, redirect } from "next/navigation";
import ProductQuestions from "@/components/store/productPage/ProductQuestions";
import StoreCard from "@/components/store/Card/StoreCard";
import StoreProducts from "@/components/store/productPage/StoreProducts.server";
import ProductReviews from "@/components/store/productPage/reviews/ProductReviews";
import AddReview from "@/components/store/productPage/reviews/AddReview";

interface PageProps {
  params: Promise<{ productSlug: string; variantSlug: string }>;
  searchParams: Promise<{ sizeId?: string }>;
}

const ProductVariantPage = async ({ params, searchParams }: PageProps) => {
  const { productSlug, variantSlug } = await params;
  const { sizeId } = await searchParams;

  const productVariantData = await getProductPageData(productSlug, variantSlug);
  if (!productVariantData) return notFound();

  const {
    sizes,
    specs,
    questions = [],
    shippingDetails,
    category,
    subCategory,
    store,
    variantInfo,
    reviews,
    productId,
    rating,
    reviewsStatistics,
  } = productVariantData;

  // If there are no sizes at all, keep URL clean (or decide what to do)
  if (!sizes?.length) {
    //no redirect needed unless your route requires sizes
    redirect(`/product/${productSlug}/${variantSlug}`);
  }
  if (!sizeId && sizes?.length === 1) {
    redirect(`/product/${productSlug}/${variantSlug}?sizeId=${sizes[0].id}`);
  }

  // ✅ If sizeId is provided but invalid -> REMOVE it (redirect to clean URL)
  if (sizeId && sizes?.length) {
    const isValidSize = sizes.some((s) => s.id === sizeId);
    if (!isValidSize) {
      redirect(`/product/${productSlug}/${variantSlug}`);
    }
  }

  const relatedProducts = await getFilteredProducts(
    {
      category: category?.url,
    },
    "",
    1,
    12,
  );

  console.log(`The variantInfo:`, variantInfo);

  return (
    <div>
      <div className="mx-auto p-4 overflow-x-hidden">
        {/* ✅ pass sizeId (may be undefined) */}
        <ProductPageContainer productData={productVariantData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related Product */}
              <RelatedProducts products={relatedProducts.products} />
            </>
          )}

          <Separator className="mt-6" />
          {/* Product Review */}
          <ProductReviews
            productId={productId || ""}
            rating={rating || 0}
            statistics={reviewsStatistics || {}}
            reviews={reviews || []}
            variantsInfo={variantInfo.map((variant) => ({
              ...variant,
              colors: Array.isArray(variant.colors)
                ? variant.colors
                : [variant.colors],
            }))}
          />

          {/* <div className="mt-3">
            <AddReview
              productId={productId || ""}
              reviews={reviews || []}
              variantsInfo={variantInfo.map((variant) => ({
                ...variant,
                colors: Array.isArray(variant.colors)
                  ? variant.colors
                  : [variant.colors],
              }))}
              //setReviews={() => {}}
            />
          </div> */}

          <>
            <Separator className="mt-6" />
            {/* Product Description */}
            <ProductDescription
              text={[
                productVariantData.description || "No description available",
                productVariantData.variantDescription ||
                  "No variant description available",
              ]}
            />
          </>

          {((specs.product_specs?.length ?? 0) > 0 ||
            (specs.variant_specs?.length ?? 0) > 0) && (
            <>
              <Separator className="mt-6" />
              {/* Specs Table */}
              <ProductSpecs
                specs={{
                  products: specs.product_specs || [],
                  variants: specs.variant_specs || [],
                }}
              />
            </>
          )}

          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Product Questions */}
              <ProductQuestions
                questions={productVariantData.questions || []}
              />
            </>
          )}

          <Separator className="mt-6" />
          {/* Store Card */}
          <StoreCard store={productVariantData.store} />
          {/* Store Products */}
          {store.url && store.name && (
            <StoreProducts
              storeUrl={store.url}
              storeName={store.name}
              count={4}
            />
          )}
        </ProductPageContainer>
      </div>
    </div>
  );
};

export default ProductVariantPage;

// import { getProductPageData } from "@/actions/products/getProductPageData";

// import { notFound, redirect } from "next/navigation";

// interface PageProps {
//   params: Promise<{
//     productSlug: string;
//     variantSlug: string;
//   }>;
//   searchParams: Promise<{
//     sizeId?: string;
//   }>;
// }

// const ProductVariantPage = async ({ params, searchParams }: PageProps) => {
//   const { productSlug, variantSlug } = await params;
//   const { sizeId } = await searchParams;

//   console.log(`The size id ${sizeId}`);

//   //Fetch the product variant data using productSlug and variantSlug
//   const productVariantData = await getProductPageData(productSlug, variantSlug);

//   // if no product data is found, show the 4040 not found page
//   if (!productVariantData) {
//     return notFound();
//   }

//   //Extract the available sizes for the product variant
//   const { sizes } = productVariantData;

//   //If sizeid is provided in the search params, validate it against available sizes
//   if (sizeId) {
//     //check if the provided sizeId is valid by comparing with the available sizes
//     const isValidSize = sizes.some((size) => size.id === sizeId);

//     //If the sizeId is invalid, show the 404 not found page and return  the 404 error   message with
//     if (!isValidSize) {
//       return redirect(`/product/${productSlug}/${variantSlug}`);
//     }
//   } else if (sizeId?.length === 1) {
//     return redirect(
//       //Redirect to thr same product variant page but with the first available sizeId appended as a query parameter
//       `/product/${productSlug}/${variantSlug}?sizeId=${sizes[0].id}`,
//     );
//   }

//   console.log(`The productVariantData:`, productVariantData);

//   return (
//     <div>
//       <h1 className="text-4xl font-bold">Variant Page</h1>
//     </div>
//   );
// };

// export default ProductVariantPage;
// import { getProductPageData } from "@/actions/products/getProductPageData";
// import ProductPageContainer from "@/components/store/productPage/ProductPageContainer";
// import { Separator } from "@/components/ui/separator";

// import { notFound, redirect } from "next/navigation";

// interface PageProps {
//   params: Promise<{ productSlug: string; variantSlug: string }>;
//   searchParams: Promise<{ sizeId?: string }>;
// }

// const ProductVariantPage = async ({ params, searchParams }: PageProps) => {
//   const { productSlug, variantSlug } = await params;
//   const { sizeId } = await searchParams;

//   console.log("sizeId from searchParams:", sizeId);

//   const productVariantData = await getProductPageData(productSlug, variantSlug);
//   if (!productVariantData) return notFound();

//   const { sizes } = productVariantData;

//   // If there are no sizes, decide what you want:
//   if (!sizes?.length) redirect(`/product/${productSlug}/${variantSlug}`);

//   // ✅ If sizeId is missing, default to first size
//   if (!sizeId) {
//     redirect(`/product/${productSlug}/${variantSlug}?sizeId=${sizes[0].id}`);
//   }

//   // ✅ If provided sizeId is invalid, redirect to first size (or remove param)
//   const isValidSize = sizes.some((s) => s.id === sizeId);
//   if (!isValidSize) {
//     redirect(`/product/${productSlug}/${variantSlug}?sizeId=${sizes[0].id}`);
//     // OR: redirect(`/product/${productSlug}/${variantSlug}`);
//   }

//   const relatedProducts = {
//     products: [],
//   };

//   const { specs, questions } = productVariantData;
//   return (
//     <div>
//       <div className=" mx-auto p-4 overflow-x-hidden">
//         <ProductPageContainer productData={productVariantData} sizeId={sizeId}>
//           {relatedProducts.products && (
//             <>
//               <Separator />
//               {/* Related Product */}
//             </>
//           )}
//           <Separator className="mt-6" />

//           {/* Product Reviews  */}

//           <>
//             <Separator className="mt-6" />
//             {/* Product Description  */}
//           </>
//           {(specs.product_specs.length > 0 ||
//             specs.variant_specs.length > 0) && (
//             <>
//               <Separator className="mt-6" />
//               {/* Specs Table */}
//             </>
//           )}
//           {questions.length > 0 && (
//             <>
//               <Separator className="mt-6" />
//               {/* Product Questions */}
//             </>
//           )}

//           <Separator className="mt-6" />
//           {/* Store Card */}
//           {/* Store Products */}
//         </ProductPageContainer>
//       </div>
//     </div>
//   );
// };

// export default ProductVariantPage;
