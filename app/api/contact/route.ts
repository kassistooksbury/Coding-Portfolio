import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return Response.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return badRequest('Invalid JSON body');

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!name || !email || !message) return badRequest('Missing required fields');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return badRequest('Invalid email');

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || user;

    if (!host || !port || !user || !pass || !to || !from) {
      return Response.json(
        {
          ok: false,
          error:
            'Server email is not configured. Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/CONTACT_TO/CONTACT_FROM.',
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `Portfolio contact from ${name}`;

    await transporter.sendMail({
      from: `Portfolio Contact <${from}>`,
      to,
      replyTo: email,
      subject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5;">
          <h2>New portfolio contact</h2>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Message:</b></p>
          <pre style="white-space: pre-wrap;">${escapeHtml(message)}</pre>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('contact route error', err);
    return Response.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

