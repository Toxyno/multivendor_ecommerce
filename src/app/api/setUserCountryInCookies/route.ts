import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    //Parse the incoming reques body as JSON
    const reqBody = await request.json();
    const { userCountry } = reqBody;
    //check if the userCountry is provide
    if (!userCountry) {
      return new NextResponse("No user country provided", { status: 400 });
    }
    //Create a response to set the cookie
    const response = new NextResponse("User Country data saved", {
      status: 200,
    });
    response.cookies.set({
      name: "userCountry",
      value: JSON.stringify(userCountry),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: unknown) {
    console.error("Error setting user country in cookies:", error);
    return new NextResponse("Error setting user country in cookies", {
      status: 500,
    });
  }
}
