import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
};

const ADMIN_EMAIL = "contact@gesthorest.com";

function isResendConfigured(): boolean {
  const key = process.env.RESEND_API_KEY;
  return !!key && !key.startsWith("PLACEHOLDER");
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailInput) {
  if (!isResendConfigured()) {
    console.log("[email:mock] Resend non configuré — email simulé :", {
      to,
      subject,
      attachments: attachments?.map((a) => a.filename),
    });
    return { mocked: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: "Gesthorest International <contact@gesthorest.com>",
    to,
    subject,
    html,
    attachments,
  });
}

export async function sendAdminNotification(subject: string, html: string) {
  return sendEmail({ to: ADMIN_EMAIL, subject, html });
}
