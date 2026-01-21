"use client";

//import { StoreDefaultShippingDetailsSchema, StoreDefaultShippingDetailsSchema } from "@/lib/schemas";
import { storeDefaultShippingDetailsSchema } from "@/lib/Schemas/StoreDefaultShippingDetailsSchema";
import type { StoreDefaultShippingDetailsData } from "@/lib/Schemas/StoreDefaultShippingDetailsSchema";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { NumberInput, Textarea } from "@tremor/react";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { StoreDefaultShippingDetailsType } from "@/lib/type";

import { updateStoreDefaultShippingDetails } from "@/actions/stores/updateStoreDefaultShippingDetails";

interface StoreDefaultShippingDetailsProps {
  // Define any props if needed in the future
  data?: StoreDefaultShippingDetailsType;
  storeURL: string;
}

const StoreDefaultShippingDetails: FC<StoreDefaultShippingDetailsProps> = ({
  data,
  storeURL,
}) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user

  //get the storeURL from Params

  console.log(
    "Schema keys:",
    Object.keys(storeDefaultShippingDetailsSchema.shape)
  );

  const form = useForm({
    resolver: zodResolver(storeDefaultShippingDetailsSchema),
    mode: "onTouched",
    defaultValues: data
      ? {
          returnPolicy: data.returnPolicy,
          defaultShippingService: data.defaultShippingService,
          defaultShippingFeePerItem: data.defaultShippingFeePerItem,
          defaultShippingFeeAdditionalItem:
            data.defaultShippingFeeAdditionalItem,
          defaultShippingFeePerKg: data.defaultShippingFeePerKg,
          defaultShippingFeeFixed: data.defaultShippingFeeFixed,
          defaultDeliveryTimeMin: data.defaultDeliveryTimeMin,
          defaultDeliveryTimeMax: data.defaultDeliveryTimeMax,
        }
      : {
          returnPolicy: "",
          defaultShippingService: "",
          defaultShippingFeePerItem: 0,
          defaultShippingFeeAdditionalItem: 0,
          defaultShippingFeePerKg: 0,
          defaultShippingFeeFixed: 0,
          defaultDeliveryTimeMin: 0,
          defaultDeliveryTimeMax: 0,
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
            returnPolicy: data.returnPolicy,
            defaultShippingService: data.defaultShippingService,
            defaultShippingFeePerItem: data.defaultShippingFeePerItem,
            defaultShippingFeeAdditionalItem:
              data.defaultShippingFeeAdditionalItem,
            defaultShippingFeePerKg: data.defaultShippingFeePerKg,
            defaultShippingFeeFixed: data.defaultShippingFeeFixed,
            defaultDeliveryTimeMin: data.defaultDeliveryTimeMin,
            defaultDeliveryTimeMax: data.defaultDeliveryTimeMax,
          }
        : {
            returnPolicy: "",
            defaultShippingService: "",
            defaultShippingFeePerItem: 0,
            defaultShippingFeeAdditionalItem: 0,
            defaultShippingFeePerKg: 0,
            defaultShippingFeeFixed: 0,
            defaultDeliveryTimeMin: 0,
            defaultDeliveryTimeMax: 0,
          }
    );
  }, [data, form]);

  //The we move to the On Submit function
  const handleformSubmit = async (values: StoreDefaultShippingDetailsData) => {
    console.log("SUBMIT raw:", form.getValues());
    console.log("SUBMIT values:", values);
    const ok = await form.trigger(); // runs zod resolver validation now
    if (!ok) return;

    //const v = form.getValues();
    const raw = form.getValues();
    values = storeDefaultShippingDetailsSchema.parse(raw); // guarantees shape

    try {
      //You can add your form submission logic here
      //For example, you can call an API to save the category details
      console.log("Form submitted successfully:", values);
      //upsert the category details

      const response = await updateStoreDefaultShippingDetails(storeURL, {
        defaultShippingService: values.defaultShippingService || "",
        defaultShippingFeePerItem: values.defaultShippingFeePerItem,
        defaultShippingFeeAdditionalItem:
          values.defaultShippingFeeAdditionalItem,
        defaultShippingFeePerKg: values.defaultShippingFeePerKg,
        defaultShippingFeeFixed: values.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: values.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: values.defaultDeliveryTimeMax,
        returnPolicy: values.returnPolicy,
      } as any);

      if (response.id) {
        console.log("Store Default Shipping Details updated:", response);
        //displaying te success message
        toast({
          title: "Store Default Shipping Details Updated Successfully",
        });
      }

      //refresh data
      router.refresh();
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
          <CardTitle>Store Default Shipping Details</CardTitle>
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
                disabled={isLoading}
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shipping Service Name</FormLabel>
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

              <div className="flex flex-wrap gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping FeePerItem</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          min={0}
                          step={0.1}
                          className="shadow-none rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeeAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee For Additional Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          min={0}
                          step={0.1}
                          className="shadow-none rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Fixed</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          min={0}
                          step={0.1}
                          className="shadow-none rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Per Kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          min={0}
                          step={0.1}
                          className="shadow-none rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultDeliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Delivery Time (in days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          min={1}
                          className="shadow-none rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultDeliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Delivery Time (in days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          min={1}
                          className="shadow-none rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Return Policy</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What is the return policy for your store?"
                        className="p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button can be added here in the future */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDefaultShippingDetails;
