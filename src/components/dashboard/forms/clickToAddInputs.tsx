import { Input } from "@/components/ui/input";
import { PaintBucket } from "lucide-react";

import { FC, useState } from "react";
import { SketchPicker } from "react-color";

export interface Detail {
  [key: string]: string | number | boolean | undefined;
}

interface ClickToAddInputsProps {
  details: Detail[]; //array of detail objects
  setDetails: React.Dispatch<React.SetStateAction<Detail[]>>; //setter function for details state
  initialDetail?: Detail; //optional initial detail object
  header: string; //Header Text for the Components
  colorPicker?: boolean; // Is Color Picker needed
}

/* PlusButton component for adding new detail inputs (moved to module scope) */
const PlusButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Add new details"
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
    >
      {/* Plus icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-blue-primary group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          strokeWidth="1.5"
        />
        <path d="M8 12H16" strokeWidth="1.5" />
        <path d="M12 16V8" strokeWidth="1.5" />
      </svg>
    </button>
  );
};

/* MinusButton component for removing detail inputs (moved to module scope) */
const MinusButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Remove this detail"
      className="group cursor-pointer outline-none hover:-rotate-90 duration-300"
    >
      {/* Minus icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-white group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          strokeWidth="1.5"
        />
        <path d="M8 12H16" strokeWidth="1.5" />
      </svg>
    </button>
  );
};

// function moved into ClickToAddInputs component so it can access props (details, setDetails, initialDetail)

const ClickToAddInputs: FC<ClickToAddInputsProps> = ({
  details,
  setDetails,
  initialDetail = {}, //Default value for initial details is an empty object
  header,
  colorPicker,
}) => {
  //State to manage toggling color picker
  const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);

  //Funcion to handle changes in details properties
  const handleDetailChange = (
    index: number,
    key: string,
    value: string | number | boolean
  ) => {
    //update the details array with the new details
    const updatedDetails = details.map((detail, i) =>
      i === index ? { ...detail, [key]: value } : detail
    );
    setDetails(updatedDetails); // update details state
  };

  // handler moved inside component so it can use props
  // Function to handle adding a new detail input set
  const handleAddDetail = () => {
    setDetails([...details, { ...initialDetail }]);
  };

  // function to remove detail input
  const handleRemoveDetail = (index: number) => {
    if (details.length === 1) return; //invalid index check
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/*Header*/}
      <div>{header}</div>
      {/* Display the PlusButton if no details exist */}
      {details.length === 0 && <PlusButton onClick={handleAddDetail} />}
      {/* Map through details and render inputs */}
      {details.map((detail, dIndex) => (
        <div key={dIndex} className="flex items-center gap-x-4">
          {/* Input for detail value */}
          {Object.keys(detail).map((key, kIndex) => (
            <div key={kIndex} className="flex items-center gap-x-4">
              {/* Color picker toggles */}
              {key.toLowerCase() === "color" && colorPicker && (
                <div className="flex gap-x-4">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() =>
                      setColorPickerIndex(
                        colorPickerIndex === dIndex ? null : dIndex
                      )
                    }
                  >
                    <PaintBucket />
                  </button>
                  <span
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: detail[key] as string }}
                  />
                </div>
              )}

              {/* Color  toggles */}
              {colorPickerIndex === dIndex && key.toLowerCase() === "color" && (
                <SketchPicker
                  color={detail[key] as string}
                  onChange={(e) => handleDetailChange(dIndex, key, e.hex)}
                />
              )}

              {/* Input field for each detail property or Key */}
              {/* <Input
                className="w-28"
                type={typeof detail[key] === "number" ? "number" : "text"}
                name={key}
                placeholder={key}
                value={detail[key] as string}
                step={0.01}
                min={typeof detail[key] === "number" ? 0 : undefined}
                onChange={(e) =>
                  handleDetailChange(
                    dIndex,
                    key,
                    e.target.valueAsNumber || e.target.value
                  )
                }
              /> */}
              <Input
                className="w-28"
                type={typeof detail[key] === "number" ? "number" : "text"}
                name={key}
                placeholder={key}
                value={(detail[key] ?? "") as string | number}
                step={0.01}
                min={typeof detail[key] === "number" ? 0 : undefined}
                onChange={(e) => {
                  const isNumberField = typeof detail[key] === "number";

                  if (!isNumberField) {
                    handleDetailChange(dIndex, key, e.target.value);
                    return;
                  }

                  // number input:
                  // keep empty as "" (so user can clear), otherwise store a real number
                  const raw = e.target.value;
                  handleDetailChange(
                    dIndex,
                    key,
                    raw === "" ? "" : Number(raw)
                  );
                }}
              />
            </div>
          ))}
          {/*Show buttons for each input field set*/}

          <MinusButton onClick={() => handleRemoveDetail(dIndex)} />
          <PlusButton onClick={handleAddDetail} />
        </div>
      ))}
    </div>
  );
};

export default ClickToAddInputs;
