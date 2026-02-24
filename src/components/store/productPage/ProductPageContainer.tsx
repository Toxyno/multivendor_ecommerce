"use client";
import { CartProductType, ProductPageDataType } from "@/lib/type";

import ProductSwiper from "./ProductSwiper";
import ProductInfo from "./ProductInfo/ProductInfo";
import ShippingTo from "./Shipping/ShippingTo";
import ShippingDetails from "./Shipping/ShippingDetails";
import ReturnSecurityPrivacyCard from "./ReturnSecurityPrivacyCard";

interface ProductPageContainerProps {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: ReactNode;
}

import { ReactNode, useCallback, useMemo, useState } from "react";
import QuantitySelector from "./ProductInfo/QuantitySelector";
import { cn } from "@/lib/utils";
import SocialShare from "../shared/SocialShare";
import { ProductVariantImage } from "@/generated/prisma";

const ProductPageContainer = ({
  productData,
  sizeId,
  children,
}: ProductPageContainerProps) => {
  if (!productData) return null;
  const { images, shippingDetails, sizes } = productData;

  const initialCartProduct = useMemo<CartProductType>(
    () => ({
      productId: productData.productId || "",
      variantId: productData.variantId,
      productSlug: productData.productSlug || "",
      variantSlug: productData.variantSlug,
      name: productData.name || "",
      variantName: productData.variantName,
      image: productData.images[0]?.imageUrl || "",
      variantImage: productData.variantImage || "",
      size: "",
      sizeId: sizeId || "",
      quantity: 1,
      price: 0,
      stock: 1,
      weight: productData.weight,
      shippingMethod: productData.shippingDetails?.shippingFeeMethod || "",
      shippingService: productData.shippingDetails?.shippingService || "",
      shippingFee: productData.shippingDetails?.shippingFee || 0,
      extraShippingFee: productData.shippingDetails?.extraShippingFee || 0,
      deliveryTimeMin: productData.shippingDetails?.deliveryTimeMin || 0,
      deliveryTimeMax: productData.shippingDetails?.deliveryTimeMax || 0,
      freeShipping: productData.shippingDetails?.freeShipping || false,
    }),
    [productData, sizeId],
  );

  //state for temporary images
  const [temporaryVariantImages, setTemporaryVariantImages] =
    useState<ProductVariantImage[]>(images);

  const [activeImage, setActiveImage] = useState<ProductVariantImage | null>(
    images[0],
  );
  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(() => initialCartProduct);

  const handleChange = useCallback(
    (property: keyof CartProductType, value: any) => {
      setProductToBeAddedToCart((prev) => {
        // prevents “update every render” loops when value is unchanged
        if (Object.is(prev[property], value)) return prev;
        return { ...prev, [property]: value };
      });
    },
    [],
  );

  const validateProduct = (product: CartProductType): boolean =>
    product.quantity > 0 && product.price > 0 && product.sizeId !== "";

  const isProductValidToBeAddedToCart = validateProduct(productToBeAddedToCart);

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper
          images={
            temporaryVariantImages.length > 0 ? temporaryVariantImages : images
          }
          activeImage={activeImage || images[0]}
          setActiveImage={setActiveImage}
        />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          <ProductInfo
            productData={productData}
            quantity={2}
            sizeId={sizeId}
            handleChange={handleChange}
            setTemporaryVariantImages={setTemporaryVariantImages}
            setActiveImage={setActiveImage}
          />
          {/* Shipping details - buy actions buttons */}
          <div className="w-97.5">
            <div className="z-20">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto">
                {typeof shippingDetails !== "boolean" && (
                  <>
                    <ShippingTo
                      countryName={shippingDetails?.countryName || "Unknown"}
                      countryCode={shippingDetails?.countryCode || "Unknown"}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={shippingDetails}
                        quantity={12}
                        weight={productData.weight}
                      />
                    </div>
                    <ReturnSecurityPrivacyCard
                      returnPolicy={
                        shippingDetails?.returnPolicy ||
                        "No return policy available"
                      }
                    />
                  </>
                )}

                {/* Action Button  */}
                <div className="sticky bottom-0 mt-2 bg-white px-4 pb-4 pt-3 space-y-3">
                  {/* Qty Selector */}
                  {sizeId && (
                    <div className="w-full flex justify-end mt-4">
                      <QuantitySelector
                        productId={productToBeAddedToCart.productId}
                        variantId={productToBeAddedToCart.variantId}
                        quantity={productToBeAddedToCart.quantity}
                        stock={productToBeAddedToCart.stock}
                        sizeId={productToBeAddedToCart.sizeId}
                        handleChange={handleChange}
                        size={sizes}
                      />
                    </div>
                  )}
                  {/* Action Button */}
                  <button className="relative w-full py-2.5 min-w-20 bg-[#FD384F] hover:bg-[#e23246] text-white h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-[#ffe6e7] transition-all duration-300 ease-in-out select-none cursor-pointer">
                    <span>Buy now</span>
                  </button>

                  <button
                    disabled={!isProductValidToBeAddedToCart}
                    className={cn(
                      "relative w-full py-2.5 min-w-20 bg-[#e6d0d2] hover:bg-[#e4cdce] text-[#FD384F] h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-b-orange-200 transition-all duration-300 ease-in-out select-none cursor-pointer",
                      { "cursor-not-allowed": !isProductValidToBeAddedToCart },
                    )}
                  >
                    <span>Add to Cart</span>
                  </button>

                  {/* Share to Social Network */}
                  <SocialShare
                    url={`/product/${productData.productSlug}/${productData.variantSlug}`}
                    quote={`${productData.name} . ${productData.variantName}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
