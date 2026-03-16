//Function: placeOrder
//Description:
//    -Handles the logic for placing an order for the current user. This includes validating the cart, calculating totals, and creating order records in the database.
//Permission Level: Authenticated Users
//Parameters: An object containing the necessary details for placing the order, such as shipping address, payment information, and cart items.
//Returns: An order confirmation object if the order is successfully placed, or an error message if the operation fails.
"use server";

import { ShippingAddress } from "@/generated/prisma";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import getShippingDetails from "../ShippingRate/getShippingDetails";
import getDeliveryDetailsForStoreByCountry from "../products/getDeliveryDetailsForStoreByCountry";

const placeOrder = async (
  shippingAddress: ShippingAddress,
  cartId: string,
): Promise<{ orderId: string }> => {
  //ensure that the user is authenticated
  const user = await currentUser();
  if (!user) {
    throw new Error("User must be authenticated to place an order");
  }

  const userId = user.id;

  //Fetch users cart with all items
  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
      userId: userId,
    },
    include: {
      cartItems: true,
    },
  });
  if (!cart || cart.cartItems.length === 0) {
    throw new Error(
      "Cart is empty. Please add items to the cart before placing an order.",
    );
  }

  const cartItems = cart.cartItems;

  const validatedCartItems = await Promise.all(
    cartItems.map(async (cartProduct) => {
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
      const countryId = shippingAddress.countryId;
      const temp_country = await db.country.findUnique({
        where: {
          id: countryId,
        },
      });

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
      };

      if (temp_country) {
        const country = {
          country: temp_country.name,
          country_code: temp_country.code,
          name: temp_country.name,
          code: temp_country.code,
          region: "",
        };

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

  //   Define the type for grouped items by store
  type GroupedItems = { [storeId: string]: typeof validatedCartItems };

  // Group the validated cart items by store
  const groupedItems = validatedCartItems.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = [];
    }
    acc[item.storeId].push(item);
    return acc;
  }, {} as GroupedItems);

  console.log("GroupedItems in placeOrder:", groupedItems);

  //create the order
  const order = await db.order.create({
    data: {
      userId: userId,
      shippingAddressId: shippingAddress.id,
      orderStatus: "PENDING",
      paymentStatus: "PENDING",
      shippingFee: 0,
      subTotal: 0,
      total: 0,
    },
  });

  //Iterate over each stores items and create OrderGroup and OrderItems
  let orderTotalPrice = 0;
  let orderShippingFee = 0;

  for (const [storeId, items] of Object.entries(groupedItems)) {
    //calculate store specific totals
    const groupedTotalPrice = items.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );
    const groupedShippingFee = items.reduce(
      (acc, item) => acc + item.shippingFee,
      0,
    );

    const { shippingService, deliveryTimeMin, deliveryTimeMax } =
      await getDeliveryDetailsForStoreByCountry(
        storeId,
        shippingAddress.countryId,
      );

    // Ensure delivery times are numbers
    const minDelivery = deliveryTimeMin ?? 0;
    const maxDelivery = deliveryTimeMax ?? 0;

    // create an OrderGroup for tis store
    const orderGroup = await db.orderGroup.create({
      data: {
        orderId: order.id,
        storeId: storeId,
        status: "PENDING",
        subTotal: groupedTotalPrice - groupedShippingFee,
        shippingFee: groupedShippingFee,
        total: groupedTotalPrice,
        shippingDeliveryMin: minDelivery,
        shippingDeliveryMax: maxDelivery,
        shippingService: shippingService ?? "",
      },
    });

    //create OrderItems for each product in this store
    for (const item of items) {
      await db.orderItem.create({
        data: {
          orderGroupId: orderGroup.id,
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          sku: item.sku,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          shippingFee: item.shippingFee,
          totalPrice: item.totalPrice,
          size: item.size,
        },
      });
    }

    //update the order total
    orderTotalPrice += groupedTotalPrice;
    orderShippingFee += groupedShippingFee;
  }

  //update the main order with the final totals
  await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      total: orderTotalPrice,
      shippingFee: orderShippingFee,
      subTotal: orderTotalPrice - orderShippingFee,
    },
  });

  //clear the users cart
  //   await db.cartItem.deleteMany({
  //     where: {
  //       cartId: cartId,
  //     },
  //   });

  return { orderId: order.id };
};

export default placeOrder;
