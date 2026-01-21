import { z } from "zod";

export const shippingRateDetailsSchema = z.object({
  ShippingService: z
    .string()
    .min(2, "Shipping service must be at least 2 characters long")
    .max(50, "Shipping service must be at most 50 characters long"),
  countryId: z.string().uuid("Invalid country ID").optional(),
  freeShipping: z.boolean().default(false),
  countryName: z.string(),
  shippingFeePerItem: z.number(),
  shippingFeeAdditionalItem: z.number(),
  shippingFeePerKg: z.number(),
  shippingFeeFixed: z.number(),
  deliveryTimeMin: z.number(),
  deliveryTimeMax: z.number(),
  returnPolicy: z
    .string()
    .min(1, "Return policy must be at least 1 character long"),
});

export type ShippingRateDetailsSchema = z.infer<
  typeof shippingRateDetailsSchema
>;
