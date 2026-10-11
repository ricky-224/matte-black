import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";

export async function POST(request: Request) {
  const body = await request.json();
  const { to, orderNumber, lines, subtotal, address } = body ?? {};

  if (
    typeof to !== "string" ||
    typeof orderNumber !== "string" ||
    !Array.isArray(lines) ||
    typeof subtotal !== "number" ||
    !address
  ) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await sendOrderConfirmationEmail({ to, orderNumber, lines, subtotal, address });

  if (error) {
    return Response.json({ error: error.message }, { status: 502 });
  }

  return Response.json({ ok: true });
}
