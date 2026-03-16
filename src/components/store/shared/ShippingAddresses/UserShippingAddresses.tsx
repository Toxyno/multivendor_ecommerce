import { Country } from "@/generated/prisma";
import { UserShippingAddressType } from "@/lib/type";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import AddressDetails from "./AddressDetails";
import AddressList from "./AddressList";

interface UserShippingAddressesProps {
  addresses: UserShippingAddressType[];
  countries: Country[];
  selectedAddress: UserShippingAddressType | null;
  setSelectedAddress: Dispatch<SetStateAction<UserShippingAddressType | null>>;
}

const UserShippingAddresses = ({
  addresses,
  countries,
  selectedAddress,
  setSelectedAddress,
}: UserShippingAddressesProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="w-full py-4 px-6 bg-white">
      <div className="relative flex flex-col text-sm">
        <h1 className="text-lg mb-3 font-bold">Shipping Addresses</h1>
        {addresses && addresses.length > 0 && (
          <AddressList
            addresses={addresses}
            countries={countries}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        )}
        <div
          className="mt-4 ml-8 text-red-600 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Plus className="inline-block  mr-1 w-3" />
          <span className="text-sm">Add New Address</span>
        </div>
        {/* Modal */}
        <Modal title="Add New Address" show={showModal} setShow={setShowModal}>
          <AddressDetails countries={countries} setShow={setShowModal} />
        </Modal>
      </div>
    </div>
  );
};

export default UserShippingAddresses;
