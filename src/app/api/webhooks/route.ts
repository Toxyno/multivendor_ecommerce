import { db } from "@/lib/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    //When the user is created or updated
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const data: any = evt.data;

      const email = data.email_addresses?.[0]?.email_address;
      if (!email) return new Response("No email", { status: 200 });

      const name =
        `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || email;

      const picture = data.image_url ?? data.profile_image_url ?? "";

      const dbUser = await db.user.upsert({
        where: { email },
        update: { name, picture },
        create: {
          // use Id if your prisma field is Id (capital I)
          Id: data.id,
          name,
          email,
          picture,
          role: "USER",
        },
      });

      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      // Now these exist:
      await clerk.users.getUser(data.id);

      await clerk.users.updateUserMetadata(data.id, {
        privateMetadata: { role: dbUser.role ?? "USER" },
      });
    }

    //whem the user is deleted
    if (evt.type === "user.deleted") {
      const data: any = evt.data;
      const email = data.email_addresses?.[0]?.email_address;
      if (email) {
        await db.user.deleteMany({
          where: { email },
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("OK", { status: 200 });
  }
}

// import { db } from "@/lib/db";
// import { clerkClient } from "@clerk/nextjs/server";
// import { verifyWebhook } from "@clerk/nextjs/webhooks";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const evt = await verifyWebhook(req);
//     // const { id } = evt.data;
//     // const eventType = evt.type;

//     // Handle specific event types
//     if (evt.type === "user.created" || evt.type === "user.updated") {
//       console.log("New user created:", evt.data.id);
//       // Handle user creation
//       const data = JSON.parse(JSON.stringify(evt.data));
//       console.log("User Data:", data);
//       const user = {
//         Id: data.id,
//         name: `${data.first_name} ${data.last_name}`,
//         email: data.email_addresses[0]?.email_address,
//         picture: data.image_url,
//       } as {
//         Id?: string;
//         name?: string;
//         email?: string;
//         picture?: string;
//         role?: string;
//       };

//       if (!user || !user.email)
//         return new Response("No user email", { status: 400 });

//       console.log("User Info:", user);

//       const dbUser = await db.user.upsert({
//         where: { email: user.email! },
//         update: {
//           name: user.name!,
//           picture: user.picture!,
//           email: user.email!,
//         },

//         create: {
//           Id: user.Id!,
//           name: user.name!,
//           email: user.email!,
//           picture: user.picture!,
//           role: "USER",
//           updatedAt: new Date(),
//         },
//       });

//       // const clerk = await clerkClient();

//       // await clerk.users.updateUserMetadata(data.id, {
//       //   privateMetadata: { role: dbUser.role ?? "USER" },
//       // });
//       try {
//         await clerkClient.users.getUser(data.id);
//       } catch (e) {
//         console.error("Clerk user not found in this instance:", data.id, e);
//         // Return 200 so Clerk doesn't keep retrying while you fix configuration
//         return new Response("User not found in this Clerk instance", {
//           status: 200,
//         });
//       }

//       await clerkClient.users.updateUserMetadata(data.id, {
//         privateMetadata: { role: dbUser.role ?? "USER" },
//       });
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error verifying webhook", { status: 400 });
//   }
// }
