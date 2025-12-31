"use client";
//import { Category } from "@/generated/prisma/client";
import type { Category } from "@/types/Category";
//import { CategoryDetailsSchema, categoryDetailsSchema } from "@/lib/schemas";
import { categoryDetailsSchema } from "@/lib/categoryDetailsSchema";
import type { CategoryDetailsSchema } from "@/lib/categoryDetailsSchema";

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
import { upsertCategory } from "@/actions/categories/upsertCategory";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface CategoryDetailsProps {
  // Define any props if needed in the future
  data?: Category;
  //cloudinaryKey?: string;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user

  console.log("Schema keys:", Object.keys(categoryDetailsSchema.shape));

  const form = useForm({
    resolver: zodResolver(categoryDetailsSchema),
    mode: "onTouched",
    defaultValues: data
      ? {
          name: data.name,
          url: data.url,
          featured: data.featured,
          image: data.image ? [{ url: data.image }] : [],
        }
      : {
          name: "",
          url: "",
          featured: false,
          image: [],
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
          }
        : {
            name: "",
            url: "",
            featured: false,
            image: [],
          }
    );
  }, [data, form]);

  //The we move to the On Submit function
  const handleformSubmit = async (values: CategoryDetailsSchema) => {
    console.log("SUBMIT raw:", form.getValues());
    console.log("SUBMIT values:", values);
    const ok = await form.trigger(); // runs zod resolver validation now
    if (!ok) return;

    //const v = form.getValues();
    const raw = form.getValues();
    values = categoryDetailsSchema.parse(raw); // guarantees shape

    try {
      //You can add your form submission logic here
      //For example, you can call an API to save the category details
      console.log("Form submitted successfully:", values);
      //upsert the category details

      const response = await upsertCategory({
        id: data?.id ?? v4(),
        name: values.name, //We are picking the values in the value field and not the one in the data field because that is what is being sent
        url: values.url,
        featured: values.featured,
        image: values.image?.[0].url ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      //displaying te success message
      toast({
        title: data?.id
          ? "Category updated successfully"
          : `Congratulation! '${response?.name}' is now created`,
      });

      //redirecting the user to the categories page
      if (data?.id) {
        router.refresh(); //it refrshes the data without reshresing the page
      } else {
        router.push("/dashboard/admin/categories");
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
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data.name} category information`
              : "Let us Create a new category. You can edit this category later from the categories table or the category page. "}
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
                    <FormLabel>Category name</FormLabel>
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
                    <FormLabel>Category url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/category-url"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
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
                        Mark this category as featured. Featured categories will
                        be highlighted on the homepage.
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
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
