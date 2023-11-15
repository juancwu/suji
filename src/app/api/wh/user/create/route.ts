import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs";
import type { UserJSON, UserWebhookEvent } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  //eslint-disable-next-line
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let evt: UserWebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as UserWebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const id = (evt.data as UserJSON).id;
  let username = (evt.data as UserJSON).username;
  const eventType = evt.type;

  if (eventType !== "user.created") {
    console.log("Wrong webhook sent to route /api/wh/user/create");
    console.log(`Recieved event: ${eventType} but expected: user.created`);
    return new Response("", { status: 400 });
  }

  if (username === null) {
    // random generate username
    username = nanoid(8);
    try {
      await clerkClient.users.updateUser(id, { username });
    } catch (err) {
      console.error("Error updating clerk user with new username", err);
      return new Response("", { status: 400 });
    }
  }

  try {
    // create new user entry in db
    await db.insert(users).values({
      externalId: id,
    });
    console.log("New user created in db");
  } catch (err) {
    console.error("Error creating new user entry", err);
    return new Response("", { status: 400 });
  }

  return new Response("", { status: 200 });
}
