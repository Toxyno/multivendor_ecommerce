"use client";

{
  /*UI Component*/
}
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog } from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelect } from "react-multi-select-component";

import { v4 } from "uuid";
import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload from "../shared/ImageUpload";
import { upsertProduct } from "@/actions/products/upsertProduct";

import { useRouter } from "next/navigation";
import { productDetailsSchema } from "@/lib/Schemas/ProductDetailsSchema";
import type { ProductDetailsSchema } from "@/lib/Schemas/ProductDetailsSchema";

import {
  Category,
  OfferTag,
  SubCategory,
  ShippingFeeMethod,
  Country,
} from "@/generated/prisma/edge";
import { ProductWithVariantType } from "@/lib/type";
import ImagesPreviewGrid from "../shared/ImagesPreviewGrid";
import InputFieldSet from "../shared/InputFieldSet";
import ClickToAddInputs from "./clickToAddInputs";

import getAllSubCategoriesForCategory from "@/actions/categories/getAllSubCategoriesForCategory";
import { WithOutContext as ReactTags } from "react-tag-input";
import getAllOfferTags from "@/actions/OfferTag/getAllOfferTags";

//React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

//date function
import { format } from "date-fns";

//Jodit text Editorplugin
import JoditEditor from "jodit-react";
import { NumberInput } from "@tremor/react";
import { ArrowRight, Dot } from "lucide-react";
import { useTheme } from "next-themes";

const shippingFeeMethods = [
  {
    value: ShippingFeeMethod.ITEM,
    decription: "ITEM(Fees calculated based on NUmber of products.)",
  },
  {
    value: ShippingFeeMethod.WEIGHT,
    decription: "WEIGHT(Fees calculated based on the weight of the products.)",
  },
  {
    value: ShippingFeeMethod.FIXED,
    decription: "FIXED(Fees calculated based on a Fix fee.)",
  },
];

interface ProductDetailsProps {
  // Define any props if needed in the future
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  storeUrl: string;
  countries: Country[];
  // offerTags: OfferTag[];

