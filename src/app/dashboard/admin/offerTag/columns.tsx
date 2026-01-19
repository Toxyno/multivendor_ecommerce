"use client";

// React, Next.js imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// Custom components
import CustomModal from "@/components/dashboard/shared/custommodal";

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/ModalProvider";

// Actions
import getOfferTagById from "@/actions/OfferTag/getOfferTagById";

// Lucide icons
import { Edit, MoreHorizontal, Trash } from "lucide-react";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

import deleteOfferTag from "@/actions/OfferTag/deleteOfferTag";
// Prisma models
import { OfferTag } from "@/generated/prisma/edge";
import OfferTagDetails from "@/components/dashboard/forms/OfferTagDetails";

export const columns: ColumnDef<OfferTag>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.getValue("name")}
        </span>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      return <span>{row.original.url}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return <CellActions rowData={rowData} />;
    },
  },
];

//Define props interface for CellActions component
interface CellActionsProps {
  rowData: OfferTag;
}

//CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  //Return null if rowData  or rowData.id dont exist
  if (!rowData || !rowData.id) {
    return null;
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                //Custom modal component
                <CustomModal>
                  {/* OfferTagDetails form component for editing offer tag */}
                  <OfferTagDetails data={{ ...rowData }} />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getOfferTagById(rowData.id),
                  };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} />
              Delete Offer Tag
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you sure you want to delete this offer tag?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-4 text-left">
            This action cannot be undone. This will permanently delete the offer
            tag.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex item-center">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteOfferTag(rowData.id);
              toast({
                title: "Offer Tag Deleted",
                description: "The offer tag has been successfully deleted.",
              });
              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
