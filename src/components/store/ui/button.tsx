// src/components/store/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariant = cva(
  // Base: pill button, good defaults, proper disabled styles
  "group/button relative inline-flex items-center justify-center whitespace-nowrap font-bold select-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-full px-6",
  {
    variants: {
      variant: {
        // ✅ Matches your desired big CTA style (red pill)
        default: "bg-[#FD384F] text-white hover:bg-[#e23246]",
        black: "bg-black text-white hover:bg-neutral-800",
        pink: "bg-[#ffe6e7] text-[#FD384F] hover:bg-[#e4cdce] hover:text-white",
        outline:
          "bg-transparent text-[#FD384F] border border-[#FD384F] hover:bg-[#FD384F] hover:text-white rounded-md px-3 !h-8 text-sm font-medium",
        "orange-gradient":
          "bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white",
        gray: "bg-[#f5f5f5] text-[#222] border border-[#f5f5f5]",
      },
      size: {
        // ✅ Taller like your screenshot
        default: "h-12 text-sm",
        sm: "h-10 text-sm",
        icon: "h-11 w-11 p-0",
      },
      width: {
        // ✅ Fix: allow full width
        auto: "w-auto",
        full: "w-full",
      },
      rounded: {
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      // ✅ IMPORTANT: change default width to full so it matches your modal CTA
      width: "full",
      rounded: "full",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariant> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, width, rounded, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariant({ variant, size, width, rounded }),
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariant };

// import { cva, type VariantProps } from "class-variance-authority";
// import { Slot } from "@radix-ui/react-slot";
// import * as React from "react";

// const buttonVariant = cva(
//   "group/button relative inline-flex items-center justify-center gap-x-1 text-white rounded-3xl leading-6 font-bold whitespace-nowrap border border-orange-border cursor-pointer transition-all duration-300 ease-bezier-1 select-none",
//   {
//     variants: {
//       variant: {
//         default: "bg-orange-500 hover:bg-orange-600",
//         black: "bg-black",
//         pink: "bg-[#ffe6e7] text-orange-background hover:bg-[#e4cdce] hover:text-white",
//         outline:
//           "bg-transparent hover:bg-orange-background hover:text-white text-orange-background rounded-md border-orange-background px-2 !h-7 text-sm font-normal",
//         "orange-gradient":
//           "bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white h-[36px] leading-[36px] text-[14px] font-bold text-center rounded-full",
//         gray: "bg-[#f5f5f5] text-[#222] border-[#f5f5f5] h-[36px] leading-[36px] text-[14px] font-bold text-center rounded-full",
//       },
//       size: {
//         default: "h-11 py-2",
//         icon: "h-11 min-w-11 max-w-11 rounded-full",
//       },
//       width: {
//         auto: "w-auto",
//         full: "w-full",
//       },
//       rounded: {
//         full: "rounded-full",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//       width: "auto",
//     },
//   },
// );

// export interface ButtonProps
//   extends
//     React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariant> {
//   asChild?: boolean;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     { className, variant, size, width, rounded, asChild = false, ...props },
//     ref,
//   ) => {
//     const Comp = asChild ? Slot : "button";
//     return (
//       <Comp
//         className={buttonVariant({ variant, size, width, rounded, className })}
//         ref={ref}
//         {...props}
//       />
//     );
//   },
// );

// Button.displayName = "Button";

// export { Button, buttonVariant };

// // import { cva, type VariantProps } from "class-variance-authority";
// // import { Slot } from "@radix-ui/react-slot";
// // import * as React from "react";

// // const buttonVariant = cva(
// //   "group/button relative w-full flex items-center justify-center gap-x-1 text-white rounded-md",
// //   {
// //     variants: {
// //       variant: {
// //         default: "bg-orange-500 hover:bg-orange-600",
// //         black: "bg-black",
// //       },
// //       size: {
// //         default: "h-11 py-2",
// //         icon: "h-11 min-w-11 max-w-11 rounded-full",
// //       },
// //       width: {
// //         default: "w-full",
// //       },
// //       rounded: {
// //         full: "rounded-full",
// //       },
// //     },
// //     defaultVariants: {
// //       variant: "default",
// //       size: "default",
// //       width: "default",
// //     },
// //   },
// // );

// // export interface ButtonProps
// //   extends
// //     React.ButtonHTMLAttributes<HTMLButtonElement>,
// //     VariantProps<typeof buttonVariant> {
// //   asChild?: boolean;
// // }

// // const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
// //   (
// //     { className, variant, size, width, rounded, asChild = false, ...props },
// //     ref,
// //   ) => {
// //     const Comp = asChild ? Slot : "button";
// //     return (
// //       <Comp
// //         className={buttonVariant({ variant, size, width, rounded, className })}
// //         ref={ref}
// //         {...props}
// //       />
// //     );
// //   },
// // );
// // Button.displayName = "Button";

// // export { Button, buttonVariant };

// import { cva, type VariantProps } from "class-variance-authority";
// import { Slot } from "@radix-ui/react-slot";
// import * as React from "react";

// const buttonVariant = cva(
//   "group/button relative w-full flex items-center justify-center gap-x-1 text-white rounded-3xl leading-6 font-bold whitespace-nowrap border border-orange-border cursor-pointer transition-all duration-300 ease-bezier-1 select-none",
//   {
//     variants: {
//       variant: {
//         default: "bg-orange-500 hover:bg-orange-600",
//         black: "bg-black",
//         pink: "bg-[#ffe6e7] text-orange-background hover:bg-[#e4cdce] hover:text-white",
//         outline:
//           "bg-transparent hover:bg-orange-background hover:text-white text-orange-background rounded-md border-orange-background px-2 !h-7 text-sm font-normal",
//         "orange-gradient":
//           "bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white inline-block w-full h-[36px] leading-[36px] text-[14px] font-bold text-center rounded-full cursor-pointer",
//         gray: "bg-[#f5f5f5] text-[#222] border-[#f5f5f5] inline-block w-full h-[36px] leading-[36px] text-[14px] font-bold text-center rounded-full cursor-pointer",
//       },
//       size: {
//         default: "h-11 py-2",
//         icon: "h-11 min-w-11 max-w-11 rounded-full",
//       },
//       width: {
//         default: "w-full",
//       },
//       rounded: {
//         full: "rounded-full",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//       width: "default",
//     },
//   },
// );

// export interface ButtonProps
//   extends
//     React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariant> {
//   asChild?: boolean;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     { className, variant, size, width, rounded, asChild = false, ...props },
//     ref,
//   ) => {
//     const Comp = asChild ? Slot : "button";
//     return (
//       <Comp
//         className={buttonVariant({ variant, size, width, rounded, className })}
//         ref={ref}
//         {...props}
//       />
//     );
//   },
// );
// Button.displayName = "Button";

// export { Button, buttonVariant };
