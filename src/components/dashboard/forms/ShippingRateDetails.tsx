"use client";

//import { ShippingRateDetailsSchema, ShippingRateDetailsSchema } from "@/lib/schemas";
import { shippingRateDetailsSchema } from "@/lib/Schemas/ShippingRateDetailsSchema";
import type { ShippingRateDetailsSchema } from "@/lib/Schemas/ShippingRateDetailsSchema";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { CountryWithShippingRateType } from "@/lib/type";

import { NumberInput } from "@tremor/react";
import { Textarea } from "@/components/ui/textarea";
import { upsertShippingRate } from "@/actions/ShippingRate/upsertShippingRate";
import { useModal } from "@/providers/ModalProvider";

interface ShippingRateDetailsProps {
  // Define any props if needed in the future
  data?: CountryWithShippingRateType;
  storeURL?: string;
}

const ShippingRateDetails: FC<ShippingRateDetailsProps> = ({
  data,
  storeURL,
}) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user
  const { setClose } = useModal(); // ✅ get close function

  console.log("Schema keys:", Object.keys(shippingRateDetailsSchema.shape));

  const form = useForm({
    resolver: zodResolver(shippingRateDetailsSchema),
    mode: "onTouched",
    defaultValues: data
      ? {
          countryName: data.countryName,
          countryId: data.countryId,
          ShippingService: data.ShippingRate?.shippingService || "",
          //freeShipping: data.ShippingRate?.freeShipping || false,
          shippingFeePerItem: data.ShippingRate?.shippingFeePerItem || 0,
          shippingFeeAdditionalItem:
            data.ShippingRate?.shippingFeeAdditionalItem || 0,
          shippingFeePerKg: data.ShippingRate?.shippingFeePerKg || 0,
          shippingFeeFixed: data.ShippingRate?.shippingFeeFixed || 0,
          deliveryTimeMin: data.ShippingRate?.deliveryTimeMin || 0,
          deliveryTimeMax: data.ShippingRate?.deliveryTimeMax || 0,
        }
      : {
          countryName: "",
          countryId: "",
          ShippingService: "",
          //freeShipping: false,
          shippingFeePerItem: 0,
          shippingFeeAdditionalItem: 0,
          shippingFeePerKg: 0,
          shippingFeeFixed: 0,
          deliveryTimeMin: 0,
          deliveryTimeMax: 0,
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
            countryName: data.countryName,
            countryId: data.countryId,
            ShippingService: data.ShippingRate?.shippingService || "",
            //  freeShipping: data.ShippingRate?.freeShipping || false,
            shippingFeePerItem: data.ShippingRate?.shippingFeePerItem || 0,
            shippingFeeAdditionalItem:
              data.ShippingRate?.shippingFeeAdditionalItem || 0,
            shippingFeePerKg: data.ShippingRate?.shippingFeePerKg || 0,
            shippingFeeFixed: data.ShippingRate?.shippingFeeFixed || 0,
            deliveryTimeMin: data.ShippingRate?.deliveryTimeMin || 0,
            deliveryTimeMax: data.ShippingRate?.deliveryTimeMax || 0,
            returnPolicy: data.ShippingRate?.returnPolicy || "",
          }
        : {
            countryName: "",
            countryId: "",
            ShippingService: "",
            freeShipping: false,
            shippingFeePerItem: 0,
            shippingFeeAdditionalItem: 0,
            shippingFeePerKg: 0,
            shippingFeeFixed: 0,
            deliveryTimeMin: 0,
            deliveryTimeMax: 0,
            returnPolicy: "",
          }
    );
  }, [data, form]);

  const wasExisting = Boolean(data?.ShippingRate?.id);
  //The we move to the On Submit function
  const handleformSubmit = async (values: ShippingRateDetailsSchema) => {
    console.log("SUBMIT raw:", form.getValues());
    console.log("SUBMIT values:", values);
    const ok = await form.trigger(); // runs zod resolver validation now

    if (!ok) return;

    //const v = form.getValues();
    const raw = form.getValues();
    values = shippingRateDetailsSchema.parse(raw); // guarantees shape

    try {
      //You can add your form submission logic here
      //For example, you can call an API to save the category details
      console.log("Form submitted successfully:", values);
      //upsert the category details

      await upsertShippingRate(storeURL || "", {
        countryId: data?.countryId || values.countryId || "",
        countryName: data?.countryName || values.countryName || "",
        ShippingRate: {
          id: data?.ShippingRate?.id || v4(),
          countryId: data?.countryId || values.countryId || "",
          storeId: data?.ShippingRate?.storeId || "",
          shippingService: values.ShippingService,
          // freeShipping: values.freeShipping,
          shippingFeePerItem: values.shippingFeePerItem,
          shippingFeeAdditionalItem: values.shippingFeeAdditionalItem,
          shippingFeePerKg: values.shippingFeePerKg,
          shippingFeeFixed: values.shippingFeeFixed,
          deliveryTimeMin: values.deliveryTimeMin,
          deliveryTimeMax: values.deliveryTimeMax,
          returnPolicy: values.returnPolicy,
          createdAt: data?.ShippingRate?.createdAt || new Date(),
          updatedAt: new Date(),
        },
      });

      //displaying te success message
      toast({
        title: wasExisting
          ? "Shipping rate updated successfully"
          : "Shipping rate created successfully",
      });
      router.refresh();
      setClose();

      //check if the response is created successfully
      if (wasExisting) {
        router.refresh(); //it refrshes the data without reshresing the page
      } else {
        router.push("/dashboard/seller/stores/" + storeURL + "/shipping");
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
          <CardTitle>Shipping Rate</CardTitle>
          <CardDescription>
            Update shipping rate Information for {data?.countryName}
          </CardDescription>
        </CardHeader>
        {/* Form starts here */}
        <CardContent>
          <Form {...form}>
            {/* Form fields will go here in the future */}
            <form onSubmit={form.handleSubmit(handleformSubmit)}>
              <div className="hidden">
                <FormField
                  disabled
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  disabled
                  control={form.control}
                  name="countryName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="ShippingService"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Shipping service" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="shippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Per Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-1 shadow-none rounded-md border"
                          placeholder="Shipping fee per item"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="shippingFeeAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Per Additional Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none rounded-md border"
                          placeholder="Shipping fee per additional item"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="shippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Per Kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none rounded-md border"
                          placeholder="Shipping fee per kg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="shippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Fixed</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none rounded-md border"
                          placeholder="Shipping fee fixed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="deliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delivery Time Min</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="shadow-none rounded-md border"
                          placeholder="Delivery time min"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="deliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delivery Time Max</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="shadow-none rounded-md border"
                          placeholder="Delivery time max"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          placeholder="What is the return Policy for your store"
                          className="p-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Submit button can be added here in the future */}
              <Button type="submit" disabled={isLoading} className="mt-2">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ShippingRateDetails;
