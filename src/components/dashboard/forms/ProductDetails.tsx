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

import { v4 } from "uuid";
import { FC, useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload from "../shared/ImageUpload";
import { upsertProduct } from "@/actions/products/upsertProduct";

import { useRouter } from "next/navigation";
import { productDetailsSchema } from "@/lib/Schemas/ProductDetailsSchema";
import type { ProductDetailsSchema } from "@/lib/Schemas/ProductDetailsSchema";

import { Textarea } from "@/components/ui/textarea";
import { Category, SubCategory } from "@/generated/prisma/edge";
import { ProductWithVariantType } from "@/lib/type";
import ImagesPreviewGrid from "../shared/ImagesPreviewGrid";
import ClickToAddInputs from "./clickToAddInputs";

import getAllSubCategoriesForCategory from "@/actions/categories/getAllSubCategoriesForCategory";
import { WithOutContext as ReactTags } from "react-tag-input";

//React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

//date function
import { format } from "date-fns";

//Jodit text Editorplugin
import JoditEditor from "jodit-react";

interface ProductDetailsProps {
  // Define any props if needed in the future
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  storeUrl: string;

  //cloudinaryKey?: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user

  //Jodit editor reference
  const productdescriptioneditor = useRef(null); //this
  const variantDescriptioneditor = useRef(null); //this

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
          keywords: [],
          colors: [],
          sizes: [],
          product_specs: [],
          variant_specs: [],
          saleEndDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          questions: [],
        },
  });

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

  //loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  //State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }]
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
            isSale: data.isSale,
            saleEndDate:
              data.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            brand: data.brand,
            sku: data.sku,
            keywords: data.keywords,
            colors: data.colors,
            sizes: data.sizes,
            product_specs: data.product_specs,
            variant_specs: data.variant_specs,
            questions: data.questions || [],
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
            keywords: [],
            colors: [],
            sizes: [],
            saleEndDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            product_specs: [],
            variant_specs: [],
            questions: [],
          }
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
    const ok = await form.trigger(); // runs zod resolver validation now
    if (!ok) return;

    const raw = form.getValues();
    values = productDetailsSchema.parse(raw); // guarantees shape

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
          images: values.images,
          variantImage:
            values.variantImage && values.variantImage.length > 0
              ? values.variantImage[0]
              : null,
          isSale: values.isSale || false,
          saleEndDate: values.isSale ? values.saleEndDate : "",
          description: values.description,
          sku: values.sku,
          brand: values.brand,
          keywords: keywords,
          colors: values.colors,
          sizes: values.sizes,
          product_specs: productSpecs,
          variant_specs: variantSpecs,
          questions: values.questions,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl
      );

      //displaying te success message
      toast({
        title:
          data?.productId && data?.variantId
            ? "Product updated successfully"
            : `Congratulation! product '${response?.slug}' is now created`,
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
  }, [colors, sizes, keywords, variantSpecs, productSpecs, form]);

  console.log(`the value of the checkbox: `, form.getValues().isSale);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
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
                                (img) => img.url !== url
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
                                { shouldDirty: true, shouldValidate: true }
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
                    <p className="text-sm font-medium text-destructive text-red-600">
                      {form.formState.errors.colors?.message}
                    </p>
                  )}
                </div>
              </div>
              {/* The Name */}
              <div className="flex flex-col xl:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
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
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant name</FormLabel>
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
              {/* The Product and variant description */}
              <Tabs defaultValue="product" className="w-full">
                <TabsList className="w-full grig grid-cols-2">
                  <TabsTrigger value="product">
                    Product Description{" "}
                  </TabsTrigger>
                  <TabsTrigger value="variant">Variant Description</TabsTrigger>
                </TabsList>
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
              <div className="flex flex-col xl:flex-row gap-4 hidden">
                {/* The Description */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product Description"
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
                  name="variantDescription"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Variant Description"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Category - subcategory */}
              <div className="flex flex-col xl:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Category</FormLabel>
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
                            <SelectItem key={category.id} value={category.id}>
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
                        <FormLabel>Product SubCategory</FormLabel>
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
              </div>
              {/*Offer Tag*/}
              {/* <FormField
                disabled={isLoading}
                control={form.control}
                name="offerTag"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Offer Tag</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Offer Tag"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/*brand and SKU*/}
              <div className="flex flex-col xl:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="brand"
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
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SKU"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/*variant image - keyword*/}
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
                                { shouldDirty: true, shouldValidate: true }
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
              {/* Sizes */}
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
                  header="Sizes, Prices, Quantities, Discounts"
                />
                {form.formState.errors.sizes?.message && (
                  <p className="text-sm font-medium text-destructive text-red-600">
                    {form.formState.errors.sizes?.message}
                  </p>
                )}
              </div>
              {/* Product and Variant Spec */}.
              <Tabs defaultValue="productSpec" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="productSpec">
                    Product Specification
                  </TabsTrigger>
                  <TabsTrigger value="variant">
                    Variant Specification
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="productSpec">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={productSpecs}
                      setDetails={setProductSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                    />
                    {form.formState.errors?.product_specs?.message && (
                      <p className="text-sm font-medium text-destructive text-red-600">
                        {form.formState.errors.product_specs.message}
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="variant">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={variantSpecs}
                      setDetails={setVariantSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                      visible
                    />
                    {form.formState.errors.variant_specs?.message && (
                      <p className="text-sm font-medium text-destructive text-red-600">
                        {form.formState.errors.variant_specs?.message}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              {/* Questions */}
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInputs
                  details={questions}
                  setDetails={setQuestions}
                  initialDetail={{
                    question: "",
                    answer: "",
                  }}
                  header="Customer Questions & Answers"
                />
                {form.formState.errors.questions?.message && (
                  <p className="text-sm font-medium text-destructive text-red-600">
                    {form.formState.errors.questions?.message}
                  </p>
                )}
              </div>
              {/* Is on Sale */}
              <div className="flex border rounded-md">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          //@ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>On Sale</FormLabel>
                        <FormDescription>
                          Is this product currently on sale?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {isSale && (
                  <FormField
                    control={form.control}
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <DateTimePicker
                            onChange={(date) =>
                              field.onChange(
                                date
                                  ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                  : ""
                              )
                            }
                            value={field.value ? new Date(field.value) : null}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
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
