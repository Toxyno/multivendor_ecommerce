// "use client";

// import {
//   Dispatch,
//   FC,
//   SetStateAction,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// interface ColorPaletteProps {
//   extractedColors?: string[];
//   colorsData?: { color: string }[];
//   setColors?: Dispatch<SetStateAction<{ color: string }[]>>;
// }

// const ColorPalette: FC<ColorPaletteProps> = ({
//   extractedColors = [],
//   colorsData = [],
//   setColors,
// }) => {
//   const [activeBg, setActiveBg] = useState<string>(
//     extractedColors[0] ?? "#111"
//   );

//   // keep activeBg in sync when extractedColors changes
//   useEffect(() => {
//     if (extractedColors.length === 0) return;
//     const id = setTimeout(() => {
//       setActiveBg(extractedColors[0]);
//     }, 0);
//     return () => clearTimeout(id);
//   }, [extractedColors]);

//   // simple contrast so spinner always shows
//   const spinnerColor = useMemo(() => {
//     const hex = activeBg.replace("#", "");
//     if (hex.length !== 6) return "#fff";
//     const r = parseInt(hex.slice(0, 2), 16);
//     const g = parseInt(hex.slice(2, 4), 16);
//     const b = parseInt(hex.slice(4, 6), 16);
//     const lum = 0.299 * r + 0.587 * g + 0.114 * b;
//     return lum > 160 ? "#000" : "#fff";
//   }, [activeBg]);

//   // const toggleColor = (color: string) => {
//   //   setActiveBg(color);

//   //   if (!setColors) return;

//   //   const exists = colorsData.some((c) => c.color === color);
//   //   setColors((prev) =>
//   //     exists ? prev.filter((c) => c.color !== color) : [...prev, { color }]
//   //   );
//   // };

//   // Handle Selecting/ Adding color to product colors
//   const handleAddProductColor = (color: string) => {
//     if (!color || !setColors) return;
//     // Use colorsData (objects with a `color` prop) as the current colors list
//     const currentColorsData = colorsData ?? [];
//     // Check if the color already exists in colorsData
//     const existingColor = currentColorsData.find((c) => color === c.color);
//     if (existingColor) return;

//     // Check for empty inputs and remove them
//     const newColors = currentColorsData.filter((c) => c.color !== "");
//     // Add the new color to colorsData, avoiding duplicates from previous state
//     setColors((prev) => {
//       const prevClean = (prev ?? []).filter((c) => c.color?.trim() !== "");
//       if (prevClean.some((c) => c.color === color)) return prev;
//       return [...prevClean, { color }];
//     });
//   };

//   return (
//     <div className="pt-10 w-[320px] h-[160px] rounded-b-md overflow-visible">
//       <div className="w-[320px] h-[180px] rounded-md perspective-1000 relative overflow-visible">
//         <div className="relative w-full flex items-center justify-center bg-white h-16 rounded-t-md overflow-visible">
//           <div
//             className="absolute w-16 h-16 grid place-items-center shadow-lg rounded-full -top-10"
//             style={{ backgroundColor: activeBg }}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="22"
//               height="22"
//               viewBox="0 0 16 16"
//               className="animate-spin"
//               fill="currentColor"
//               style={{ color: spinnerColor }}
//             >
//               <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
//               <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
//             </svg>
//           </div>
//         </div>

//         <div className="w-full h-[180px] absolute bottom-0 flex items-center justify-center">
//           {extractedColors.map((color, index) => (
//             <div
//               key={`${color}-${index}`}
//               onClick={() => handleAddProductColor(color)}
//               onMouseEnter={() => setActiveBg(color)}
//               className="w-20 h-[80px] cursor-pointer transition-all duration-200 ease-linear relative hover:w-[120px]"
//               style={{ backgroundColor: color }}
//               aria-label={`Select ${color}`}
//             >
//               <div className="w-full h-8 text-center text-xs font-semibold absolute -top-6 text-black">
//                 {color}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ColorPalette;

// "use client";

// // React
// import { Dispatch, FC, SetStateAction, useState } from "react";

// // Pros definition
// interface ColorPaletteProps {
//   extractedColors?: string[]; // Extracted Colors (Array of strings)
//   colors?: { color: string }[]; // List of selected colors from form
//   setColors: Dispatch<SetStateAction<{ color: string }[]>>; // Setter function for colors
// }

// // ColorPalette component for displaying a color palette
// const ColorPalette: FC<ColorPaletteProps> = ({
//   colors,
//   extractedColors,
//   setColors,
// }) => {
//   // State to track the active color
//   const [activeColor, setActiveColor] = useState<string>("");

//   // Handle Selecting/ Adding color to product colors
//   const handleAddProductColor = (color: string) => {
//     console.log(`I got clicked on color: ${color}`);
//     console.log(`extractedColors: ${extractedColors}`);
//     if (!color || !setColors) return;

//     // Ensure colorsData is not undefined, defaulting to an empty array if it is
//     const currentColorsData = colors ?? [];

