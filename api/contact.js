const CONTACT_EMAIL = process.env.CONTACT_TO_EMAIL || "abhsingh76@gmail.com";
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

// Best-effort per-instance protection. The hidden form field is an additional spam trap.
const rateLimitBuckets = new Map();

const ALLOWED_SERVICES = new Set([
  "SaaS & workflow support",
  "Web app or internal tool",
  "Business website",
  "E-commerce storefront",
  "Data & process improvement",
  "Other / not sure yet",
]);

const ALLOWED_BUDGETS = new Set([
  "",
  "Under ₹25,000",
  "₹25,000–₹75,000",
  "₹75,000+",
  "Need help estimating",
]);

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sendJson(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(payload);
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isRateLimited(key) {
  const now = Date.now();
  const recent = (rateLimitBuckets.get(key) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(key, recent);
    return true;
  }

  recent.push(now);
  rateLimitBuckets.set(key, recent);

  // Keep the in-memory map small on warm serverless instances.
  if (rateLimitBuckets.size > 500) {
    for (const [bucketKey, timestamps] of rateLimitBuckets.entries()) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
        rateLimitBuckets.delete(bucketKey);
      }
    }
  }

  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, error: "Method not allowed." });
  }

  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return sendJson(res, 415, { ok: false, error: "Send the enquiry as JSON." });
  }

  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};

  // Silently accept bot submissions that fill the visually-hidden honeypot.
  if (clean(body.website, 200)) {
    return sendJson(res, 200, { ok: true });
  }

  const ip = String(req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || "unknown")
    .split(",")[0]
    .trim()
    .slice(0, 100);

  if (isRateLimited(ip)) {
    return sendJson(res, 429, {
      ok: false,
      error: "Too many attempts. Please wait a few minutes and try again.",
    });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const service = clean(body.service, 80);
  const budget = clean(body.budget, 80);
  const message = clean(body.message, 1500);

  if (name.length < 2 || !isValidEmail(email) || !ALLOWED_SERVICES.has(service)
      || !ALLOWED_BUDGETS.has(budget) || message.length < 10) {
    return sendJson(res, 400, {
      ok: false,
      error: "Please check your name, email, service, and project brief.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("Contact form is not configured: RESEND_API_KEY or RESEND_FROM_EMAIL is missing.");
    return sendJson(res, 503, {
      ok: false,
      error: "The enquiry service is not configured yet. Please email Akash directly.",
    });
  }

  const emailText = [
    "New portfolio enquiry",
    "",
    "Name: " + name,
    "Email: " + email,
    "Service: " + service,
    "Budget: " + (budget || "Not specified"),
    "",
    "Project brief:",
    message,
    "",
    "Submitted from AKASH / WORKS.",
  ].join("\n");

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: "Portfolio enquiry: " + service,
        text: emailText,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend rejected a contact enquiry:", resendResponse.status, errorText.slice(0, 500));
      return sendJson(res, 502, {
        ok: false,
        error: "The email service could not send your enquiry. Please email Akash directly.",
      });
    }

    return sendJson(res, 200, { ok: true, message: "Enquiry sent." });
  } catch (error) {
    console.error("Contact enquiry delivery failed:", error instanceof Error ? error.message : "Unknown error");
    return sendJson(res, 502, {
      ok: false,
      error: "The email service is temporarily unavailable. Please email Akash directly.",
    });
  }
}
