import { z } from "zod";

export const storeDefaultShippingDetailsSchema = z.object({
  returnPolicy: z
    .string()
    .min(10, "Return policy must be at least 10 characters long"),
  defaultShippingService: z
    .string()
    .min(2, "Shipping service must be at least 2 characters long"),
  defaultShippingFeePerItem: z
    .number()
    .min(0, "Shipping fee per item cannot be negative"),
  defaultShippingFeeAdditionalItem: z
    .number()
    .min(0, "Shipping fee for additional items cannot be negative"),
  defaultShippingFeePerKg: z
    .number()
    .min(0, "Shipping fee per kg cannot be negative"),
  defaultShippingFeeFixed: z
    .number()
    .min(0, "Fixed shipping fee cannot be negative"),
  defaultDeliveryTimeMin: z
    .number()
    .min(0, "Minimum delivery time cannot be negative"),
  defaultDeliveryTimeMax: z
    .number()
    .min(0, "Maximum delivery time cannot be negative"),
});

export type StoreDefaultShippingDetailsData = z.infer<
  typeof storeDefaultShippingDetailsSchema
>;