//     // Check if the color already exists in colorsData
//     const existingColor = currentColorsData.find((c) => color === c.color);
//     if (existingColor) return;

//     // Check for empty inputs and remove them
//     const newColors = currentColorsData.filter((c) => c.color !== "");
//     // Add the new color to colorsData
//     //setColors([...newColors, { color: color }]);
//     setColors((prev) => {
//       const prevClean = (prev ?? []).filter((c) => c.color?.trim() !== "");
//       if (prevClean.some((c) => c.color === color)) return prev;
//       return [...prevClean, { color }];
//     });
//   };

//   // Color component for individual color block
//   const Color = ({ color }: { color: string }) => {
//     console.log(`i got to the color component with color: ${color}`);
//     return (
//       <div
//         className="w-20 h-[80px] cursor-pointer transition-all duration-100 ease-linear relative hover:w-[120px] hover:duration-300"
//         style={{ backgroundColor: color }}
//         onMouseEnter={() => setActiveColor(color)}
//         onClick={() => handleAddProductColor(color)}
//       >
//         {/* Color label */}
//         <div className="w-full h-8 text-center text-xs font-semibold absolute -top-6 text-black">
//           {color}
//         </div>
//       </div>
//     );
//   };
//   return (
//     <div className="pt-10 w-[320px] h-[160px] rounded-b-md overflow-hidden">
//       {/* Color palette container */}
//       <div className="w-[320px] h-[180px] rounded-md perspective-1000">
//         {/* Active color display */}
//         <div className="relative w-full flex items-center justify-center bg-white h-16 rounded-t-md">
//           {/* Active color circle */}
//           <div
//             className="absolute w-16 h-16 grid place-items-center shadow-lg rounded-full -top-10"
//             style={{ backgroundColor: activeColor || "#fff" }}
//           >
//             {/* Spinner icon */}
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="22"
//               height="22"
//               fill={activeColor ? "#fff" : "#000"}
//               viewBox="0 0 16 16"
//               className="animate-spin"
//             >
//               <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
//               <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
//             </svg>
//           </div>
//         </div>
//         {/* Color blocks */}
//         <div className="w-full h-[180px] absolute bottom-0 !flex items-center justify-center">
//           {/* Map over colors to display color blocks */}

//           {extractedColors?.map((color, index) => (
//             <Color key={index} color={color} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ColorPalette;

// React
import { Dispatch, FC, SetStateAction, useState } from "react";

// Pros definition
interface ColorPaletteProps {
  extractedColors?: string[]; // Extracted Colors (Array of strings)
  colors?: { color: string }[]; // List of selected colors from form
  setColors: Dispatch<SetStateAction<{ color: string }[]>>; // Setter function for colors
}

// ColorPalette component for displaying a color palette
const ColorPalette: FC<ColorPaletteProps> = ({
  colors,
  extractedColors,
  setColors,
}) => {
  // State to track the active color
  const [activeColor, setActiveColor] = useState<string>("");

  // Handle Selecting/ Adding color to product colors
  const handleAddProductColor = (color: string) => {
    if (!color || !setColors) return;

    // Ensure colorsData is not undefined, defaulting to an empty array if it is
    const currentColorsData = colors ?? [];

    // Check if the color already exists in colorsData
    const existingColor = currentColorsData.find((c) => color === c.color);
    if (existingColor) return;

    // Check for empty inputs and remove them
    const newColors = currentColorsData.filter((c) => c.color !== "");
    // Add the new color to colorsData
    setColors([...newColors, { color: color }]);
  };

  // Color component for individual color block
  const Color = ({ color }: { color: string }) => {
    return (
      <div
        className="w-20 h-[80px] cursor-pointer transition-all duration-100 ease-linear relative hover:w-[120px] hover:duration-300"
        style={{ backgroundColor: color }}
        onMouseEnter={() => setActiveColor(color)}
        onClick={() => handleAddProductColor(color)}
      >
        {/* Color label */}
        <div className="w-full h-8 text-center text-xs font-semibold absolute -top-6 text-black">
          {color}
        </div>
      </div>
    );
  };
  return (
    <div className="pt-10 w-[320px] h-[160px] rounded-b-md overflow-hidden">
      {/* Color palette container */}
      <div className="w-[320px] h-[180px] rounded-md perspective-1000">
        {/* Active color display */}
        <div className="relative w-full flex items-center justify-center bg-white h-16 rounded-t-md">
          {/* Active color circle */}
          <div
            className="absolute w-16 h-16 grid place-items-center shadow-lg rounded-full -top-10"
            style={{ backgroundColor: activeColor || "#fff" }}
          >
            {/* Spinner icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill={activeColor ? "#fff" : "#000"}
              viewBox="0 0 16 16"
              className="animate-spin"
            >
              <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
            </svg>
          </div>
        </div>
        {/* Color blocks */}
        <div className="w-full h-[180px] absolute bottom-0 !flex items-center justify-center">
          {/* Map over colors to display color blocks */}
          {extractedColors?.map((color, index) => (
            <Color key={index} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
