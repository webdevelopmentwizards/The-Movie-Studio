import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export type ContactMailPayload = {
  name: string;
  email: string;
  subjectLabel: string;
  subjectValue: string;
  message: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.CONTACT_TO_EMAIL?.trim(),
  );
}

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const host = process.env.SMTP_HOST?.trim() || "smtp.office365.com";
  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true";

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: { user, pass },
    tls: {
      // Microsoft 365 / GoDaddy M365
      minVersion: "TLSv1.2",
    },
  });

  return transporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildStaffHtml(payload: ContactMailPayload): string {
  const { name, email, subjectLabel, message } = payload;
  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#18181b;">
      <h2 style="margin:0 0 16px;font-size:18px;">New contact form message</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 16px;"><strong>Topic:</strong> ${escapeHtml(subjectLabel)}</p>
      <div style="padding:16px;border:1px solid #e4e4e7;border-radius:8px;background:#fafafa;white-space:pre-wrap;">${escapeHtml(message)}</div>
      <p style="margin:16px 0 0;font-size:12px;color:#71717a;">Sent from The Movie Studio website contact form.</p>
    </div>
  `;
}

function buildStaffText(payload: ContactMailPayload): string {
  return [
    "New contact form message",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Topic: ${payload.subjectLabel}`,
    "",
    payload.message,
    "",
    "— Sent from The Movie Studio website contact form.",
  ].join("\n");
}

export async function sendContactEmails(
  payload: ContactMailPayload,
): Promise<{ messageId: string }> {
  const fromUser = requireEnv("SMTP_USER");
  const to = requireEnv("CONTACT_TO_EMAIL");
  const fromName =
    process.env.SMTP_FROM_NAME?.trim() || "The Movie Studio Contact";
  const sendAutoReply = process.env.CONTACT_SEND_AUTO_REPLY !== "false";

  const mailer = getTransporter();

  const staffResult = await mailer.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to,
    replyTo: `"${payload.name}" <${payload.email}>`,
    subject: `[Contact] ${payload.subjectLabel} — ${payload.name}`,
    text: buildStaffText(payload),
    html: buildStaffHtml(payload),
    headers: {
      "X-Contact-Subject": payload.subjectValue,
    },
  });

  if (sendAutoReply) {
    await mailer.sendMail({
      from: `"${fromName}" <${fromUser}>`,
      to: payload.email,
      subject: "We received your message — The Movie Studio",
      text: [
        `Hi ${payload.name},`,
        "",
        "Thanks for contacting The Movie Studio. We received your message and will get back to you within 2 business days.",
        "",
        `Topic: ${payload.subjectLabel}`,
        "",
        "— The Movie Studio",
        "info@themoviestudio.com",
      ].join("\n"),
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#18181b;">
          <p>Hi ${escapeHtml(payload.name)},</p>
          <p>Thanks for contacting <strong>The Movie Studio</strong>. We received your message and will get back to you within 2 business days.</p>
          <p><strong>Topic:</strong> ${escapeHtml(payload.subjectLabel)}</p>
          <p style="margin-top:24px;color:#71717a;font-size:13px;">— The Movie Studio<br/>info@themoviestudio.com</p>
        </div>
      `,
    });
  }

  return { messageId: String(staffResult.messageId || "") };
}

export async function verifyMailTransport(): Promise<boolean> {
  if (!isMailConfigured()) return false;
  await getTransporter().verify();
  return true;
}
