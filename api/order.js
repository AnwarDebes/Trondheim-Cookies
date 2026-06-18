/* ============================================================
   Trondheim Cookies — order/enquiry email endpoint
   Runs as a Vercel Serverless Function at  POST /api/order
   Sends the submitted order to the bakery inbox via SendGrid.

   Required environment variables (set them in Vercel → Settings → Environment Variables):
     SENDGRID_API_KEY   – a SendGrid API key with "Mail Send" permission
     ORDER_TO_EMAIL     – inbox that receives orders   (e.g. trondheimcookie@gmail.com)
     ORDER_FROM_EMAIL   – a SendGrid-VERIFIED sender    (e.g. trondheimcookie@gmail.com)
   ============================================================ */

const MAX_FIELD = 5000;

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}
function clean(v) {
  return (typeof v === "string" ? v : "").slice(0, MAX_FIELD);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.ORDER_TO_EMAIL;
  const from = process.env.ORDER_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Missing SendGrid env vars", { hasKey: !!apiKey, hasTo: !!to, hasFrom: !!from });
    return res.status(500).json({ ok: false, error: "Email is not configured on the server." });
  }

  // Vercel parses JSON bodies automatically; fall back to manual parse just in case.
  let data = req.body;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { data = {}; }
  }
  data = data || {};

  const subject = clean(data.subject).trim() || "New message · Trondheim Cookies";
  const text = clean(data.text).trim();
  const replyTo = typeof data.replyTo === "string" ? data.replyTo.trim() : "";

  if (!text) {
    return res.status(400).json({ ok: false, error: "Empty message." });
  }

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from, name: "Trondheim Cookies" },
    subject: subject.slice(0, 255),
    content: [{ type: "text/plain", value: text }],
  };
  // Let the bakery hit "reply" and reach the customer directly.
  if (isEmail(replyTo)) {
    payload.reply_to = { email: replyTo };
  }

  try {
    const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (sgRes.status === 202) {
      return res.status(200).json({ ok: true });
    }

    const detail = await sgRes.text().catch(() => "");
    console.error("SendGrid error", sgRes.status, detail);
    return res.status(502).json({ ok: false, error: "Email service rejected the message." });
  } catch (err) {
    console.error("SendGrid request failed", err);
    return res.status(502).json({ ok: false, error: "Could not reach the email service." });
  }
};
