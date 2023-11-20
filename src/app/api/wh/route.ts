import { nanoid } from "nanoid";
// eslint-disable-next-line
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const len = searchParams.get("len");
    const id = nanoid(len ? Number(len) : 16);
    return new Response(id);
  } catch (err) {
    console.error(err);
    return new Response((err as Error).message, { status: 500 });
  }
}
