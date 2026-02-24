import { cn } from "@/lib/utils";

interface Spec {
  name: string;
  value: string;
}

interface ProductSpecsProps {
  specs: {
    products: Spec[];
    variants: Spec[];
  };
}

const ProductSpecs = ({ specs }: ProductSpecsProps) => {
  const { products, variants } = specs;
  return (
    <div className="pt-6">
      {/* Title */}
      <div className="">
        <div className="text-black text-2xl font-bold">
          Product Specifications
        </div>
        {/* Product Specs Table */}
        <SpecTable data={products} />
        {/* Variant Specs Table */}
        <SpecTable data={variants} noTopBorder />
      </div>
    </div>
  );
};

export default ProductSpecs;

const SpecTable = ({
  data,
  noTopBorder,
}: {
  data: Spec[];
  noTopBorder?: boolean;
}) => {
  return (
    <ul
      className={cn("border grid grid-cols-2", {
        "border-t-0": noTopBorder,
      })}
    >
      {data.map((spec, index) => (
        <li
          key={index}
          className={cn("flex border-t", {
            "border-t-0": index === 0,
          })}
        >
          <div className="float-left text-sm leading-7 max-w-[50%] relative w-1/2 flex">
            <div className="p-4 bg-[#f5f5f5] text-black w-44">
              <span className="leading-5 ">{spec.name}</span>
            </div>
            <div className="p-4 text-[#151515] flex-1  wrap-break-word leading-5">
              <span className="leading-5 ">{spec.value}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
