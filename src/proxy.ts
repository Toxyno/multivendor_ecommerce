import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import handleUserCountry from "./lib/Helper/handleUserCountry";

export default clerkMiddleware(async (auth, req, next) => {
  const protectedRoutes = createRouteMatcher(["/dashboard", "/dashboard/(.*)"]);
  if (protectedRoutes(req)) {
    const session = await auth();
    if (!session?.userId) {
      // redirect to sign-in if there's no active session
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  //Creating a basic response
  let response = NextResponse.next();

  /*---------------- Handle Country Detection---------------- */
  //step 1: Check if country is already set in the cookies
  const countryCookie = req.cookies.get("userCountry")?.value;

  if (countryCookie) {
    //Country is already set in the cookies
    return response;
  } else {
    //Country is not set in the cookies, attempt to detect country
    response = NextResponse.redirect(new URL(req.url));
    //step 2: Get the user country from the function created
    const userCountry = await handleUserCountry();
    console.log(`Proxy userCountry: `, userCountry);
    //step 3: Set the country in the cookies
    response.cookies.set({
      name: "userCountry",
      value: JSON.stringify(userCountry),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
