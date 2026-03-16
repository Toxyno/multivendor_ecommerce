"use server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const emptyUserCart = async () => {
  try {
    //ensure that the user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("User must be authenticated to empty cart");
    }

    const userId = user.id;

    const res = await db.cart.delete({
      where: {
        userId: userId,
      },
    });
    if (res) return true;
  } catch (error) {
    console.error(error);
  }
};

export default emptyUserCart;
