import { ProductType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "../Card/Product/ProductCard";

interface Props {
  // We can create a return from the getProductMethod
  products: ProductType[];
  title?: string;
  link?: string;
  arrow?: boolean;
}

interface TitleProps {
  title?: string;
  link?: string;
  arrow?: boolean;
}

const Title = ({ title, link, arrow }: TitleProps) => {
  if (link) {
    return (
      <Link href={link} className="h-12">
        <h2 className="text-black text-xl font-bold">
          {title}&nbsp;
          {arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      </Link>
    );
  } else {
    return (
      <h2 className="text-black text-xl font-bold">
        {title} &nbsp;
        {arrow && <ChevronRight className="w-3 inline-block" />}
      </h2>
    );
  }
};

const ProductList = async ({ products, title, link, arrow }: Props) => {
  return (
    <div className="relative">
      {title && <Title title={title} link={link} arrow={arrow} />}

      {/* Product Grid */}
      {products.length > 0 ? (
        <div
          className={cn(
            "flex  flex-wrap -translate-x-5 w-[calc(100%+3rem)] sm:w-[calc(100%+1.5rem)]",
            {
              "mt-2": title,
            },
          )}
        >
          {products.map((product) => (
            // <div className="block" key={product.id}>
            //   {product.name}
            // </div>
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ProductList;
