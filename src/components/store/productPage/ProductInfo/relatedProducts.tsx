import { ProductType } from "@/lib/type";
import ProductList from "../../shared/ProductList";

interface RelatedProductsProps {
  products: ProductType[];
}

const relatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <div className="mt-4 space-y-1">
      <ProductList products={products} title="Related Product" />
    </div>
  );
};

export default relatedProducts;
