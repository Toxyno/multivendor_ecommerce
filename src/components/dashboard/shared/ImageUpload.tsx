import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onRemove?: (value: string) => void;
  value?: string[];
  type: "standard" | "profile" | "cover";
  dontShowPreview?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value = [],
  type,
  dontShowPreview,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = (result: any) => {
    // Safely read the uploaded URL and only call the optional callback when present
    const url = result?.info?.secure_url as string | undefined;
    if (url) onChange?.(url);
  };

  if (type === "profile") {
    return (
      <div className="relative  rounded-full w-52 h-52 bg-gray-200 border-2 border-white shadow-2xl">
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
  } else if (type === "cover") {
    return (
      <div
        style={{ height: "348px" }}
        className="relative rounded-lg w-full bg-gray-100 bg-gradient-to-b from-gray-100 via-gray-100 to-gray-400 "
      >
        {value.length > 0 && (
          <Image
            src={value[0]}
            alt="Cover Image"
            width={1200}
            height={1200}
            className="w-full h-full rounded-lg object-cover"
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
                className="absolute bottom-10 right-2 flex items-center font-medium text-[17px] py-3 px-6 text-white bg-gradient-to-t from-[#0D6EFD] to-[#4D8DFF] border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm"
                //className="z-20 absolute right-0 bottom-6 flex items-center justify-center h-14 w-14 rounded-full text-white shadow-lg hover:shadow-md active:shadow-sm bg-gradient-to-t from-[#0D6EFD] to-[#4D8DFF]"
              >
                <svg
                  viewBox="0 0 640 512"
                  fill="white"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                </svg>
                <span>
                  {value.length > 0
                    ? "Change cover image"
                    : "Upload cover image"}
                </span>
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
    );
  } else {
    return (
      <div>
        <div className="mb-4 flex items-center gap-4">
          {value.length > 0 &&
            !dontShowPreview &&
            value.map((imageUrl) => (
              <div
                key={imageUrl}
                className="relative w-[200px] min-h-[100px] max-h-[200px]"
              >
                {/*Delete Image button */}
                <div className="z-10 absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => onRemove?.(imageUrl)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                {/*Image*/}
                <Image
                  fill
                  src={imageUrl}
                  alt="Uploaded Image"
                  className="object-cover rounded-md"
                />
              </div>
            ))}
        </div>
        <CldUploadWidget
          uploadPreset="goShopEcommerce"
          options={{
            multiple: true,
            maxFiles: 10,
            resourceType: "image",
            singleUploadAutoClose: false,
            showUploadMoreButton: true,
          }}
          onSuccess={(result) => {
            console.log("CLOUDINARY onSuccess:", result);
            const url = (result as any)?.info?.secure_url as string | undefined;
            if (url) onChange?.(url); // ✅ parent appends: [...field.value, {url}]
          }}
          onClose={() => {
            // ✅ ONLY remove here (when widget fully closes)
            document.body.classList.remove("cld-open");
          }}
        >
          {({ open }) => (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                document.body.classList.add("cld-open");
                open();
              }}
              className="flex items-center font-medium text-[17px] py-3 px-6 text-white bg-gradient-to-t from-blue-primary to-blue-300 border-none shadow-lg rounded-full"
            >
              <svg
                viewBox="0 0 640 512"
                fill="white"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
              </svg>
              <span>Upload Images</span>
            </button>
          )}
        </CldUploadWidget>
      </div>
    );
  }
};

export default ImageUpload;
