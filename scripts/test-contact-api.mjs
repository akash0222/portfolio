import assert from "node:assert/strict";
import handler from "../api/contact.js";

const originalFetch = globalThis.fetch;
const originalApiKey = process.env.RESEND_API_KEY;
const originalFrom = process.env.RESEND_FROM_EMAIL;
const originalTo = process.env.CONTACT_TO_EMAIL;

process.env.RESEND_API_KEY = "test_resend_key";
process.env.RESEND_FROM_EMAIL = "Portfolio Test <onboarding@resend.dev>";
process.env.CONTACT_TO_EMAIL = "portfolio-test@example.com";

let fetchMode = "success";
let fetchCalls = [];

globalThis.fetch = async (url, options = {}) => {
  fetchCalls.push({ url, options });
  if (fetchMode === "timeout") {
    const error = new Error("The operation timed out");
    error.name = "TimeoutError";
    throw error;
  }
  if (fetchMode === "upstream-error") {
    return new Response("provider unavailable", { status: 503 });
  }
  return new Response(JSON.stringify({ id: "test-email-id" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return body;
    },
  };
}

function makeRequest({ method = "POST", body, ip, contentType = "application/json", contentLength } = {}) {
  const serialized = JSON.stringify(body ?? {});
  return {
    method,
    headers: {
      "content-type": contentType,
      "content-length": String(contentLength ?? Buffer.byteLength(serialized)),
      "x-real-ip": ip || "203.0.113.10",
    },
    body: body ?? {},
  };
}

const validBody = {
  name: "Test Sender",
  email: "person@example.com",
  service: "SaaS & workflow support",
  budget: "Need help estimating",
  message: "Please contact me about improving a workflow.",
  website: "",
};

let passed = 0;
async function test(name, run) {
  await run();
  passed += 1;
  console.log("PASS " + name);
}

try {
  await test("rejects non-POST requests", async () => {
    const res = makeResponse();
    await handler(makeRequest({ method: "GET" }), res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.allow, "POST");
  });

  await test("rejects non-JSON requests", async () => {
    const res = makeResponse();
    await handler(makeRequest({ body: validBody, contentType: "text/plain" }), res);
    assert.equal(res.statusCode, 415);
  });

  await test("rejects oversized requests", async () => {
    const res = makeResponse();
    await handler(makeRequest({ body: validBody, contentLength: 12001 }), res);
    assert.equal(res.statusCode, 413);
  });

  await test("accepts honeypot submissions without sending mail", async () => {
    const before = fetchCalls.length;
    const res = makeResponse();
    await handler(makeRequest({
      body: { ...validBody, website: "spam bot" },
      ip: "203.0.113.20",
    }), res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(fetchCalls.length, before);
  });

  await test("rejects invalid email and disallowed service", async () => {
    const res = makeResponse();
    await handler(makeRequest({
      body: { ...validBody, email: "not-an-email", service: "admin access" },
      ip: "203.0.113.21",
    }), res);
    assert.equal(res.statusCode, 400);
  });

  await test("sends a valid enquiry with safe reply-to and timeout", async () => {
    fetchCalls = [];
    fetchMode = "success";
    const res = makeResponse();
    await handler(makeRequest({ body: validBody, ip: "203.0.113.22" }), res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(fetchCalls.length, 1);
    assert.equal(fetchCalls[0].url, "https://api.resend.com/emails");
    const payload = JSON.parse(fetchCalls[0].options.body);
    assert.equal(payload.to[0], "portfolio-test@example.com");
    assert.equal(payload.reply_to, validBody.email);
    assert.equal(fetchCalls[0].options.signal instanceof AbortSignal, true);
    assert.equal(fetchCalls[0].options.signal.aborted, false);
  });

  await test("returns a delivery error when email provider rejects a message", async () => {
    fetchMode = "upstream-error";
    const res = makeResponse();
    await handler(makeRequest({ body: validBody, ip: "203.0.113.23" }), res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, false);
  });

  await test("returns a clear error when email provider times out", async () => {
    fetchMode = "timeout";
    const res = makeResponse();
    await handler(makeRequest({ body: validBody, ip: "203.0.113.24" }), res);
    assert.equal(res.statusCode, 502);
    assert.match(res.body.error, /too long to respond/i);
  });

  await test("rate-limits after five requests per IP in the window", async () => {
    fetchMode = "success";
    const ip = "203.0.113.25";
    for (let i = 0; i < 5; i += 1) {
      const res = makeResponse();
      await handler(makeRequest({ body: validBody, ip }), res);
      assert.equal(res.statusCode, 200, "request " + (i + 1) + " should be accepted");
    }
    const res = makeResponse();
    await handler(makeRequest({ body: validBody, ip }), res);
    assert.equal(res.statusCode, 429);
  });

  console.log("\nPassed " + passed + " contact API tests.");
} finally {
  globalThis.fetch = originalFetch;
  if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalApiKey;
  if (originalFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
  else process.env.RESEND_FROM_EMAIL = originalFrom;
  if (originalTo === undefined) delete process.env.CONTACT_TO_EMAIL;
  else process.env.CONTACT_TO_EMAIL = originalTo;
}
