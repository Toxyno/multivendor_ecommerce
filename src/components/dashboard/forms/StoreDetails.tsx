"use client";

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
import { upsertStore } from "@/actions/stores/upsertStore";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { storeDetailsSchema } from "@/lib/Schemas/StoreDetailsSchema";
import type { StoreDetailsSchema } from "@/lib/Schemas/StoreDetailsSchema";
import { Store } from "@/types/Store";
import { Textarea } from "@/components/ui/textarea";

interface StoreDetailsProps {
  // Define any props if needed in the future
  data?: Store;
  //cloudinaryKey?: string;
}

const StoreDetails: FC<StoreDetailsProps> = ({ data }) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user

  const form = useForm({
    resolver: zodResolver(storeDetailsSchema),
    mode: "onTouched",
    defaultValues: data
      ? {
          name: data.name,
          description: data.description,
          email: data.email,
          phone: data.phone,
          cover: data.cover ? [{ url: data.cover }] : [],
          status: data.status.toString(),
          url: data.url,
          featured: data.featured,
          logo: data.logo ? [{ url: data.logo }] : [],
        }
      : {
          name: "",
          description: "",
          email: "",
          phone: "",
          cover: [],
          status: "PENDING",
          url: "",
          featured: false,
          logo: [],
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
            cover: [{ url: data.cover }],
            description: data.description,
            email: data.email,
            phone: data.phone,
            status: data.status.toString(),
            logo: [{ url: data.logo }],
          }
        : {
            name: "",
            url: "",
            featured: false,
            cover: [],
            description: "",
            email: "",
            phone: "",
            status: "PENDING",
            logo: [],
          }
    );
  }, [data, form]);

  //The we move to the On Submit function
  const handleformSubmit = async (values: StoreDetailsSchema) => {
    console.log("SUBMIT raw:", form.getValues());
    console.log("SUBMIT values:", values);
    const ok = await form.trigger(); // runs zod resolver validation now
    if (!ok) return;

    const raw = form.getValues();
    values = storeDetailsSchema.parse(raw); // guarantees shape

    try {
      //You can add your form submission logic here
      //For example, you can call an API to save the category details
      console.log("Form submitted successfully:", values);
      //upsert the category details

      const response = await upsertStore({
        id: data?.id ?? v4(),
        name: values.name, //We are picking the values in the value field and not the one in the data field because that is what is being sent
        url: values.url,
        featured: values.featured,
        logo: values.logo[0].url,
        cover: values.cover[0].url,
        description: values.description,
        email: values.email,
        phone: values.phone,
        // status: values.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      //displaying te success message
      toast({
        title: data?.id
          ? "Store updated successfully"
          : `Congratulation! '${response?.name}' is now created`,
      });

      //redirecting the user to the stores page
      if (data?.id) {
        router.refresh(); //it refrshes the data without reshresing the page
      } else {
        router.push(`/dashboard/seller/stores/${response?.url}`);
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
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data.name} store information`
              : "Let us Create a new store. You can edit this store later from  the store settings page. "}
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
              {/* This is the for the Logo and Cover Images */}
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-96">
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
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
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
              </div>

              {/* The Name */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store name</FormLabel>
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
              {/* The Description */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* The Email and Phone fields */}
              <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* The Store URL */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/store-url"
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
                        This store will appear on the home page as a featured
                        store.
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
                  ? "Update Store"
                  : "Create Store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
