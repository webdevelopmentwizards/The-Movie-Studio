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

export type AuditionMailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type AuditionPaymentMailPayload = {
  firstName: string;
  lastName: string;
  email: string;
  planName: string;
  amountLabel: string;
  period: string;
  transactionId: string;
  attachments: AuditionMailAttachment[];
  /** Paths/notes when a file was too large to attach */
  attachmentNotes?: string[];
};

export { AUDITION_MAX_UPLOAD_BYTES as AUDITION_EMAIL_ATTACH_MAX_BYTES } from "@/lib/auditionLimits";


export async function sendAuditionPaymentEmails(
  payload: AuditionPaymentMailPayload,
): Promise<void> {
  if (!isMailConfigured()) {
    throw new Error("Email is not configured.");
  }

  const fromUser = requireEnv("SMTP_USER");
  const studioTo = requireEnv("CONTACT_TO_EMAIL");
  const fromName =
    process.env.SMTP_FROM_NAME?.trim() || "The Movie Studio";
  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const mailer = getTransporter();

  const notesBlock =
    payload.attachmentNotes && payload.attachmentNotes.length > 0
      ? `<p><strong>Attachment notes:</strong></p><ul>${payload.attachmentNotes
          .map((n) => `<li>${escapeHtml(n)}</li>`)
          .join("")}</ul>`
      : "";

  const studioHtml = `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#18181b;">
      <h2 style="margin:0 0 16px;font-size:18px;">New paid audition submission</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p style="margin:0 0 8px;"><strong>Plan:</strong> ${escapeHtml(payload.planName)} (${escapeHtml(payload.amountLabel)} ${escapeHtml(payload.period)})</p>
      <p style="margin:0 0 16px;"><strong>Transaction ID:</strong> ${escapeHtml(payload.transactionId)}</p>
      ${notesBlock}
      <p style="margin:16px 0 0;font-size:12px;color:#71717a;">Audition video/photo attached when size allows.</p>
    </div>
  `;

  await mailer.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to: studioTo,
    replyTo: `"${fullName}" <${payload.email}>`,
    subject: `[Audition] ${payload.planName} — ${fullName}`,
    text: [
      "New paid audition submission",
      "",
      `Name: ${fullName}`,
      `Email: ${payload.email}`,
      `Plan: ${payload.planName} (${payload.amountLabel} ${payload.period})`,
      `Transaction ID: ${payload.transactionId}`,
      ...(payload.attachmentNotes || []),
    ].join("\n"),
    html: studioHtml,
    attachments: payload.attachments.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: file.contentType,
    })),
  });

  await mailer.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to: payload.email,
    subject: `Payment confirmed — Audition ${payload.planName} plan`,
    text: [
      `Hi ${payload.firstName},`,
      "",
      "Thank you for your payment. Your audition submission was received and our casting team will review it.",
      "",
      `Plan: ${payload.planName} (${payload.amountLabel} ${payload.period})`,
      `Transaction ID: ${payload.transactionId}`,
      "",
      "— The Movie Studio",
      "info@themoviestudio.com",
    ].join("\n"),
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#18181b;">
        <p>Hi ${escapeHtml(payload.firstName)},</p>
        <p>Thank you for your payment. Your audition submission was received and our casting team will review it.</p>
        <p><strong>Plan:</strong> ${escapeHtml(payload.planName)} (${escapeHtml(payload.amountLabel)} ${escapeHtml(payload.period)})</p>
        <p><strong>Transaction ID:</strong> ${escapeHtml(payload.transactionId)}</p>
        <p style="margin-top:24px;color:#71717a;font-size:13px;">— The Movie Studio<br/>info@themoviestudio.com</p>
      </div>
    `,
  });
}

export async function verifyMailTransport(): Promise<boolean> {
  if (!isMailConfigured()) return false;
  await getTransporter().verify();
  return true;
}
