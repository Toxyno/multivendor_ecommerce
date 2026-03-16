import { CartProductType } from "@/lib/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

//Define the interface for the CArt State
interface State {
  cart: CartProductType[];
  totalItems: number;
  totalPrice: number;
}
//
interface Actions {
  addToCart: (item: CartProductType) => void;
  removeFromCart: (itemId: CartProductType) => void;
  removeMultipleFromCart: (itemIds: CartProductType[]) => void;
  updateProductQuantity: (product: CartProductType, quantity: number) => void;
  emptyCart: () => void;
}

//Initialise a default state
const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
};

//Define the interface of the actions that can be performed in the Cart

const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      addToCart: (product: CartProductType) => {
        if (!product) return;

        const cart = get().cart;

        const cartItemIndex = cart.findIndex(
          (item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId,
        );

        if (cartItemIndex !== -1) {
          const updatedCart = cart.map((item, idx) =>
            idx === cartItemIndex
              ? { ...item, quantity: item.quantity + product.quantity }
              : item,
          );

          const totalPrice = updatedCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          );
          const totalItems = updatedCart.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );

          set({ cart: updatedCart, totalItems, totalPrice });
        } else {
          const updatedCart = [...cart, product];
          const totalPrice = updatedCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          );
          const totalItems = updatedCart.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );

          set({ cart: updatedCart, totalItems, totalPrice });
        }
      },
      updateProductQuantity: (product: CartProductType, quantity: number) => {
        const cart = get().cart;

        //if quantity is 0 or less, remove the item from the cart
        if (quantity <= 0) {
          get().removeFromCart(product);
          return;
        }
        const updatedCart = cart.map((item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
            ? { ...item, quantity }
            : item,
        );
        const totalItems = updatedCart.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
        const totalPrice = updatedCart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        set({ cart: updatedCart, totalItems, totalPrice });
      },
      removeFromCart: (product: CartProductType) => {
        const cart = get().cart;
        const updatedCart = cart.filter(
          (item) =>
            !(
              item.productId === product.productId &&
              item.variantId === product.variantId &&
              item.sizeId === product.sizeId
            ),
        );
        const totalItems = updatedCart.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
        const totalPrice = updatedCart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        set({ cart: updatedCart, totalItems, totalPrice });
      },
      removeMultipleFromCart: (products: CartProductType[]) => {
        const cart = get().cart;
        const updatedCart = cart.filter(
          (item) =>
            !products.some(
              (product) =>
                item.productId === product.productId &&
                item.variantId === product.variantId &&
                item.sizeId === product.sizeId,
            ),
        );
        const totalItems = updatedCart.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
        const totalPrice = updatedCart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        set({ cart: updatedCart, totalItems, totalPrice });
      },
      emptyCart: () => {
        set({ ...INITIAL_STATE });
      },
    }),
    { name: "cart" },
  ),
);

export default useCartStore;

// //Create the store with Zustand, conbining the status interface and actions
// const useCartStore = create<State & Actions>()(
//   persist(
//     (set) => ({
//       ...INITIAL_STATE,
//       addToCart: (item: CartProductType) =>
//         set((state) => ({
//           cart: [...state.cart, item],
//           totalItems: state.totalItems + 1,
//           totalPrice: state.totalPrice + item.price,
//         })),
//       removeFromCart: (itemId: CartProductType) =>
//         set((state) => ({
//           cart: state.cart.filter((item) => item.id !== itemId.id),
//           totalItems: state.totalItems - 1,
//           totalPrice: state.totalPrice - itemId.price,
//         })),
//       removeMultipleFromCart: (itemIds: CartProductType[]) =>
//         set((state) => ({
//           cart: state.cart.filter((item) => !itemIds.some((id) => id.id === item.id)),
//           totalItems: state.totalItems - itemIds.length,
//           totalPrice: state.totalPrice - itemIds.reduce((acc, item) => acc + item.price, 0),
//         })),
//       updateProductQuantity: (product: CartProductType, quantity: number) =>
//         set((state) => {
//           const updatedCart = state.cart.map((item) =>
//             item.id === product.id ? { ...item, quantity } : item
//           );
//           const totalItems = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
//           const totalPrice = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//           return { cart: updatedCart, totalItems, totalPrice };
//         }),
//       emptyCart: () => set({ ...INITIAL_STATE }),
//     }),
//     {
//       name: "cart-storage",
//     }
//   )
// );

// export default useCartStore
