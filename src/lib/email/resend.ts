import { Resend } from "resend";

let client: Resend | null = null;

// Lazy-initialized so a missing key only breaks an actual send, not the build.
export function getResendClient() {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

// Named sender identities. Which one an email uses depends on what it's for —
// see the mapping in CLAUDE.md under "Custom SMTP (Resend) for auth emails".
export const EMAIL_FROM = {
  noreply: "Matte Black <no-reply@mail.matte---black.com>",
  orders: "Matte Black Orders <orders@mail.matte---black.com>",
  welcome: "Matte Black <welcome@mail.matte---black.com>",
  news: "Matte Black <news@news.matte---black.com>",
} as const;

// Automated sends route replies here so a customer hitting "reply" reaches a
// real inbox, even though the sending address itself never receives mail.
export const SUPPORT_REPLY_TO = "support@support.matte---black.com";
