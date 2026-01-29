import { getFilteredProducts } from "@/actions/products/getFilteredProducts";
import ProductList from "@/components/store/shared/ProductList";

export default async function Home() {
  const productData = await getFilteredProducts();

  const products = productData.products;
  console.log(`This is the product from product data`, products);
  return (
    <div className="p-14">
      <ProductList products={products} title="All Products" arrow={true} />
    </div>
  );
}
