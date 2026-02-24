"use client";

// React, Next.js
import { FC, useEffect, useState, useRef } from "react";
import Image from "next/image";

// Cloudinary
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  maxImages: number;
}

const ImageUploadStore: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  maxImages,
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {Array.from({ length: maxImages }, (_, index) => index).map((index) => (
          <div key={index} className="relative">
            {/* Delete image btn */}
            <div className="z-10 absolute top-2 right-2">
              <Button
                onClick={() => onRemove(value[index])}
                type="button"
                variant="destructive"
                size="icon"
                className="rounded-full hidden"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            {/* Image */}
            {value[index] ? (
              <div className="bg-gray-200">
                <Image
                  width={80}
                  height={80}
                  className="object-cover w-20 h-20 rounded-md"
                  alt=""
                  src={value[index]}
                />
              </div>
            ) : (
              <button
                type="button"
                className="w-20 h-20 bg-gray-200 grid place-items-center cursor-pointer rounded-md"
                onClick={() => btnRef?.current?.click()}
              >
                <Plus className="text-gray-300" />
              </button>
            )}
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="goShopEcommerce">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <button
              type="button"
              disabled={disabled}
              ref={btnRef}
              onClick={onClick}
              className="hidden"
            ></button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploadStore;

// "use client";

// import { FC, useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { CldUploadWidget } from "next-cloudinary";
// import { Plus, Trash } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface ImageUploadProps {
//   disabled?: boolean;
//   value: string[];
//   maxImages: number;
//   onChange: (url: string, index: number) => void;
//   onRemove: (url: string, index: number) => void;
// }

// const ImageUploadStore: FC<ImageUploadProps> = ({
//   disabled,
//   value,
//   maxImages,
//   onChange,
//   onRemove,
// }) => {
//   const [mounted, setMounted] = useState(false);
//   const openRef = useRef<null | (() => void)>(null);
//   const activeIndexRef = useRef(0);

//   useEffect(() => setMounted(true), []);
//   if (!mounted) return null;

//   const onUpload = (result: any) => {
//     const url =
//       result?.info?.secure_url || result?.info?.url || result?.secure_url;
//     if (!url) return console.error("No URL in upload result", result);

//     onChange(url, activeIndexRef.current);
//   };

//   return (
//     <div className="flex items-center gap-2 flex-wrap">
//       {Array.from({ length: maxImages }, (_, i) => i).map((index) => {
//         const imageUrl = value?.[index];

//         return (
//           <div key={index} className="relative">
//             {imageUrl ? (
//               <>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="icon"
//                   className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
//                   disabled={disabled}
//                   onClick={() => onRemove(imageUrl, index)}
//                 >
//                   <Trash className="h-4 w-4" />
//                 </Button>
//                 <Image
//                   src={imageUrl}
//                   alt=""
//                   width={80}
//                   height={80}
//                   className="w-20 h-20 rounded-md object-cover border bg-white"
//                 />
//               </>
//             ) : (
//               <button
//                 type="button"
//                 disabled={disabled}
//                 className="w-20 h-20 rounded-md border bg-gray-100 grid place-items-center"
//                 onClick={() => {
//                   activeIndexRef.current = index;
//                   openRef.current?.();
//                 }}
//               >
//                 <Plus className="text-gray-400" />
//               </button>
//             )}
//           </div>
//         );
//       })}

//       <CldUploadWidget uploadPreset="goShopEcommerce" onSuccess={onUpload}>
//         {({ open }) => {
//           openRef.current = open;
//           return null;
//         }}
//       </CldUploadWidget>
//     </div>
//   );
// };

// export default ImageUploadStore;
