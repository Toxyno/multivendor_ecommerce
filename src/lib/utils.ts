// src/lib/utils.ts (client-safe)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";
import { CartProductType } from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

export const extractColorsFromImage = async (
  imageUrl: string,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5);
        const hexColors = palette.map(
          (c) =>
            `#${((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2])
              .toString(16)
              .slice(1)
              .toUpperCase()}`,
        );
        resolve(hexColors);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

/**
 * Function: getShippingDateRange
 * Description: Returns the shipping date range by adding the specified min and max days to the current date.
 * Parameters:
 *   - minDays: The minimum number of days for shipping.
 *   - maxDays: The maximum number of days for shipping.
 * Returns: A string representing the shipping date range in the format "MMM D, YYYY - MMM D, YYYY".
 */
export const getShippingDateRange = (
  minDays: number,
  maxDays: number,
): { minstring: string; maxstring: string } => {
  //Get the current date
  const currentDate = new Date();

  //calculate the mindate by adding the mindays to current date
  const minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + minDays);
  //calculate the maxdate by adding the maxdays to current date
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + maxDays);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const minDateString = minDate.toLocaleDateString(undefined, options);
  const maxDateString = maxDate.toLocaleDateString(undefined, options);
  //Return the shipping date range as a string
  return { minstring: minDateString, maxstring: maxDateString };
};

//Function to validate the product data before adding it to the cart
export const isProductValidToBeAddedToCart = (
  product: CartProductType,
): boolean => {
  //check  that all required fields are filled
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    image,
    quantity,
    price,
    sizeId,
    size,
    stock,
    shippingFee,
    variantImage,
    weight,
    extraShippingFee,
    shippingMethod,
    deliveryTimeMin,
    deliveryTimeMax,
  } = product;

  //Ensure that all required fields are filled and valid
  if (
    !productId ||
    !variantId ||
    !productSlug ||
    !variantSlug ||
    !name ||
    !variantName ||
    !image ||
    quantity <= 0 ||
    price < 0 ||
    !sizeId ||
    !size ||
    stock <= 0 ||
    shippingFee < 0 ||
    !variantImage ||
    weight <= 0 ||
    extraShippingFee < 0 ||
    !shippingMethod ||
    deliveryTimeMin < 0 ||
    deliveryTimeMax < deliveryTimeMin
  ) {
    return false;
  }

  return true;
};

// export function censorName(firstName: string, lastName: string): string {
//   const censoredFirstName = firstName[0] + "*".repeat(firstName.length - 1);
//   const censoredLastName = lastName[0] + "*".repeat(lastName.length - 1);
//   return `${censoredFirstName} ${censoredLastName}`;
// }

//Function to censor names
type CensorReturnType = {
  firstName: string;
  lastName: string;
  fullName: string;
};

export function censorName(
  firstName: string,
  lastName: string,
): CensorReturnType {
  const censor = (name: string): string => {
    if (name.length <= 2) return name;

    //get the first and last character of the name and replace the middle characters with asterisks
    const firstChar = name[0];
    const lastChar = name.at(-1);

    //calculate how many characters to censor by subtracting 2 from the total length of the name
    const middleChars = "*".repeat(name.length - 2);

    return `${firstChar}${middleChars}${lastChar}`;
  };

  const censoredFirstName = censor(firstName);
  const censoredLastName = censor(lastName);
  const censorfullName = `${firstName.at(0)} *** ${lastName.at(-1)}`;

  return {
    firstName: censoredFirstName,
    lastName: censoredLastName,
    fullName: censorfullName,
  };
}
