"use client";
//import { Category } from "@/generated/prisma/client";
import type { SubCategory } from "@/types/SubCategory";
//import { SubCategoryDetailsSchema, SubCategoryDetailsSchema } from "@/lib/schemas";
import { subCategoryDetailsSchema } from "@/lib/Schemas/SubCategoryDetailsSchema";
import type { SubCategoryDetailsSchema } from "@/lib/Schemas/SubCategoryDetailsSchema";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { v4 } from "uuid";
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
import ImageUpload from "../shared/ImageUpload";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { upsertSubCategory } from "@/actions/subcategories/upsertSubCategory";
import { Category } from "@/app/dashboard/admin/categories/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { SubCategory } from "@/generated/prisma/edge";

interface SubCategoryDetailsProps {
  // Define any props if needed in the future
  data?: SubCategory;
  categories: Category[];
  //cloudinaryKey?: string;
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
  data,
  categories,
}) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user

  const form = useForm({
    resolver: zodResolver(subCategoryDetailsSchema),
    mode: "onTouched",
    defaultValues: data
      ? {
          name: data.name,
          url: data.url,
          featured: data.featured,
          image: data.image ? [{ url: data.image }] : [],
          categoryId: data?.categoryId,
        }
      : {
          name: "",
          url: "",
          featured: false,
          image: [],
          categoryId: "",
        },
  });

  // useEffect(() => {
  //   const sub = form.watch((v) => {
  //     console.log("WATCH:", v.name, v.url);
  //   });
  //   return () => sub.unsubscribe();
  // }, [form]);

  //loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  //We use the useEffect hook to reset the form when data changes
  useEffect(() => {
    form.reset(
      data
        ? {
            name: data.name,
            url: data.url,
            featured: data.featured,
            image: data.image ? [{ url: data.image }] : [],
            categoryId: data?.categoryId,
          }
        : {
            name: "",
            url: "",
            featured: false,
            image: [],
            categoryId: "",
          }
    );
  }, [data, form]);

  //The we move to the On Submit function
  const handleformSubmit = async (values: SubCategoryDetailsSchema) => {
    console.log("SUBMIT raw:", form.getValues());
    console.log("SUBMIT values:", values);
    const ok = await form.trigger(); // runs zod resolver validation now
    if (!ok) return;

    //const v = form.getValues();
    const raw = form.getValues();
    values = subCategoryDetailsSchema.parse(raw); // guarantees shape

    try {
      //You can add your form submission logic here
      //For example, you can call an API to save the category details
      console.log("Form submitted successfully:", values);
      //upsert the category details

      const response = await upsertSubCategory({
        id: data?.id ?? v4(),
        name: values.name, //We are picking the values in the value field and not the one in the data field because that is what is being sent
        url: values.url,
        featured: values.featured,
        image: values.image?.[0].url ?? "",
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      //displaying te success message
      toast({
        title: data?.id
          ? " SubCategory updated successfully"
          : `Congratulation! '${response?.name}' is now created`,
      });

      //redirecting the user to the categories page
      if (data?.id) {
        router.refresh(); //it refrshes the data without reshresing the page
      } else {
        router.push("/dashboard/admin/subcategories");
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

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SubCategory Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data.name} subcategory information`
              : "Let us Create a new subcategory. You can edit this subcategory later from the subcategories table or the subcategory page. "}
          </CardDescription>
        </CardHeader>
        {/* Form starts here */}
        <CardContent>
          <Form {...form}>
            {/* Form fields will go here in the future */}
            <form
              onSubmit={form.handleSubmit(handleformSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        disabled={isLoading}
                        onChange={(url: string) =>
                          field.onChange([...(field.value || []), { url }])
                        }
                        onRemove={(url: string) =>
                          field.onChange([
                            ...field.value?.filter(
                              (image) => image.url !== url
                            ),
                          ])
                        }
                        value={field.value?.map((image) => image.url) || []}
                        //cloudinaryKey={cloudinaryKey}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubCategory name</FormLabel>
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
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubCategory url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/subcategory-url"
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
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

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        //@ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        Mark this subcategory as featured. Featured
                        subcategories will be highlighted on the homepage.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {/* Submit button can be added here in the future */}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : data?.id
                  ? "Update SubCategory Information"
                  : "Create SubCategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
