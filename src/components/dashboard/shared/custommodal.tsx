"use client";

import * as React from "react";
import { useModal } from "@/providers/ModalProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// If you don't have shadcn VisuallyHidden, use this small helper:
function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

type Props = {
  heading?: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxWidth?: string;
};

const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  heading,
  maxWidth,
}: Props) => {
  const { isOpen, setClose } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent
        className={cn(
          // IMPORTANT: use overflow-auto, not overflow-y-scroll
          // and avoid forcing h-screen unless you really need it
          "max-h-[85vh] overflow-auto bg-card",
          maxWidth
        )}
        // IMPORTANT: prevents “click outside” handlers from interfering
        // with 3rd-party portals (Cloudinary) in some setups
        onInteractOutside={(e) => {
          // Do NOT always preventDefault unless needed.
          // If Cloudinary is still blocked, uncomment the next line:
          // e.preventDefault();
        }}
      >
        <DialogHeader className="text-left">
          {/* Always provide a DialogTitle for accessibility */}
          {heading ? (
            <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>
          ) : (
            <VisuallyHidden>
              <DialogTitle>Dialog</DialogTitle>
            </VisuallyHidden>
          )}

          {subheading && <DialogDescription>{subheading}</DialogDescription>}
        </DialogHeader>

        {/* ✅ Put interactive content here (NOT inside DialogHeader) */}
        <div className="pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;

// "use client";

// // Provider
// import { useModal } from "@/providers/ModalProvider";

// // UI components
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// //import { DialogTitle } from "@radix-ui/react-dialog";
// import { cn } from "@/lib/utils";

// type Props = {
//   heading?: string;
//   subheading?: string;
//   children: React.ReactNode;
//   defaultOpen?: boolean;
//   maxWidth?: string;
// };

// const CustomModal = ({
//   children,
//   defaultOpen,
//   subheading,
//   heading,
//   maxWidth,
// }: Props) => {
//   const { isOpen, setClose } = useModal();
//   return (
//     <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
//       <DialogContent
//         className={cn(
//           "overflow-y-scroll md:max-h-175 md:h-fit h-screen bg-card",
//           maxWidth
//         )}
//       >
//         <DialogHeader className="pt-8 text-left">
//           {heading && (
//             <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>
//           )}
//           {subheading && <DialogDescription>{subheading}</DialogDescription>}

//           {children}
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CustomModal;
