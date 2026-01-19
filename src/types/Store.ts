export type Store = {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  averageRating: number;
  featured: boolean;
  returnPolicy: string | null;
  defaultShippingService: string | null;
  defaultShippingFee: number | null;
  defaultDeliveryTimeMin: number | null;
  defaultDeliveryTimeMax: number | null;
  url: string;

  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};
