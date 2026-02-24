import { MapPin } from "lucide-react";

interface ShippingToProps {
  countryName: string;
  countryCode: string;
}
const ShippingTo = ({ countryName, countryCode }: ShippingToProps) => {
  return (
    <div className="flex justify-between items-center h-7 px-2">
      <div className="flex items-center font-bold whitespace-nowrap pr-2">
        <span>Ship to</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-hidden pl-2">
        <MapPin className="w-4 shrink-0 stroke-black" />
        <span className="text-amber-800 text-sm cursor-pointer truncate">
          {countryName}, ({countryCode})
        </span>
      </div>
    </div>
  );
};

export default ShippingTo;
