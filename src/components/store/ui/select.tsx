import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface SelectProps {
  name: string;
  value: string;
  placeholder?: string;
  subPlaceholder?: string;
  options: { name: string; value: string; image?: string; colors?: string }[];
  onChange: (value: string) => void;
  error?: string;
}

const Select = ({
  name,
  value,
  placeholder,
  subPlaceholder,
  options,
  onChange,
  error,
}: SelectProps) => {
  //state to manage dropdown open/close
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //get the active Variant
  const [activeVariant, setActiveVariant] = useState(
    options.find((option) => option.value === value),
  );

  const toggleDopdown = () => {
    setIsOpen((prev) => !prev);
  };

  //   Handle Option Click
  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setActiveVariant(options.find((option) => option.value === optionValue));
    setIsOpen(false);
  };

  return (
    <div className="w-full relative z-50">
      <div>
        <div className="relative">
          {activeVariant?.image && (
            <Image
              src={activeVariant.image}
              alt=""
              height={50}
              width={50}
              layout="fill"
              objectFit="cover"
              className="absolute h-10 w-10 rounded-full top-1/2 -translate-y-1/2 left-2 shadow-md object-top object-cover"
            />
          )}
          <input
            className={cn(
              "w-full pr-6 pl-8 py-4 rounded-xl outlined-none duration-200 bg-white mt-2",
              {
                "ring-1 ring-transparent focus:ring-[#11BE86]":
                  !activeVariant?.colors,
                "pl-14": activeVariant?.image,
              },
            )}
            placeholder={placeholder}
            value={value}
            onFocus={toggleDopdown}
            onBlur={() => setIsOpen(false)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-16 w-full left-0 rounded-xl border p-4  bg-white shadow-lg">
          <p className="font-semibold text-xs text-[#5D5D5F">
            {subPlaceholder}
          </p>
          <ul className="flex gap-2 flex-col mt-2">
            {options.map((option) => (
              <li
                key={option.value}
                className="flex items-center gap-x-2 px-2 cursor-pointer text-sm hover:bg-green-100 py-2 rounded-lg"
                onMouseDown={() => handleOptionClick(option.value)}
              >
                {option.image && (
                  <Image
                    src={option.image}
                    alt=""
                    height={100}
                    width={100}
                    // layout="fixed"
                    // objectFit="cover"
                    className="w-10 h-10  rounded-full shadow-md object-top object-cover"
                  />
                )}
                <span>{option.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
