interface textareaProps {
  value: string | number;
  placeholder?: string;
  onChange: (value: string | number) => void;
}

const Textarea = ({ value, placeholder, onChange }: textareaProps) => {
  return (
    <div className="w-full relative">
      <textarea
        className="min-h-32 p-4 w-full rounded-xl bg-white ring-1 ring-gray-200 focus:outline-none focus:ring-[#11BE86]"
        placeholder={placeholder}
        value={value ? value.toString() : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Textarea;
