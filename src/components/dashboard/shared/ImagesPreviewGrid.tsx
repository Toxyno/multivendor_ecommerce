import Image from "next/image";
import NoImageImg from "../../../../public/assets/images/no_image_2.png";
import { cn, extractColorsFromImage, getGridClassName } from "@/lib/utils";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Trash } from "lucide-react";
import ColorPalette from "./colorPalette";

interface ImagesPreviewGridProps {
  images: { url: string }[]; // Array of image objects with url property
  onRemove: (url: string) => void; // Callback to remove an image by URL
  colors?: { color: string }[]; // Array of color objects with color property
  setColors?: Dispatch<SetStateAction<{ color: string }[]>>; // Setter function for colors state
}

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> = ({
  images,
  onRemove,
  colors,
  setColors,
}) => {
  // Calculate the number of images
  const imagesLength = images.length;
  //get the grid class name based on the number of images
  const GridClassName = getGridClassName(imagesLength);

  //Extract images colors
  const [colorPalettes, setColorPallates] = useState<string[][]>([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const imgs = Array.isArray(images) ? images : [];
        const paletters = await Promise.all(
          imgs.map(async (img) => {
            const colors = await extractColorsFromImage(img.url); // Assume this function extracts colors
            return colors;
          })
        );
        // setColorPallates(paletters.flat().map((color) => ({ color })));
        setColorPallates(paletters);
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    if (images && images.length > 0) {
      fetchColors();
    }
  }, [images]);

  //console.log("the color palette is", colorPalettes);
  if (imagesLength === 0) {
    return (
      <div>
        <Image
          src={NoImageImg}
          alt="No Images Available"
          width={500}
          height={600}
          className="rounded-md"
        />
      </div>
    );
  }
  //if there are images, display the images in grid
  return (
    <div className="max-w-4xl">
      <div
        className={cn(
          "grid  h-[800px] overflow-hidden bg-white rounded-md ",
          GridClassName
        )}
      >
        {images.map((img, i) => (
          <div
            key={img.url}
            className={cn(
              "relative group h-full w-full border border-gray-300",
              `grid_${imagesLength}_image_${i + 1}`,
              {
                "h-[266.66px]": images.length === 6,
              }
            )}
          >
            {/*Image */}
            <Image
              src={img.url}
              alt="Preview"
              width={800}
              height={800}
              className="w-full h-full object-cover  object-top"
            />
            {/*Actions */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 bottom-0 hidden group-hover:flex bg-white/55 cursor-pointer  items-center justify-center flex-col gap-y-3 transition-all duration-500",
                {
                  "pb-[40%]": imagesLength === 1,
                }
              )}
            >
              {/* Color Pallette {Extract Colors} */}
              {/* <ColorPalette
                  extractedColors={colorPalettes[i] ?? []}
                  colors={colors}
                  setColors={
                    setColors ??
                    ((() => {}) as Dispatch<
                      SetStateAction<{ color: string }[]>
                    >)
                  }
                /> */}

              {setColors && (
                <ColorPalette
                  extractedColors={colorPalettes[i] ?? []}
                  colors={colors}
                  setColors={setColors}
                />
              )}

              {/* Remove Image Button */}
              <button
                className="Btn"
                type="button"
                onClick={() => onRemove(img.url)}
                // className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <div className="sign">
                  <Trash size={18} />
                </div>
                <div className="text">Delete</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesPreviewGrid;
