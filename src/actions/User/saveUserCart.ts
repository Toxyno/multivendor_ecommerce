//Funtion: saveUserCart
//Description: Saves the users cart by validating product date from the database and  updating the cart in the database. This is used to save the cart for later use and also to update the cart when the user adds or removes products from the cart.
//Permissions Level: User who owns the cart
//Parameters:
// -cartProducts: An array of objects containing the product id and quantity of the products in the cart. This is used to update the cart in the database.
//Returns:
// -An object containing the updated cart with recalculated quantity and price for each product, the total price of the cart, and the shipping fees. This is used to update the cart in the frontend and to display the updated cart to the user.
// -An error message if there is an error saving the cart.
"use server";
import { CartProductType } from "@/lib/type";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import getShippingDetails from "@/actions/ShippingRate/getShippingDetails";

const saveUserCart = async (
  cartProducts: CartProductType[],
): Promise<boolean> => {
  //Get the current User
  const _user = await currentUser();
  if (!_user) {
    throw new Error("User not authenticated");
  }

  const userId = _user.id;

  //Search for existing users cart in the database using the user id
  const userCart = await db.cart.findFirst({
    where: {
      userId: userId,
    },
  });
  //Delete the existing users cart from the database if it exists
  if (userCart) {
    await db.cart.delete({
      where: {
        userId: userId,
      },
    });
  }

  //Fetch the product, variant and size data from the database for validation and to calculate the price of the cart
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      //Fetch the product, variant and size data from the database
      const product = await db.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          store: true,
          freeShippings: {
            include: {
              eligibleCountries: true,
            },
          },
          variants: {
            where: {
              id: variantId,
            },
            include: {
              sizes: {
                where: {
                  id: sizeId,
                },
              },
              images: true,
            },
          },
        },
      });
      if (
        !product ||
        product.variants.length === 0 ||
        product.variants[0].sizes.length === 0
      ) {
        throw new Error(
          `Product with id ${productId} and variant id ${variantId} and size id ${sizeId} not found`,
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes[0];

      //validate the stock and the price
      const validQuantity = Math.min(quantity, size.quantity);
      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      //Calculate the Shipping Details:
      const countryCookie = await getCookie("userCountry", { cookies });
      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
      };

      if (countryCookie) {
        const country = JSON.parse(countryCookie);
        if (country) {
          const temp_details = await getShippingDetails(
            product.shippingFeeMethod,
            country,
            product.store,
            product.freeShippings.length > 0 ? product.freeShippings[0] : null,
          );

          if (typeof temp_details !== "boolean" && temp_details !== null) {
            details = {
              ...temp_details,
              isFreeShipping: temp_details.freeShipping ?? false,
            };
          }
        }
      }

      let shippingFee = 0;

      const { shippingFeeMethod } = product;
      if (shippingFeeMethod === "ITEM") {
        shippingFee =
          quantity === 1
            ? details.shippingFee
            : details.shippingFee + details.extraShippingFee * (quantity - 1);
      } else if (shippingFeeMethod === "WEIGHT") {
        shippingFee = details.shippingFee * variant.weight * quantity;
      } else if (shippingFeeMethod === "FIXED") {
        shippingFee = details.shippingFee;
      }

      const totalPrice = price * validQuantity + shippingFee;
      return {
        productId,
        variantId,
        sizeId,
        quantity: validQuantity,
        price,
        productSlug: product.slug,
        variantSlug: variant.slug,
        productName: product.name,
        storeId: product.store.id,
        sku: variant.sku,
        storeName: product.store.name,
        name: `${product.name} - ${variant.variantName}`,
        image: variant.images[0]?.imageUrl || "",
        size: size.size,
        shippingFee: shippingFee,
        totalPrice: totalPrice,
      };
    }),
  );

  //Recalculate the carts total proce and the shipping fee
  const subTotal = validatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalShippingFee = validatedCartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0,
  );
  const totalPrice = subTotal + totalShippingFee;

  //   save the validatedCartItems to the database with the user id and the total price of the cart
  const cart = await db.cart.create({
    data: {
      userId: userId,
      cartItems: {
        create: validatedCartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          storeId: item.storeId,
          sku: item.sku,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          shippingFee: item.shippingFee,
          totalPrice: item.totalPrice,
        })),
      },
      shippingFeesTotal: totalShippingFee,
      cartTotalWithoutShippingFees: subTotal,
      cartTotalWithShippingFees: totalPrice,
    },
  });

  if (cart) return true;
  return false;

  // Update the cart with the calculated total price
  //   await db.cart.update({
  //     where: { id: cart.id },
  //     data: { totalPrice: totalPrice },
  //   });
};

export default saveUserCart;