  //cloudinaryKey?: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
  countries,
  // offerTags,
}) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user

  //Is new variant Page
  const isNewVariantPage = data?.productId && !data?.variantId;

  //Jodit editor reference
  const productdescriptioneditor = useRef(null); //this
  const variantDescriptioneditor = useRef(null); //this

  //Jodit Configurations
  const { theme } = useTheme();
  const joditConfig = useMemo(() => {
    return {
      theme: theme === "dark" ? "dark" : "default",
      readonly: false,
    };
  }, [theme]);

  //Form hook for managing form state and validation
  const form = useForm({
    resolver: zodResolver(productDetailsSchema),
    mode: "onTouched",
    defaultValues: data
      ? {
          name: data.name,
          description: data.description,
          variantName: data.variantName,
          variantDescription: data.variantDescription,
          images: data.images?.map((image) => ({ url: image.url })) || [],
          variantImage: data.variantImage
            ? [{ url: data.variantImage.url }]
            : [],
          categoryId: data.categoryId,
          subCategoryId: data.subCategoryId,
          isSale: data.isSale,
          weight: data.weight,
          saleEndDate:
            data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          brand: data.brand,
          sku: data.sku,
          keywords: data.keywords,
          colors: data.colors,
          sizes: data.sizes,
          product_specs: data.product_specs,
          variant_specs: data.variant_specs,
          questions: data.questions || [],
          freeShippingForAllCountries:
            data.freeShippingForAllCountries || false,
          freeShippingCountriesId: data.freeShippingCountriesId || [],
          shippingFeeMethod: data.shippingFeeMethod,
        }
      : {
          name: "",
          description: "",
          variantName: "",
          variantDescription: "",
          images: [],
          variantImage: [],
          categoryId: "",
          subCategoryId: "",
          isSale: false,
          brand: "",
          sku: "",
          weight: 0,
          keywords: [],
          colors: [],
          sizes: [],
          product_specs: [],
          variant_specs: [],
          saleEndDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          questions: [],
          freeShippingForAllCountries: false,
          freeShippingCountriesId: [],
          shippingFeeMethod: undefined,
        },
  });

  const saleEndDate = useWatch({
    control: form.control,
    name: "saleEndDate",
  });

  const formattedDate = useMemo(() => {
    if (!saleEndDate) return "";
    return new Date(saleEndDate).toLocaleString("en-US", {
      weekday: "short",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      hour12: true,
    });
  }, [saleEndDate]);

  // useEffect(() => {
  //   const sub = form.watch((v) => {
  //     console.log("WATCH:", v.name, v.url);
  //   });
  //   return () => sub.unsubscribe();
  // }, [form]);

  const isSale = useWatch({
    control: form.control,
    name: "isSale",
  });

  const freeShippingForAllCountries = useWatch({
    control: form.control,
    name: "freeShippingForAllCountries",
  });

  const freeShippingCountriesId = useWatch({
    control: form.control,
    name: "freeShippingCountriesId",
  });

  //loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  //State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  //state for the offerTags
  const [offerTags, setOfferTags] = useState<OfferTag[]>([]);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }],
  );

  //State for sizes
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >([{ size: "", price: 0.01, quantity: 1, discount: 0 }]);

  //State for product specifications
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  //State for product variant specifications
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  //State for product variant specifications
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  //We use the useEffect hook to reset the form when data changes
  useEffect(() => {
    form.reset(
      data
        ? {
            name: data.name,
            description: data.description,
            variantName: data.variantName,
            variantDescription: data.variantDescription,
            images: data.images?.map((image) => ({ url: image.url })),
            variantImage: data.variantImage
              ? [{ url: data.variantImage.url }]
              : [],
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId,
            offerTagId: data.offerTagId,
            isSale: data.isSale,
            saleEndDate:
              data.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            brand: data.brand,
            sku: data.sku,
            weight: data.weight,
            keywords: data.keywords,
            colors: data.colors,
            sizes: data.sizes,
            product_specs: data.product_specs,
            variant_specs: data.variant_specs,
            questions: data.questions || [],
            freeShippingForAllCountries:
              data.freeShippingForAllCountries || false,
            freeShippingCountriesId: data.freeShippingCountriesId || [],
            shippingFeeMethod: data.shippingFeeMethod,
          }
        : {
            name: "",
            description: "",
            variantName: "",
            variantDescription: "",
            images: [],
            variantImage: [],
            categoryId: "",
            subCategoryId: "",
            offerTagId: "",
            isSale: false,
            brand: "",
            sku: "",
            weight: 0,
            keywords: [],
            colors: [],
            sizes: [],
            saleEndDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            product_specs: [],
            variant_specs: [],
            questions: [],
            freeShippingForAllCountries: false,
            freeShippingCountriesId: [],
            shippingFeeMethod: undefined,
          },
    );
  }, [data, form]);

  // Fetch subcategories whenever the selected category changes
  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategoryId) {
        setSubCategories([]);
        return;
      }
      try {
        const res = await getAllSubCategoriesForCategory(selectedCategoryId);
        setSubCategories(res);
      } catch (err) {
        // on error, clear subcategories
        setSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [selectedCategoryId]);

  //fetch offer tags when the component mounts
  useEffect(() => {
    const fetchOfferTags = async () => {
      try {
        const resp = await getAllOfferTags();
        setOfferTags(resp);
      } catch (error) {
        console.error("Error fetching offer tags:", error);
      }
    };
    fetchOfferTags();
  }, []);

  //Handle Keywords input
  const [keywords, setKeywords] = useState<string[]>([]);

  interface keywordProps {
    id: string;
    text: string;
  }
  const handleAddition = (keyword: keywordProps) => {
    if (keywords.length === 10) return; //max 10 keywords
    //const newKeywords = keywords.map((k) => k.text);
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = async (i: number) => {
    const newKeywords = keywords.filter((_, index) => index !== i);
    setKeywords(newKeywords);
  };

  const handleformSubmit = async (values: ProductDetailsSchema) => {
    const oka = await form.trigger();
    if (!oka) {
      console.log("BLOCKED BY ERRORS:", form.formState.errors);
      return;
    }
    console.log("SUBMIT raw:", form.getValues());
    console.log("SUBMIT values:", values);

    const raw = form.getValues();
    values = productDetailsSchema.parse(raw); // guarantees shape

    console.log("SUBMIT questions from RAW:", values.questions);
    console.log(
      `The form validation errormessages are:`,
      form.formState.errors,
    );

    try {
      console.log("Form submitted successfully:", values);
      console.log("storeUrl passed to upsertProduct:", storeUrl);
      const response = await upsertProduct(
        {
          productId: data?.productId ? data?.productId : v4(),
          variantId: data?.variantId ? data?.variantId : v4(),
          name: values.name, //We are picking the values in the value field and not the one in the data field because that is what is being sent
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          offerTagId: values.offerTagId || "",
          images: values.images,
          variantImage:
            values.variantImage && values.variantImage.length > 0
              ? values.variantImage[0]
              : null,
          isSale: values.isSale || false,
          saleEndDate: values.isSale ? values.saleEndDate : "",
          description: values.description,
          sku: values.sku,
          weight: values.weight,
          brand: values.brand,
          keywords: keywords,
          colors: values.colors,
          sizes: values.sizes,
          product_specs: productSpecs,
          variant_specs: variantSpecs,
          questions: values.questions,
          freeShippingForAllCountries: values.freeShippingForAllCountries,
          freeShippingCountriesId: values.freeShippingCountriesId,
          shippingFeeMethod: values.shippingFeeMethod,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl,
      );

      //displaying te success message
      toast({
        title:
          data?.productId && data?.variantId
            ? "Product updated successfully"
            : `Congratulation! product '${values.name}' is now created`,
      });

      //redirecting the user to the stores page
      if (data?.productId && data?.variantId) {
        router.refresh(); //it refreshes the data without refreshing the page
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}/products`);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Oops! Something went wrong",
        description: error?.message || "Something went wrong while saving.",
        variant: "destructive",
      });
    }

    console.log(values);
  };
  //console.log("Colors watcher:", colors);

  //Whenever colors sizes keywords changes, we update the form values
  useEffect(() => {
    form.setValue("colors", colors, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue("sizes", sizes, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue("keywords", keywords, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue("variant_specs", variantSpecs, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    form.setValue("product_specs", productSpecs, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue("questions", questions, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [colors, sizes, keywords, variantSpecs, productSpecs, questions, form]);
  console.log(`the value of the checkbox: `, form.getValues().isSale);
  console.log("SUBMIT questions:", form.getValues().questions);

  //Countries Options
  type CountryOption = {
    label: string;
    value: string;
  };

  const countryOptions: CountryOption[] = countries.map((country) => ({
    label: country.name,
    value: country.id,
  }));

  //Handle delete country for free shipping
  const handleDeleteCountryFreeShipping = (index: number) => {
    //get the current value
    const currentValues = form.getValues("freeShippingCountriesId") || [];
    //filter out the one to be deleted
    const updatedValues = currentValues.filter((_, i) => i !== index);
    //update the form value
    form.setValue("freeShippingCountriesId", updatedValues, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isNewVariantPage
              ? `Add a new Variant to ${data?.name}`
              : `Create a New Product`}
          </CardTitle>
          <CardDescription>
            {data?.productId && data.variantId
              ? `Update ${data.name} product information`
              : "Let us Create a new product. You can edit this product later from the product settings page. "}
          </CardDescription>
        </CardHeader>
        {/* Form starts here */}
        <CardContent>
          <Form {...form}>
            {/* Form fields will go here in the future */}
            <form
              onSubmit={form.handleSubmit(handleformSubmit, (error) => {
                console.log("FORM ERRORS ON SUBMIT:", error);
              })}
              className="space-y-4"
            >
              {/* This is the for the images and Colors */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                {/* This is the Image Upload and Preview Grid */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <div className="space-y-4">
                          <ImagesPreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const current = field.value ?? [];
                              const updatedImages = current.filter(
                                (img) => img.url !== url,
                              );
                              form.setValue("images", updatedImages, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="mt-4" />
                          <ImageUpload
                            type="standard"
                            dontShowPreview
                            value={(field.value ?? []).map((img) => img.url)}
                            onChange={(url) => {
                              const current = form.getValues("images") ?? [];
                              form.setValue("images", [...current, { url }], {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                            }}
                            onRemove={(url) => {
                              const current = form.getValues("images") ?? [];
                              form.setValue(
                                "images",
                                current.filter((img) => img.url !== url),
                                { shouldDirty: true, shouldValidate: true },
                              );
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/*Colors*/}
                <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={data?.colors || colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {form.formState.errors.colors?.message && (
                    <p className="text-sm font-medium  text-red-600">
                      {form.formState.errors.colors?.message}
                    </p>
                  )}
                </div>
              </div>
              {/* The Name */}
              <InputFieldSet label="Name">
                <div className="flex flex-col xl:flex-row gap-4">
                  {!isNewVariantPage && (
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Product Name"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="variantName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Variant name"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldSet>
              {/* The Product and variant description */}
              <InputFieldSet
                label="Description"
                description={
                  isNewVariantPage
                    ? "Add a description for this variant. You can also add a general description for the product that will be common for all variants."
                    : "Note: The product description is the main description for the product.You can add an extra description specific to this variant using the 'Variant Description' tab."
                }
              >
                <Tabs
                  defaultValue={isNewVariantPage ? "variant" : "product"}
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grig grid-cols-2">
                      <TabsTrigger value="product">
                        Product Description{" "}
                      </TabsTrigger>
                      <TabsTrigger value="variant">
                        Variant Description
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="product">
                    {" "}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={productdescriptioneditor}
                              config={joditConfig}
                              value={form.getValues("description")} // Initial content
                              onChange={(content) => {
                                form.setValue("description", content, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="variant">
                    {" "}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="variantDescription"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={variantDescriptioneditor}
                              config={joditConfig}
                              value={form.getValues("variantDescription")} // Initial content
                              onChange={(content) => {
                                form.setValue("variantDescription", content, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </InputFieldSet>
              {/* Category - Subcategory - Offer */}
              {!isNewVariantPage && (
                <InputFieldSet label="Category & Subcategory">
                  <div className="flex flex-col xl:flex-row gap-4">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            disabled={isLoading || categories.length === 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 w-full">
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a category"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedCategoryId && (
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="subCategoryId"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              disabled={
                                isLoading ||
                                categories.length === 0 ||
                                !form.getValues().categoryId
                              }
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 w-full">
                                  <SelectValue
                                    defaultValue={field.value}
                                    placeholder="Select a subCategory"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subCategories.map((subcategory) => (
                                  <SelectItem
                                    key={subcategory.id}
                                    value={subcategory.id}
                                  >
                                    {subcategory.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/*Offer Tag*/}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="offerTagId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            disabled={isLoading || categories.length === 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl className="h-12 w-full">
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select an offer tag"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {offerTags?.map((offer) => (
                                <SelectItem key={offer.id} value={offer.id}>
                                  {offer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </InputFieldSet>
              )}
              {/*brand , SKU and Weight*/}
              <InputFieldSet
                label={
                  !isNewVariantPage ? "Brand, SKU and Weight" : "SKU and Weight"
                }
              >
                <div className="flex flex-col xl:flex-row gap-4">
                  {!isNewVariantPage && (
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Product brand"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Product SKU"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Product Weight"
                            min={0.01}
                            step={0.01}
                            className="shadow-none rounded-md text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldSet>
              {/*variant image - keyword*/}
              <InputFieldSet label="Variant Image and Keywords">
                <div className="flex items-center gap-10 py-14">
                  {/*Variant Image*/}
                  <div className="border-r pr-10">
                    <FormField
                      control={form.control}
                      name="variantImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="ml-10">
                            Product Variant Image
                          </FormLabel>
                          <FormControl>
                            <ImageUpload
                              type="profile"
                              dontShowPreview
                              value={(field.value ?? []).map((img) => img.url)}
                              onChange={(url) => {
                                field.onChange([{ url }]);
                              }}
                              onRemove={(url) => {
                                const current = form.getValues("images") ?? [];
                                form.setValue(
                                  "images",
                                  current.filter((img) => img.url !== url),
                                  { shouldDirty: true, shouldValidate: true },
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage className="mt-4" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Keywords Input */}
                  <div className="w-full flex-1 space-y-3">
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem className="relative flex-1">
                          <FormLabel>Product Keywords</FormLabel>
                          <FormControl>
                            <ReactTags
                              handleAddition={handleAddition}
                              handleDelete={() => {}}
                              placeholder="keywords (e.g  winter jacket, warm, stylish"
                              // autocomplete
                              classNames={{
                                tagInputField:
                                  "bg-background border rounded-md  p-2 w-full  focus:outlined-none",
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-wrap gap-1">
                      {keywords.map((keyword, index) => (
                        <div
                          key={index}
                          className="text-xs inline-flex  items-center px-3 py-1 bg-blue-200 text-blue-700 gap-2 rounded-full gap-x-2"
                        >
                          <span>{keyword}</span>
                          <span
                            onClick={() => handleDeleteKeyword(index)}
                            className="cursor-pointer"
                          >
                            x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </InputFieldSet>
              {/* Sizes */}
              <InputFieldSet label="Sizes, Prices, Quantities and Discounts">
                <div className="w-full flex flex-col gap-y-3">
                  <ClickToAddInputs
                    details={sizes}
                    setDetails={setSizes}
                    initialDetail={{
                      size: "",
                      price: 0.01,
                      quantity: 1,
                      discount: 0,
                    }}
                    header=""
                    containerClassName="flex-1"
                    inputClassName="w-full"
                  />
                  {form.formState.errors.sizes?.message && (
                    <p className="text-sm font-medium text-destructive text-red-600">
                      {form.formState.errors.sizes?.message}
                    </p>
                  )}
                </div>
              </InputFieldSet>
              {/* Product and Variant Spec */}
              <InputFieldSet
                label="Specifications"
                description={
                  !isNewVariantPage
                    ? "Product specifications are the main specifications for the product that are common across all variants. Variant specifications are specific to this variant and will override any conflicting product specifications for this variant."
                    : "Variant specifications are specific to this variant and will override any conflicting product specifications for this variant."
                }
              >
                <Tabs
                  defaultValue={
                    isNewVariantPage ? "variantSpecs" : "productSpecs"
                  }
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="productSpec">
                        Product Specification
                      </TabsTrigger>
                      <TabsTrigger value="variant">
                        Variant Specification
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="productSpec">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        details={productSpecs}
                        setDetails={setProductSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                        header=""
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {form.formState.errors?.product_specs?.message && (
                        <p className="text-sm font-medium text-destructive text-red-600">
                          {form.formState.errors.product_specs.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="variantSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        details={variantSpecs}
                        setDetails={setVariantSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                        header=""
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {form.formState.errors.variant_specs?.message && (
                        <p className="text-sm font-medium text-destructive text-red-600">
                          {form.formState.errors.variant_specs?.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </InputFieldSet>
              {!isNewVariantPage && (
                <InputFieldSet label="Customer Questions & Answers">
                  {/* Questions and Answers*/}
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={questions}
                      setDetails={setQuestions}
                      initialDetail={{
                        question: "",
                        answer: "",
                      }}
                      header=""
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {form.formState.errors.questions?.message && (
                      <p className="text-sm font-medium text-destructive text-red-600">
                        {form.formState.errors.questions?.message}
                      </p>
                    )}
                  </div>
                </InputFieldSet>
              )}
              {/* Product Shipping Fee Method */}
              {!isNewVariantPage && (
                <InputFieldSet label="Product Shipping Method">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="shippingFeeMethod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          disabled={isLoading || categories.length === 0}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 w-full">
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select Shipping Fee Calculation"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shippingFeeMethods.map((method) => (
                              <SelectItem
                                key={method.value}
                                value={method.value}
                              >
                                {method.decription}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </InputFieldSet>
              )}
              {/* Free Shipping */}
              {!isNewVariantPage && (
                <InputFieldSet
                  label="Free Shipping (Optional)"
                  description="Free Shipping World Wide"
                >
                  <div>
                    <label
                      htmlFor="freeShippingforAll"
                      className="ml-5 flex items-center gap-x-2 cursor-pointer"
                    >
                      <FormField
                        control={form.control}
                        name="freeShippingForAllCountries"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                <input
                                  type="checkbox"
                                  id="freeShippingforAll"
                                  checked={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  className="hidden"
                                />
                                <Checkbox
                                  checked={field.value}
                                  //@ts-expect-error
                                  onCheckedChange={field.onChange}
                                />
                              </>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span>Yes </span>
                    </label>
                  </div>
                  <div>
                    <p className="mt-4 text-sm text-muted-foreground dark:text-gray-400 pb-3 flex">
                      <Dot className="me-1" />
                      If not select the countries you want to offer free
                      shipping to in the "Free Shipping Countries" tab in the
                      Shipping settings after creating the product.
                    </p>
                  </div>
                  <div>
                    {!freeShippingForAllCountries && (
                      <div>
                        <FormField
                          control={form.control}
                          name="freeShippingCountriesId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <MultiSelect
                                  className="max-w-200!"
                                  options={countryOptions} //Array of country options with label and value
                                  value={field.value ?? []} //Selected country IDs
                                  labelledBy="Select countries with free shipping"
                                  onChange={(selected: CountryOption[]) =>
                                    field.onChange(selected)
                                  } //Update form value on change
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <p className="mt-4 text-sm text-muted-foreground dark:text-gray-400 pb-3 flex">
                          <Dot className="me-1" />
                          List of countries your offer free shipping for this
                          product: &nbsp;
                        </p>
                        {freeShippingCountriesId?.length === 0 && "None"}
                        {/* List of the Free Shipping Countries */}
                        <div className=" flex flex-wrap gap-1">
                          {freeShippingCountriesId?.map((country, index) => (
                            <div
                              key={country.id}
                              className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-md gap-x-2"
                            >
                              <span>{country.label}</span>
                              <span
                                className="cursor-pointer hover:text-red-500"
                                onClick={() =>
                                  handleDeleteCountryFreeShipping(index)
                                }
                              >
                                X
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </InputFieldSet>
              )}
              {/* Is on Sale */}
              <InputFieldSet
                label="Sale"
                description="Is your product on sale?"
              >
                <div>
                  <label
                    htmlFor="yes"
                    className="ml-5 flex items-center gap-x-2 cursor-pointer"
                  >
                    <FormField
                      control={form.control}
                      name="isSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              <input
                                type="checkbox"
                                id="yes"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                className="hidden"
                              />
                              <Checkbox
                                checked={field.value}
                                //@ts-expect-error
                                onCheckedChange={field.onChange}
                              />
                            </>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>Yes </span>
                  </label>

                  {isSale && (
                    <div className="mt-5">
                      <p className="text-sm text-muted-foreground dark:text-gray-400 pb-3 flex">
                        <Dot className="me-1" />
                        When does Sale end?
                      </p>
                      <div className="flex items-center gap-x-5">
                        <FormField
                          control={form.control}
                          name="saleEndDate"
                          render={({ field }) => (
                            <FormItem className="ml-4">
                              <FormControl>
                                <DateTimePicker
                                  className="inline-flex items-center gap-2 border rounded-md shadow-sm"
                                  calendarIcon={
                                    <span className="text-gray-500 hover:text-gray-600">
                                      📅
                                    </span>
                                  }
                                  clearIcon={
                                    <span className="text-gray-500 hover:text-gray-600">
                                      ✖️
                                    </span>
                                  }
                                  onChange={(date) =>
                                    field.onChange(
                                      date
                                        ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                        : "",
                                    )
                                  }
                                  value={
                                    field.value ? new Date(field.value) : null
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <ArrowRight className="w-4 text-[#1087ff]" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              </InputFieldSet>
              {/* This is the Submit Button */}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : data?.productId && data?.variantId
                    ? "Update Product"
                    : "Create Product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
