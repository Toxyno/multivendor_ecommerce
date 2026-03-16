import { z } from "zod";

export const shippingAddressSchema = z.object({
  countryId: z
    .string({ required_error: "Country is required" })
    .uuid("Invalid country id"),

  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be at most 50 characters long")
    .regex(/^[a-zA-Z]+$/, "First name may only contain letters"),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name must be at most 50 characters long")
    .regex(/^[a-zA-Z]+$/, "Last name may only contain letters"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

  address1: z
    .string({ required_error: "Address line 1 is required" })
    .min(5, "Address line 1 must be at least 5 characters long")
    .max(100, "Address line 1 must be at most 100 characters long"),

  address2: z
    .string()
    .max(100, "Address line 2 must be at most 100 characters long")
    .optional(),

  state: z
    .string({ required_error: "State is required" })
    .min(2, "State must be at least 2 characters long")
    .max(50, "State must be at most 50 characters long"),

  city: z
    .string({ required_error: "City is required" })
    .min(2, "City must be at least 2 characters long")
    .max(50, "City must be at most 50 characters long"),

  postalCode: z
    .string({ required_error: "Postal code is required" })
    .min(1, "Postal code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format"),

  defaultAddress: z.boolean().default(false),
});

export type ShippingAddressSchema = z.infer<typeof shippingAddressSchema>;
