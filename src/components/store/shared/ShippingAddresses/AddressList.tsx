import { Country, ShippingAddress } from "@/generated/prisma";
import { UserShippingAddressType } from "@/lib/type";
import { Dispatch, SetStateAction } from "react";
import ShippingAddressCard from "../../Card/Address/ShippingAddressCard";
import { useEffect } from "react";

interface AddressListProps {
  // Define any props needed for the AddressList component
  addresses: UserShippingAddressType[];
  countries: Country[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}
const AddressList = ({
  addresses,
  countries,
  selectedAddress,
  setSelectedAddress,
}: AddressListProps) => {
  useEffect(() => {
    //Find the default address if it exisits and set it to selected
    const defaultAddress = addresses.find((address) => address.defaultAddress);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  const handleSelectAddress = (address: UserShippingAddressType) => {
    setSelectedAddress(address);
  };

  return (
    <div className="space-y-5 max-h-80 overflow-y-auto">
      {addresses.map((address) => (
        <ShippingAddressCard
          key={address.id}
          address={address}
          isSelected={selectedAddress?.id === address.id}
          onSelect={() => handleSelectAddress(address)}
          countries={countries}
        />
      ))}
    </div>
  );
};

export default AddressList;
