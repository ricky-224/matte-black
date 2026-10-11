import { getResendClient, EMAIL_FROM, SUPPORT_REPLY_TO } from "./resend";
import type { Address, OrderLineInput } from "@/lib/account-context";

type OrderConfirmationInput = {
  to: string;
  orderNumber: string;
  lines: OrderLineInput[];
  subtotal: number;
  address: Address;
};

function renderOrderConfirmationHtml({
  orderNumber,
  lines,
  subtotal,
  address,
}: OrderConfirmationInput) {
  const rows = lines
    .map(
      (line) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#f5f5f5;font-size:14px;">
            ${line.name}${line.size ? ` &middot; Size ${line.size}` : ""} &middot; Qty ${line.quantity}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#f5f5f5;font-size:14px;text-align:right;">
            $${(line.price * line.quantity).toFixed(2)}
          </td>
        </tr>`
    )
    .join("");

  return `
  <div style="background:#0a0a0a;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;">
      <p style="color:#f5f5f5;font-size:20px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 32px;">Matte Black</p>
      <h1 style="color:#f5f5f5;font-size:22px;margin:0 0 8px;">Order confirmed</h1>
      <p style="color:#9a9a9a;font-size:14px;margin:0 0 32px;">${orderNumber}</p>
      <table style="width:100%;border-collapse:collapse;">
        ${rows}
        <tr>
          <td style="padding:16px 0 0;color:#9a9a9a;font-size:14px;">Subtotal</td>
          <td style="padding:16px 0 0;color:#f5f5f5;font-size:14px;text-align:right;">$${subtotal.toFixed(2)}</td>
        </tr>
      </table>
      <p style="color:#9a9a9a;font-size:13px;margin:32px 0 0;">
        Shipping to ${address.firstName} ${address.lastName}, ${address.address}, ${address.city} ${address.postalCode}, ${address.country}
      </p>
    </div>
  </div>`;
}

export async function sendOrderConfirmationEmail(input: OrderConfirmationInput) {
  return getResendClient().emails.send({
    from: EMAIL_FROM.orders,
    to: [input.to],
    replyTo: SUPPORT_REPLY_TO,
    subject: `Order confirmed — ${input.orderNumber}`,
    html: renderOrderConfirmationHtml(input),
  });
}
