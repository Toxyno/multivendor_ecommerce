// src/components/store/Forms/ReviewDetails.tsx
"use client";

import { ReviewWithImageType, VariantInfoType } from "@/lib/type";
import {
  AddReviewSchema,
  addReviewSchema,
} from "@/lib/Schemas/AddReviewSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";

import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import Select from "@/components/store/ui/select";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import { Button } from "../ui/button";
import { PulseLoader } from "react-spinners";
import ImageUploadStore from "../shared/ImageUpload";
import upsertReview from "@/actions/Review/upsertReview";
import { v4 } from "uuid";

interface ReviewDetailsProps {
  productId: string;
  data?: ReviewWithImageType;
  variantsInfo: VariantInfoType[];
  reviews: ReviewWithImageType[];
  setReviews: Dispatch<SetStateAction<ReviewWithImageType[]>>;
}

export default function ReviewDetails({
  productId,
  data,
  variantsInfo,
  setReviews,
  reviews,
}: ReviewDetailsProps) {
  const [activeVariant, setActiveVariant] = useState<VariantInfoType | null>(
    variantsInfo?.[0] ?? null,
  );
  const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);
  const [images, setImages] = useState<{ url: string }[]>([]);

  const form = useForm<AddReviewSchema>({
    resolver: zodResolver(addReviewSchema) as any,
    mode: "onChange",
    defaultValues: {
      variantName: data?.variant ?? activeVariant?.variantName ?? "",
      rating: data?.rating ?? 0,
      review: data?.review ?? "",
      quantity: data?.quantity ?? "1",
      size: data?.size ?? "",
      images: data?.images || [],
      color: data?.color ?? "",
    },
  });

  const variantName = form.watch("variantName");
  const { isSubmitting: isLoading, errors } = form.formState;

  const variants = useMemo(
    () =>
      variantsInfo.map((variant) => ({
        name: variant.variantName,
        value: variant.variantName,
        images: variant.images,
        sizes: variant.sizes,
        colors: (variant.colors ?? []).join(","), // safe
      })),
    [variantsInfo],
  );

  useEffect(() => {
    if (!activeVariant && variantsInfo.length) {
      const v = variantsInfo[0];
      setActiveVariant(v);
      form.setValue("variantName", data?.variant ?? v.variantName);
    }
  }, [variantsInfo, activeVariant, form, data?.variant]);

  useEffect(() => {
    if (!variantsInfo.length) return;

    // Reset size when variant changes
    form.setValue("size", "");

    const variant = variantsInfo.find((v) => v.variantName === variantName);
    if (!variant) return;

    setActiveVariant(variant);
    setSizes(variant.sizes.map((s) => ({ name: s.size, value: s.size })));
    form.setValue("color", (variant.colors ?? []).join(",")); // safe
  }, [variantName, variantsInfo, form]);

  const handleformSubmit = async (values: AddReviewSchema) => {
    try {
      const resp = await upsertReview(productId, {
        id: data?.id || v4(),
        variant: values.variantName,
        rating: values.rating,
        review: values.review,
        images: values.images,
        size: values.size,
        color: values.color,
        quantity: values.quantity,
      });

      if (resp?.id) {
        const exisitngReview = reviews.filter(
          (review) => review.id === resp.id,
        );
        if (exisitngReview.length > 0) {
          setReviews(
            reviews.map((review) => (review.id === resp.id ? resp : review)),
          );
          return;
        }
        setReviews([resp, ...reviews]);
      }

      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  if (!variantsInfo.length) {
    return (
      <div className="rounded-2xl border bg-[#f5f5f5] p-5 text-sm text-gray-500">
        No variants available.
      </div>
    );
  }

  return (
    <div className=" p-4 bg-[#f5f5f5] rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleformSubmit)}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-black">Add a review</h1>
          </div>

          {/* Rating row */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <ReactStars
                      count={5}
                      value={field.value}
                      onChange={field.onChange}
                      size={28} // closer to screenshot
                      edit
                      isHalf
                      activeColor="#FFA41C"
                      color="#EAEAEA"
                      emptyIcon={<FaRegStar />}
                      halfIcon={<FaStarHalfAlt />}
                      filledIcon={<FaStar />}
                    />
                    <span className="text-sm text-gray-600">
                      ({(form.getValues().rating ?? 0).toFixed(1)} out of 5.0)
                    </span>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* 3-column row: Variant / Size / Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            <FormField
              control={form.control}
              name="variantName"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormControl>
                    <Select
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      options={variants}
                      placeholder="Select product"
                      subPlaceholder="Please select a product"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormControl>
                    <Select
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      options={sizes}
                      placeholder="Select size"
                      subPlaceholder="Please select a size"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormControl>
                    <Input
                      name={field.name}
                      type="number"
                      placeholder="Qty"
                      value={field.value ? field.value.toString() : ""}
                      onChange={(value) => field.onChange(value.toString())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Review textarea */}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormControl>
                  <Textarea
                    placeholder="Write your review here..."
                    value={field.value ? field.value.toString() : ""}
                    onChange={field.onChange}
                    // screenshot-style tall box
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="mt-3">
                    <ImageUploadStore
                      maxImages={3}
                      value={field.value.map((image) => image.url)}
                      disabled={isLoading}
                      onChange={(url) => {
                        setImages((prevImages) => {
                          const updatedImages = [...prevImages, { url }];
                          if (updatedImages.length <= 3) {
                            field.onChange(updatedImages);
                            return updatedImages;
                          } else {
                            return prevImages;
                          }
                        });
                      }}
                      onRemove={(url) => {
                        field.onChange([
                          ...field.value.filter((img) => img.url !== url),
                        ]);
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Errors */}
          <div className="space-y-1 text-sm text-destructive">
            {errors.rating && <p>{errors.rating.message}</p>}
            {errors.size && <p>{errors.size.message}</p>}
            {errors.review && <p>{errors.review.message}</p>}
          </div>

          {/* Submit button bottom-right */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="h-11 rounded-full px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <PulseLoader size={5} color="#ffffff" />
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// "use client";

// import { ReviewWithImageType, VariantInfoType } from "@/lib/type";
// import {
//   AddReviewSchema,
//   addReviewSchema,
// } from "@/lib/Schemas/AddReviewSchema";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useState, Dispatch, SetStateAction } from "react";

// import toast from "react-hot-toast";
// import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
// import ReactStars from "react-rating-stars-component";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import Select from "@/components/store/ui/select";

// import Input from "../ui/input";
// import Textarea from "../ui/textarea";
// import { Button } from "../ui/button";
// import { PulseLoader } from "react-spinners";

// interface ReviewDetailsProps {
//   productId: string;
//   data?: ReviewWithImageType;
//   variantsInfo: VariantInfoType[];
//   setReviews: Dispatch<SetStateAction<ReviewWithImageType[]>>;
// }

// export default function ReviewDetails({
//   productId,
//   data,
//   variantsInfo,
//   setReviews,
// }: ReviewDetailsProps) {
//   const [activeVariant, setActiveVariant] = useState<VariantInfoType | null>(
//     variantsInfo?.[0] ?? null,
//   );
//   const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);

//   const form = useForm({
//     resolver: zodResolver(addReviewSchema),
//     mode: "onChange",
//     defaultValues: {
//       variantName: data?.variant ?? activeVariant?.variantName ?? "",
//       rating: data?.rating ?? 0,
//       review: data?.review ?? "",
//       quantity: data?.quantity ?? "1",
//       size: data?.size ?? "",
//       images: data?.images ?? [],
//       color: data?.color ?? "",
//     },
//   });

//   const variantName = form.watch("variantName");

//   const { isSubmitting: isLoading } = form.formState;

//   const variants = variantsInfo?.map((variant) => ({
//     name: variant.variantName,
//     value: variant.variantName,
//     images: variant.images,
//     sizes: variant.sizes,
//     colors: (variant.colors ?? []).join(","),
//   }));

//   useEffect(() => {
//     if (!activeVariant && variantsInfo?.length) {
//       const v = variantsInfo[0];
//       setActiveVariant(v);
//       form.setValue("variantName", data?.variant ?? v.variantName);
//     }
//   }, [variantsInfo, activeVariant, form, data?.variant]);

//   useEffect(() => {
//     if (!variantsInfo?.length) return;

//     form.setValue("size", "");
//     const variant = variantsInfo.find((v) => v.variantName === variantName);
//     if (!variant) return;

//     setActiveVariant(variant);
//     setSizes(variant.sizes.map((s) => ({ name: s.size, value: s.size })));
//     form.setValue("color", (variant.colors ?? []).join(","));
//   }, [variantName, variantsInfo, form]);

//   // Errors
//   const errors = form.formState.errors;

//   const handleformSubmit = async (values: AddReviewSchema) => {
//     try {
//       console.log("SUBMIT values:", values);
//       const ok = await form.trigger();
//       if (!ok) return;
//       // submit logic here...
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       toast.error("Failed to submit review. Please try again.");
//     }
//   };

//   if (!variantsInfo?.length) {
//     return (
//       <div className="p-4 bg-[#f5f5f5] rounded-xl">No variants available.</div>
//     );
//   }

//   return (
//     <div>
//       <div className="p-4 bg-[#f5f5f5] rounded-xl">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleformSubmit)}>
//             <div className="flex flex-col space-y-4">
//               <div className="pt-4">
//                 <h1 className="font-bold text-2xl">Add a review</h1>
//               </div>

//               <div className="flex flex-col gap-3">
//                 <FormField
//                   control={form.control}
//                   name="rating"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <div className="flex items-center gap-x-2">
//                           <ReactStars
//                             count={5}
//                             value={field.value}
//                             onChange={field.onChange}
//                             size={40}
//                             edit={true}
//                             isHalf
//                             activeColor="#FFA41C"
//                             color="#EAEAEA"
//                             emptyIcon={<FaRegStar />}
//                             halfIcon={<FaStarHalfAlt />}
//                             filledIcon={<FaStar />}
//                           />
//                           <span>
//                             ({(form.getValues().rating ?? 0).toFixed(1)} out of
//                             5.0)
//                           </span>
//                         </div>
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//                 <div className="w-full flex flex-wrap gap-x-4">
//                   <div className="flex items-center flex-wrap gap-2">
//                     <FormField
//                       control={form.control}
//                       name="variantName"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Select
//                               name={field.name}
//                               value={field.value}
//                               onChange={field.onChange}
//                               options={variants}
//                               placeholder="Select product"
//                               subPlaceholder="Please select a product"
//                             />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <FormField
//                     control={form.control}
//                     name="size"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormControl>
//                           <Select
//                             name={field.name}
//                             value={field.value}
//                             onChange={field.onChange}
//                             options={sizes}
//                             placeholder="Select size"
//                             subPlaceholder="Please select a size"
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="quantity"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormControl>
//                           <Input
//                             name={field.name}
//                             type="number"
//                             placeholder="Quantity(optional)"
//                             onChange={(value) =>
//                               field.onChange(value.toString())
//                             }
//                             value={field.value ? field.value.toString() : ""}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <FormField
//                   control={form.control}
//                   name="review"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Write your review here..."
//                           value={field.value ? field.value.toString() : ""}
//                           onChange={field.onChange}
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="space-y-2 text-destructive">
//                 {errors.rating && <p>{errors.rating.message}</p>}
//                 {errors.size && <p>{errors.size.message}</p>}
//                 {errors.review && <p>{errors.review.message}</p>}
//               </div>
//               <div className="w-full flex justify-end">
//                 <Button type="submit" className="w-36 h-12">
//                   {isLoading ? (
//                     <PulseLoader size={5} color="#ffffff" />
//                   ) : (
//                     "Submit Review"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { ReviewWithImageType, VariantInfoType } from "@/lib/type";
// import {
//   AddReviewSchema,
//   addReviewSchema,
// } from "@/lib/Schemas/AddReviewSchema";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState, useEffect, Dispatch, SetStateAction } from "react";

// import toast from "react-hot-toast";
// import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
// import ReactStars from "react-rating-stars-component";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// interface ReviewDetailsProps {
//   productId: string;
//   data?: ReviewWithImageType;
//   variantsInfo: VariantInfoType[];
//   setReviews: Dispatch<SetStateAction<ReviewWithImageType[]>>;
// }

// const ReviewDetails = ({
//   productId,
//   data,
//   variantsInfo,
//   setReviews,
// }: ReviewDetailsProps) => {
//   const [activeVariant, setActiveVariant] = useState<VariantInfoType | null>(
//     variantsInfo?.[0] ?? null,
//   );
//   const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);

//   const form = useForm({
//     resolver: zodResolver(addReviewSchema),
//     mode: "onChange",
//     defaultValues: {
//       //setting dafault form values from data(if available) or setting it to empty string
//       variantName: data?.variant ?? activeVariant?.variantName ?? "",
//       rating: data?.rating ?? 0,
//       review: data?.review ?? "",
//       quantity: data?.quantity ?? "1",
//       size: data?.size ?? "",
//       images: data?.images ?? [],
//       color: data?.color ?? "",
//     },
//   });

//   //Loading status based on form submission
//   const { isSubmitting: isLoading, errors } = form.formState;

//   const handleformSubmit = async (values: AddReviewSchema) => {
//     try {
//       console.log("SUBMIT raw:", form.getValues());
//       console.log("SUBMIT values:", values);
//       const ok = await form.trigger();
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       toast.error("Failed to submit review. Please try again.");
//     }
//   };

//   //extract the variant Name from the data and set it as the active variant
//   const variants = variantsInfo?.map((variant) => ({
//     name: variant.variantName,
//     value: variant.variantName,
//     images: variant.images,
//     sizes: variant.sizes,
//     colors: variant.colors.map((color) => color.hexCode).join(","),
//   }));

//   const variantName = form.watch("variantName");

//   useEffect(() => {
//     form.setValue("size", "");
//     const variant = variantsInfo.find((v) => v.variantName === variantName);
//     if (!variant) return;

//     setActiveVariant(variant);
//     setSizes(variant.sizes.map((s) => ({ name: s.size, value: s.size })));
//     form.setValue("color", variant.colors.map((c) => c.hexCode).join(","));
//   }, [variantName, variantsInfo, form]);

//   return (
//     <div>
//       <div className="p-4 bg-[#f5f5f5] rounded-xl">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleformSubmit)}>
//             <div className="flex flex-col space-y-4">
//               {/* Title */}
//               <div className="pt-4">
//                 ,<h1 className="font-bold text-2xl"> Add a review</h1>
//               </div>

//               {/* form items */}
//               <div className="flex flex-col gap-3">
//                 <FormField
//                   control={form.control}
//                   name="rating"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <div className="flex items-center gap-x-2">
//                           <ReactStars
//                             count={5}
//                             value={field.value}
//                             onChange={field.onChange}
//                             size={40}
//                             edit={true}
//                             isHalf
//                             activeColor="#FFA41C" // Amazon-like gold
//                             color="#EAEAEA" // light gray
//                             emptyIcon={<FaRegStar />}
//                             halfIcon={<FaStarHalfAlt />}
//                             filledIcon={<FaStar />}
//                           />
//                           <span>
//                             ({form.getValues().rating.toFixed(1)} out of 5.0)
//                           </span>
//                         </div>
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default ReviewDetails;
