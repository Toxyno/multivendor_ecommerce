"use client";
import ShippingRateDetails from "@/components/dashboard/forms/ShippingRateDetails";
import CustomModal from "@/components/dashboard/shared/custommodal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CountryWithShippingRateType } from "@/lib/type";
import { useModal } from "@/providers/ModalProvider";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";

export const columns: ColumnDef<CountryWithShippingRateType>[] = [
  {
    accessorKey: "countryName",
    header: "Country",
    cell: ({ row }) => <span>{row.original.countryName}</span>,
  },
  {
    accessorKey: "shippingService",
    header: "Shipping Service",
    cell: ({ row }) => (
      <span>{row.original.ShippingRate?.shippingService || "Default"}</span>
    ),
  },
  {
    accessorKey: "shippingFeePerItem",
    header: "Shipping Fee Per Item",
    cell: ({ row }) => {
      const fee = row.original.ShippingRate?.shippingFeePerItem;
      return (
        <span>
          {fee === undefined || fee === null
            ? "Default"
            : fee === 0
            ? "Free"
            : fee}
        </span>
      );
    },
  },

  {
    accessorKey: "shippingFeeAdditionalItem",
    header: "Shipping Fee For Additional Item",
    cell: ({ row }) => {
      const fee = row.original.ShippingRate?.shippingFeeAdditionalItem;

      return (
        <span>
          {fee === undefined || fee === null
            ? "Default"
            : fee === 0
            ? "Free"
            : fee}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeePerKg",
    header: "Shipping Fee Per Kg",

    cell: ({ row }) => {
      const fee = row.original.ShippingRate?.shippingFeePerKg;
      return (
        <span>
          {fee === undefined || fee === null
            ? "Default"
            : fee === 0
            ? "Free"
            : fee}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeeFixed",
    header: "Fixed Shipping Fee",

    cell: ({ row }) => {
      const fee = row.original.ShippingRate?.shippingFeeFixed;
      return (
        <span>
          {fee === undefined || fee === null
            ? "Default"
            : fee === 0
            ? "Free"
            : fee}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryTimeMin",
    header: "Delivery Time Min (days)",
    cell: ({ row }) => (
      <span>{row.original.ShippingRate?.deliveryTimeMin || "Default"}</span>
    ),
  },
  {
    accessorKey: "deliveryTimeMax",
    header: "Delivery Time Max (days)",
    cell: ({ row }) => (
      <span>{row.original.ShippingRate?.deliveryTimeMax || "Default"}</span>
    ),
  },
  {
    accessorKey: "returnPolicy",
    header: "Return Policy",
    cell: ({ row }) => (
      <span>{row.original.ShippingRate?.returnPolicy || "Default"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return <CellActions rowData={rowData} />;
    },
  },
];

//define the props interface for CellAction Component

interface CellActionsProps {
  rowData: CountryWithShippingRateType;
}

//CellActions component Definition

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  //hooks
  const { setOpen } = useModal();
  //const router = useRouter();
  const params = useParams<{ storeUrl: string }>();

  //const urlVal = await params.storeUrl;

  //return null if the row data is invalid
  if (!rowData) {
    return null;
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                //Custome model component to edit shipping rate
                <CustomModal>
                  <ShippingRateDetails
                    data={rowData}
                    storeURL={params.storeUrl}
                  />
                </CustomModal>
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  );
};
