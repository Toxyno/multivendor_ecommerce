interface InputProps {
  name: string;
  value: string | number;
  type: "text" | "number";
  placeholder?: string;
  step?: number;
  min?: number;
  onChange: (value: string | number) => void;
}

const Input = ({
  name,
  value,
  type,
  placeholder,
  step,
  min,
  onChange,
}: InputProps) => {
  return (
    <div className="w-full relative">
      <input
        className="w-full pr-6 py-4  rounded-xl duration-200 ring-1 ring-transparent focus:ring-[#11BE86] bg-white mt-2 "
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        step={step}
        min={min}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
      />
    </div>
  );
};

export default Input;
