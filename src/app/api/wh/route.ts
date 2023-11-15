import { clerkClient } from "@clerk/nextjs";

export async function GET() {
  try {
    const user = await clerkClient.users.getUserList();

    return Response.json(user);
  } catch (err) {
    console.error(err);
    return new Response((err as Error).message, { status: 500 });
  }
}
