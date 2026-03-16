// import { getFilteredProducts } from "@/actions/products/getFilteredProducts";
// import ProductList from "@/components/store/shared/ProductList";
// import useCartStore from "@/cartStore/useCartStore";
// import useFromStore from "@/hooks/useFromStore";
import { getFilteredProducts } from "@/actions/products/getFilteredProducts";
import HomeClient from "./HomeClient";

export default async function Home() {
  // const productData = await getFilteredProducts();

  // //const cart = useCartStore((state) => state.cart);
  // const cart = useFromStore(useCartStore, (state) => state.cart);
  // console.log(`This is the cart from the store:`, cart);

  // const products = productData.products;
  // console.log(`This is the product from product data`, products);
  // return (
  //   <div className="p-14">
  //     <ProductList products={products} title="All Products" arrow={true} />
  //   </div>
  // );
  const productData = await getFilteredProducts();
  const products = productData.products;

  return (
    <div className="p-14">
      <HomeClient products={products} />
    </div>
  );
}
