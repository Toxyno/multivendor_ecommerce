import { UserShippingAddressType } from "@/lib/type";
import { Country } from "@/generated/prisma";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Modal from "../../shared/Modal";
import AddressDetails from "../../shared/ShippingAddresses/AddressDetails";

import upsertShippingaddress from "@/actions/User/upsertShippingaddress";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ShippingAddressCardProps {
  // Define any props needed for the ShippingAddressCard component
  address: UserShippingAddressType;
  isSelected: boolean;
  onSelect: () => void;
  countries: Country[];
}

const ShippingAddressCard = ({
  address,
  isSelected,
  onSelect,
  countries,
}: ShippingAddressCardProps) => {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();

  const handleMakeDefault = async () => {
    try {
      const { country, ...addressData } = address;
      const response = await upsertShippingaddress({
        ...addressData,
        defaultAddress: true,
      });

      if (response) {
        toast.success("New address set as default successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Error making address default:", error);
      toast.error("Failed to make address default");
      throw new Error("Failed to make address default");
    }
  };

  return (
    <div className="w-full relative flex self-start group">
      {/* checkbox */}
      <label
        htmlFor={`address-${address.id}`}
        className="text-gray-900 leading-6 inline-flex items-center mr-3 cursor-pointer"
      >
        <span className="leading-8 inline-flex p-0.5 cursor-pointer"></span>
        <span
          className={cn(
            "leading-8 inline-block w-5 h-5 rounded-full bg-white border border-gray-300",
            {
              "bg-orange-600 border-none flex items-center justify-center":
                isSelected,
            },
          )}
        >
          {isSelected && <Check className="stroke-white w-3" />}
        </span>
        <input
          type="checkbox"
          id={`address-${address.id}`}
          checked={isSelected}
          onChange={onSelect}
          hidden
        />
      </label>

      {/* Address */}
      <div className="w-full border-t pt-2">
        {/* Full Name - Phone Number */}
        <div className="flex max-w-82 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="mr-4 text-sm text-black font-semibold">
            {address.firstName} {address.lastName}
          </span>
          <span className="text-sm text-gray-600">{address.phone}</span>
        </div>
        {/* Address 1 - Address2 */}
        <div className="text-sm max-w-[90%] text-gray-600 leading-4 overfolow-hidden text-ellipsis whitespace-nowrap">
          {address.address1} {address.address2 && `, ${address.address2} `}
        </div>
        {/* City - State - PostalCode */}
        <div className="text-sm max-w-[90%] text-gray-600 leading-4 overfolow-hidden text-ellipsis whitespace-nowrap">
          {address.city} {address.state && `, ${address.state} `}&nbsp;
          {address.country.name}&nbsp;
          {address.postalCode && `, ${address.postalCode}`}
        </div>

        {/* Save as default-Edit */}
        <div className="absolute right-0 top-1/2 flex items-center gap-x-3">
          <div
            className="cursor-pointer hidden group-hover:block"
            onClick={() => setShow(true)}
          >
            <span className="text-sm text-[#27f]">Edit</span>
          </div>
          {isSelected && !address.defaultAddress && (
            <div
              className="cursor-pointer hidden group-hover:block"
              onClick={() => handleMakeDefault()}
            >
              <span className="text-sm text-[#27f]">Save as default</span>
            </div>
          )}
        </div>
        {show && (
          <Modal title="Edit Shipping Address" show={show} setShow={setShow}>
            <AddressDetails
              countries={countries}
              setShow={setShow}
              data={address}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressCard;
