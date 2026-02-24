import { Check } from "lucide-react";

interface ProductShippingFeeProps {
  method: string;
  fee: number;
  extraFee: number;
  weight: number;
  quantity: number;
}

const ProductShippingFee = ({
  method,
  fee,
  extraFee,
  weight,
  quantity,
}: ProductShippingFeeProps) => {
  switch (method) {
    case "ITEM":
      console.log("The fee is", fee, "The extra fee is", extraFee);
      return (
        <div className="w-full pb-1">
          {/* Notes */}
          <div className="w-full">
            <span className="text-xs flex gap-x-1">
              <Check className="min-w-3 max-w-3 stroke-green-400" />
              <span className="mt-1">
                This store calculate the delivery fee based on the number of the
                items in the order
              </span>
            </span>
            {fee !== extraFee && (
              <span className="text-xs flex gap-x-1">
                <Check className="min-w-3 max-w-3 stroke-green-400" />
                <span className="mt-1">
                  If you purchase multiple items, you will receive a discounted
                  delivery fee.
                </span>
              </span>
            )}
          </div>

          <table className="w-full mt-1.5">
            <thead className="w-full">
              {fee === extraFee || extraFee === 0 ? (
                <tr
                  className="grid gap-x-1 text-xs px-4"
                  style={{ gridTemplateColumns: "4fr 1fr" }}
                >
                  <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                    Fee per Item
                  </td>
                  <td className="w-fit min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                    £{fee}
                  </td>
                </tr>
              ) : (
                <div className="space-y-1">
                  <tr
                    className="grid gap-x-1 text-xs px-4"
                    style={{ gridTemplateColumns: "4fr 1fr" }}
                  >
                    <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                      Fee for the first item
                    </td>
                    <td className="w-fit min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                      £{fee}
                    </td>
                  </tr>

                  <tr
                    className="grid gap-x-1 text-xs px-4"
                    style={{ gridTemplateColumns: "4fr 1fr" }}
                  >
                    <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                      Fee for Each Additional Item
                    </td>
                    <td className="w-fit min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                      £{extraFee}
                    </td>
                  </tr>
                </div>
              )}
            </thead>
            <tbody>
              <tr
                className="grid gap-x-1 text-xs px-4 mt-1"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  Quantity
                </td>
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  x{quantity}
                </td>
              </tr>
              <tr className="flex gap-x-1 text-sm px-4 mt-1 text-center font-semibold">
                <td className="w-full bg-black text-white px-1 py-1">
                  {quantity === 1 || fee === extraFee ? (
                    <span>
                      £{fee}(fee) (x{quantity})(items) = £{fee * quantity}
                    </span>
                  ) : (
                    <span>
                      £{fee} (first Item) + {quantity - 1} (additional items) x
                      £{extraFee} =&nbsp;£{fee + (quantity - 1) * extraFee}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    case "WEIGHT":
      return (
        <div className="w-full pb-1">
          {/* Notes */}
          <div className="w-full">
            <span className="text-xs flex gap-x-1">
              <Check className="min-w-3 max-w-3 stroke-green-400" />
              <span className="mt-1">
                This store calculate the delivery fee based on product weight
              </span>
            </span>
          </div>
          <table className="w-full mt-1.5">
            <thead className="w-full">
              <tr
                className="grid gap-x-1 text-xs px-4"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  Fee per kg(1kg = 2205lbs)
                </td>
                <td className="w-fit min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                  £{fee}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr
                className="grid gap-x-1 text-xs px-4 mt-1"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  Quantity
                </td>
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  x{quantity}
                </td>
              </tr>
              <tr className="flex gap-x-1 text-xs px-4 mt-1 text-center font-semibold">
                <td className="w-full bg-black text-white px-1 py-1">
                  <span>
                    £{fee} (fee) * {weight}kg (weight) * {quantity} (items) = £
                    {fee * weight * quantity}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    case "FIXED":
      return (
        <div className="w-full pb-1">
          {/* Notes */}
          <div className="w-full">
            <span className="text-xs flex gap-x-1">
              <Check className="min-w-3 max-w-3 stroke-green-400" />
              <span className="mt-1">
                This store calculate the delivery fee based on FIXED price.
              </span>
            </span>
          </div>
          <table className="w-full mt-1.5">
            <thead className="w-full">
              <tr
                className="grid gap-x-1 text-xs px-4"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  Fee
                </td>
                <td className="w-fit min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                  £{fee}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr
                className="grid gap-x-1 text-xs px-4 mt-1"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  Quantity
                </td>
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  x{quantity}
                </td>
              </tr>
              <tr className="flex gap-x-1 text-xs px-4 mt-1 text-center font-semibold">
                <td className="w-full bg-black text-white px-1 py-1">
                  <span>£{fee} (quantity does not affect)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    default:
      return <div>Shipping Fee: N/A</div>;
  }
};

export default ProductShippingFee;
