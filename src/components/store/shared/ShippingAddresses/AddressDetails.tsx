"use client";

import { FC, useEffect, useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SelectMenuOption, UserShippingAddressType } from "@/lib/type";
import { Country } from "@/generated/prisma";
import {
  ShippingAddressSchema,
  shippingAddressSchema,
} from "@/lib/Schemas/ShippingAddressSchema";
import { Button } from "../../ui/button";
import CountrySelector from "@/components/shared/countrySelector";
import upsertShippingaddress from "@/actions/User/upsertShippingaddress";

interface AddressDetailsProps {
  // Define any props if needed in the future
  data?: UserShippingAddressType;
  countries: Country[];
  setShow: Dispatch<SetStateAction<boolean>>;
}

const AddressDetails: FC<AddressDetailsProps> = ({
  data,
  countries,
  setShow,
}) => {
  //Initialize the neccessary hooks for our category details
  const { toast } = useToast(); //this is the hook for displaying the toast messages
  const router = useRouter(); //this is the hook for redirecting the user

  const [isOpen, setIsOpen] = useState<boolean>(false);

  //state for country selected
  const [country, setCountry] = useState<string>("Afghanistan");

  console.log("Schema keys:", Object.keys(shippingAddressSchema.shape));

  const form = useForm({
    resolver: zodResolver(shippingAddressSchema),
    mode: "onTouched",
    defaultValues: data
      ? {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address1: data.address1,
          address2: data.address2 || undefined,
          state: data.state,
          city: data.city,
          postalCode: data.postalCode,
          countryId: data.countryId,
          defaultAddress: data.defaultAddress,
        }
      : {
          firstName: "",
          lastName: "",
          phone: "",
          address1: "",
          address2: "",
          state: "",
          city: "",
          postalCode: "",
          countryId: "",
          defaultAddress: false,
        },
  });

  //loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  //We use the useEffect hook to reset the form when data changes
  useEffect(() => {
    form.reset(
      data
        ? {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address1: data.address1,
            address2: data.address2 || undefined,
            state: data.state,
            city: data.city,
            postalCode: data.postalCode,
            countryId: data.countryId,
            defaultAddress: data.defaultAddress,
          }
        : {
            firstName: "",
            lastName: "",
            phone: "",
            address1: "",
            address2: "",
            state: "",
            city: "",
            postalCode: "",
            countryId: "",
            defaultAddress: false,
          },
    );
  }, [data, form]);

  //The we move to the On Submit function
  const handleformSubmit = async (values: ShippingAddressSchema) => {
    console.log("SUBMIT raw:", form.getValues());
    console.log("SUBMIT values:", values);
    const ok = await form.trigger(); // runs zod resolver validation now
    const raw = form.getValues();
    values = shippingAddressSchema.parse(raw);
    console.log("Form submitted successfully:", values);
    if (!ok) return;

    try {
      //You can add your form submission logic here
      //For example, you can call an API to save the category details
      console.log("Form submitted successfully:", values);
      //upsert the category details

      await upsertShippingaddress({
        id: data?.id ?? v4(),
        firstName: values.firstName, //We are picking the values in the value field and not the one in the data field because that is what is being sent
        lastName: values.lastName,
        phone: values.phone,
        address1: values.address1,
        address2: values.address2 || "",
        state: values.state,
        city: values.city,
        postalCode: values.postalCode,
        countryId: values.countryId,
        userId: "", // The userId will be set in the server action based on the current user, so we can leave it empty here
        defaultAddress: values.defaultAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      //displaying te success message
      toast({
        title: data?.id
          ? "Shipping address updated successfully"
          : `Congratulation! Shipping address is now created`,
      });

      //redirecting the user to the categories page
      if (data?.id) {
        router.refresh(); //it refrshes the data without reshresing the page
        setShow(false); //close the modal after updating the address
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

  const handleCountryChange = (name: string) => {
    const country = countries.find((c) => c.name === name);
    if (country) {
      form.setValue("countryId", country.id);
    }
    setCountry(name);
  };

  return (
    <div className="pt-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleformSubmit)}
          className="space-y-6"
        >
          {/* Section title */}
          <div className="space-y-3">
            <FormLabel className="text-base font-semibold text-black">
              Contact information
            </FormLabel>

            {/* 2 columns like the reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 rounded-lg px-4"
                        placeholder="First name*"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 rounded-lg px-4"
                        placeholder="Last name*"
                        {...field}
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
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1 w-[calc(50%-8px)] !mt-6">
                  <FormControl>
                    <Input
                      className="h-12 rounded-lg px-4"
                      placeholder="Phone*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Address</FormLabel>
            <div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem className="flex-1 w-[calc(50%-8px)] !mt-6">
                    <FormControl>
                      <CountrySelector
                        id={"countries"}
                        open={isOpen}
                        onToggle={() => setIsOpen((prev) => !prev)}
                        onChange={(val) => handleCountryChange(val)}
                        selectedValue={
                          (countries.find(
                            (c) => c.name === country,
                          ) as SelectMenuOption) || countries[0]
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 rounded-lg px-4"
                        placeholder="Street, House/apartment/unit*"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 rounded-lg px-4"
                        placeholder="Apt, Suite, Uint, etc (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 rounded-lg px-4"
                        placeholder="City*"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 rounded-lg px-4"
                        placeholder="Postal Code*"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-12 rounded-lg px-4"
                      placeholder="State*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CTA */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full"
          >
            {isLoading
              ? "Saving..."
              : data?.id
                ? "Update Shipping Address"
                : "Create Shipping Address"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddressDetails;

//   return (
//     <div>
//       <Form {...form}>
//         {/* Form fields will go here in the future */}
//         <form
//           onSubmit={form.handleSubmit(handleformSubmit)}
//           className="space-y-6"
//         >
//           <div className="space-y-2">
//             <FormLabel>Contact Information</FormLabel>
//             <div className="flex items-center justify-between gap-4">
//               <FormField
//                 control={form.control}
//                 name="firstName"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormControl>
//                       <Input placeholder="First Name" {...field} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="lastName"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormControl>
//                       <Input placeholder="Last Name" {...field} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </div>

//           {/* Submit button can be added here in the future */}
//           <Button type="submit" disabled={isLoading}>
//             {isLoading
//               ? "Saving..."
//               : data?.id
//                 ? "Update Shipping Address"
//                 : "Create Shipping Address"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };#
