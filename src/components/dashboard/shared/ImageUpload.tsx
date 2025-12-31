// import { FC, useState, useEffect } from "react";
// import Image from "next/image";
// import { CldUploadWidget } from "next-cloudinary";

// interface ImageUploadProps {
//   // Define any props if needed in the futurey
//   disabled?: boolean;
//   onChange?: (value: string) => void;
//   onRemove?: (value: string) => void;
//   value?: string[];
//   type: "standard" | "profile" | "coverr";
//   dontShowPreview?: boolean;
//   //cloudinaryKey?: string;
// }

// const ImageUpload: FC<ImageUploadProps> = ({
//   disabled,
//   onChange,
//   onRemove,
//   value = [],
//   type,
//   dontShowPreview,
//   // cloudinaryKey,
// }) => {
//   //This is a workaround for the Hydration issue we could be getting from using the nextcloudinary widget
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   if (!isMounted) {
//     return null;
//   }

//   const onUpload = (result: any) => {
//     console.log("Upload Result:", result);
//     onChange?.(result.info.secure_url);
//   };

//   if (type === "profile") {
//     return (
//       <div className="relative rounded-full w-52 h-52  bg-gray-200 border-2 border-white shadow-2xl ">
//         {value.length > 0 && (
//           <Image
//             src={value[0]}
//             alt="Profile Image"
//             width={300}
//             height={300}
//             className="w-52 h-52 rounded-full object-cover absolute top-0 left-0 bottom-0 right-0"
//           />
//         )}
//         <CldUploadWidget uploadPreset="goShopEcommerce" onSuccess={onUpload}>
//           {({ open }) => {
//             const onClick = () => {
//               open();
//             };
//             return (
//               <>
//                 <button
//                   type="button"
//                   onClick={onClick}
//                   disabled={disabled}
//                   className="z-20 absolute right-0 bottom-6 flex items-center justify-center h-14 w-14 rounded-full text-white shadow-lg hover:shadow-md active:shadow-sm bg-gradient-to-t from-[#0D6EFD] to-[#4D8DFF]"
//                 >
//                   <svg
//                     viewBox="0 0 640 512"
//                     fill="white"
//                     height="1em"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
//                   </svg>
//                 </button>
//               </>
//             );
//           }}
//         </CldUploadWidget>
//       </div>
//     );
//   } else {
//     return null;
//   }
// };

// export default ImageUpload;

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onRemove?: (value: string) => void;
  value?: string[];
  type: "standard" | "profile" | "coverr";
  dontShowPreview?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  value = [],
  type,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = (result: any) => {
    // Ensure we always restore clicks back to the modal after upload
    document.body.classList.remove("cld-open");

    console.log("Upload Result:", result);
    onChange?.(result?.info?.secure_url);
  };

  if (type !== "profile") return null;

  return (
    <div className="relative rounded-full w-52 h-52 bg-gray-200 border-2 border-white shadow-2xl">
      {value.length > 0 && (
        <Image
          src={value[0]}
          alt="Profile Image"
          width={300}
          height={300}
          className="w-52 h-52 rounded-full object-cover absolute inset-0"
        />
      )}

      <CldUploadWidget
        uploadPreset="goShopEcommerce"
        onSuccess={onUpload}
        // Some versions of next-cloudinary support onClose. If yours doesn't,
        // TypeScript will complain — in that case remove this line.
        onClose={() => document.body.classList.remove("cld-open")}
      >
        {({ open }) => {
          const onClick = () => {
            // Allow Cloudinary to receive clicks above the Radix Dialog
            document.body.classList.add("cld-open");
            open();
          };

          return (
            <button
              type="button"
              onClick={onClick}
              disabled={disabled}
              className="z-20 absolute right-0 bottom-6 flex items-center justify-center h-14 w-14 rounded-full text-white shadow-lg hover:shadow-md active:shadow-sm bg-gradient-to-t from-[#0D6EFD] to-[#4D8DFF]"
            >
              <svg
                viewBox="0 0 640 512"
                fill="white"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
              </svg>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
