/**
 * Backend integration tests.
 *
 * Uses Node's built-in test runner (`node:test`) driven through `tsx`, so the
 * suite adds no dependencies. It runs against a real Express app and a real
 * MongoDB instance — these are integration tests, not mocks, because the point
 * is to prove that an inquiry actually persists.
 *
 * A dedicated database (`<name>_test`) is used and dropped at the end, so a
 * run can never touch development data.
 */

// Must be first: redirects the suite at a throwaway database before
// `config/env.ts` reads the environment.
import "./setup";

import assert from "node:assert/strict";
import type { Server } from "node:http";
import { after, before, describe, it } from "node:test";

import express from "express";
import mongoose from "mongoose";

import { createApp } from "../app";
import { connectDatabase, disconnectDatabase } from "../config/database";
import { buildLimiter } from "../middlewares/rateLimit.middleware";
import { Inquiry } from "../models/Inquiry";

let server: Server;
let baseUrl: string;

/** Minimal JSON client so the suite needs no HTTP helper library. */
async function post(path: string, body: unknown) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as never };
}

async function get(path: string, headers: Record<string, string> = {}) {
  const response = await fetch(`${baseUrl}${path}`, { headers });
  return {
    status: response.status,
    headers: response.headers,
    body: (await response.json()) as never,
  };
}

const customer = {
  name: "Ada Lovelace",
  email: "Ada@Example.com",
  phone: "+971 501234567",
};

const validFlight = {
  ...customer,
  tripType: "ROUND_TRIP",
  from: "London",
  to: "Dubai",
  departureDate: "2027-04-24",
  returnDate: "2027-04-30",
  adults: 2,
  children: 1,
  infants: 0,
  cabinClass: "ECONOMY",
  message: "Window seats if possible.",
};

const validHotel = {
  ...customer,
  destination: "Dubai Marina",
  checkIn: "2027-04-24",
  checkOut: "2027-04-30",
  rooms: 1,
  adults: 2,
  children: 1,
  hotelCategory: "FOUR_STAR",
};

const validCab = {
  ...customer,
  pickupLocation: "DXB Terminal 3, arrivals",
  dropoffLocation: "Dubai Marina",
  date: "2027-04-24",
  time: "14:30",
  vehicleType: "SEDAN",
  passengers: 3,
  luggage: 4,
};

const validGeneral = {
  ...customer,
  service: "OTHER",
  message: "We are planning a group trip and would like some help.",
};

before(async () => {
  await connectDatabase();
  await Inquiry.deleteMany({});

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await disconnectDatabase();
});

/* -------------------------------------------------------------------------- */

describe("GET /api/health", () => {
  it("returns 200 with an ok status", async () => {
    const res = await get("/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, "ok");
    assert.equal(res.body.data.database, "connected");
  });

  it("does not leak the database URI or any secret", async () => {
    const res = await get("/api/health");
    const serialised = JSON.stringify(res.body);
    assert.ok(!serialised.includes("mongodb://"), "health leaked the MongoDB URI");
    assert.ok(!serialised.includes("mongodb+srv"), "health leaked the MongoDB URI");
    assert.ok(!/xkeysib/i.test(serialised), "health leaked a Brevo key");
  });
});

/* -------------------------------------------------------------------------- */

describe("POST /api/inquiries/flight", () => {
  it("creates a flight inquiry and returns 201 with a reference", async () => {
    const res = await post("/api/inquiries/flight", validFlight);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.match(res.body.data.inquiryId, /^NEX-FLT-[2-9A-HJ-NP-TV-Z]{6}$/);
    assert.equal(res.body.data.type, "FLIGHT");
    assert.equal(res.body.data.status, "NEW");
  });

  it("persists the inquiry to MongoDB with the right shape", async () => {
    const res = await post("/api/inquiries/flight", validFlight);
    const stored = await Inquiry.findOne({
      inquiryId: res.body.data.inquiryId,
    }).lean();

    assert.ok(stored, "inquiry was not written to MongoDB");
    assert.equal(stored.type, "FLIGHT");
    assert.equal(stored.status, "NEW");
    assert.equal(stored.source, "WEBSITE");
    // Email is normalised to lower case on the way in.
    assert.equal(stored.customer.email, "ada@example.com");
    assert.equal(stored.customer.name, "Ada Lovelace");
    assert.equal(stored.travelDetails.from, "London");
    assert.equal(stored.travelDetails.to, "Dubai");
    assert.equal(stored.travelDetails.adults, 2);
    assert.equal(stored.travelDetails.cabinClass, "ECONOMY");
    assert.ok(stored.createdAt instanceof Date);
    assert.ok(stored.updatedAt instanceof Date);
  });

  it("accepts a nested customer object as well as flat fields", async () => {
    const { name, email, phone, ...rest } = validFlight;
    const res = await post("/api/inquiries/flight", {
      ...rest,
      customer: { name, email, phone },
    });
    assert.equal(res.status, 201);
  });

  it("rejects an invalid email with 400 and a field-level detail", async () => {
    const res = await post("/api/inquiries/flight", {
      ...validFlight,
      email: "not-an-email",
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "VALIDATION_ERROR");
    assert.ok(res.body.error.details["customer.email"]);
  });

  it("rejects a missing required field with 400", async () => {
    const { from, ...withoutFrom } = validFlight;
    const res = await post("/api/inquiries/flight", withoutFrom);
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, "VALIDATION_ERROR");
    assert.ok(res.body.error.details.from);
  });

  it("rejects an impossible date with 400", async () => {
    const res = await post("/api/inquiries/flight", {
      ...validFlight,
      departureDate: "2027-02-31",
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.departureDate);
  });

  it("rejects a departure date in the past", async () => {
    const res = await post("/api/inquiries/flight", {
      ...validFlight,
      departureDate: "2020-01-10",
      returnDate: "2020-01-20",
    });
    assert.equal(res.status, 400);
    assert.match(res.body.error.details.departureDate, /past/);
  });

  it("rejects a return date before departure with 400", async () => {
    const res = await post("/api/inquiries/flight", {
      ...validFlight,
      returnDate: "2027-04-01",
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.returnDate);
  });

  it("requires a return date for a round trip", async () => {
    const { returnDate, ...noReturn } = validFlight;
    const res = await post("/api/inquiries/flight", noReturn);
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.returnDate);
  });

  it("allows a one-way trip with no return date", async () => {
    const { returnDate, ...noReturn } = validFlight;
    const res = await post("/api/inquiries/flight", {
      ...noReturn,
      tripType: "ONE_WAY",
    });
    assert.equal(res.status, 201);
  });

  it("rejects an invalid enum value with 400", async () => {
    const res = await post("/api/inquiries/flight", {
      ...validFlight,
      cabinClass: "SPACESHIP",
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.cabinClass);
  });

  it("rejects a filled honeypot without explaining why", async () => {
    const res = await post("/api/inquiries/flight", {
      ...validFlight,
      companyWebsite: "http://spam.example",
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, "BAD_REQUEST");
    assert.ok(!/honeypot/i.test(JSON.stringify(res.body)));
  });
});

/* -------------------------------------------------------------------------- */

describe("POST /api/inquiries/hotel", () => {
  it("creates a hotel inquiry and persists it", async () => {
    const res = await post("/api/inquiries/hotel", validHotel);
    assert.equal(res.status, 201);
    assert.match(res.body.data.inquiryId, /^NEX-HOT-/);

    const stored = await Inquiry.findOne({
      inquiryId: res.body.data.inquiryId,
    }).lean();
    assert.ok(stored);
    assert.equal(stored.type, "HOTEL");
    assert.equal(stored.travelDetails.destination, "Dubai Marina");
    assert.equal(stored.travelDetails.hotelCategory, "FOUR_STAR");
  });

  it("rejects a check-in date in the past", async () => {
    const res = await post("/api/inquiries/hotel", {
      ...validHotel,
      checkIn: "2020-01-10",
      checkOut: "2020-01-12",
    });
    assert.equal(res.status, 400);
    assert.match(res.body.error.details.checkIn, /past/);
  });

  it("rejects check-out on or before check-in", async () => {
    const res = await post("/api/inquiries/hotel", {
      ...validHotel,
      checkOut: validHotel.checkIn,
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.checkOut);
  });
});

/* -------------------------------------------------------------------------- */

describe("POST /api/inquiries/cab", () => {
  it("creates a cab inquiry and persists it", async () => {
    const res = await post("/api/inquiries/cab", validCab);
    assert.equal(res.status, 201);
    assert.match(res.body.data.inquiryId, /^NEX-CAB-/);

    const stored = await Inquiry.findOne({
      inquiryId: res.body.data.inquiryId,
    }).lean();
    assert.ok(stored);
    assert.equal(stored.type, "CAB");
    assert.equal(stored.travelDetails.time, "14:30");
    assert.equal(stored.travelDetails.passengers, 3);
  });

  it("rejects a pickup date in the past", async () => {
    const res = await post("/api/inquiries/cab", { ...validCab, date: "2020-01-10" });
    assert.equal(res.status, 400);
    assert.match(res.body.error.details.date, /past/);
  });

  it("rejects a malformed time with 400", async () => {
    const res = await post("/api/inquiries/cab", { ...validCab, time: "25:99" });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.time);
  });
});

/* -------------------------------------------------------------------------- */

describe("POST /api/inquiries/general", () => {
  it("creates a general inquiry and persists it", async () => {
    const res = await post("/api/inquiries/general", validGeneral);
    assert.equal(res.status, 201);
    assert.match(res.body.data.inquiryId, /^NEX-GEN-/);

    const stored = await Inquiry.findOne({
      inquiryId: res.body.data.inquiryId,
    }).lean();
    assert.ok(stored);
    assert.equal(stored.type, "GENERAL");
    assert.equal(stored.message, validGeneral.message);
  });

  it("requires a message of reasonable length", async () => {
    const res = await post("/api/inquiries/general", {
      ...validGeneral,
      message: "hi",
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.message);
  });
});

/* -------------------------------------------------------------------------- */

describe("Security", () => {
  it("returns 404 in the standard envelope for an unknown route", async () => {
    const res = await get("/api/nope");
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "NOT_FOUND");
  });

  it("rejects a body over the size limit with 413", async () => {
    const res = await post("/api/inquiries/flight", {
      ...validFlight,
      message: "x".repeat(40_000),
    });
    assert.equal(res.status, 413);
    assert.equal(res.body.error.code, "PAYLOAD_TOO_LARGE");
  });

  it("rejects malformed JSON with 400", async () => {
    const response = await fetch(`${baseUrl}/api/inquiries/flight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });
    assert.equal(response.status, 400);
  });

  it("sets strict security headers and hides the framework", async () => {
    const res = await get("/api/health");
    assert.equal(res.headers.get("x-powered-by"), null);
    assert.match(
      res.headers.get("content-security-policy") ?? "",
      /default-src 'none'/
    );
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  });

  it("allows the configured origin via CORS", async () => {
    const res = await get("/api/health", { Origin: "http://localhost:3000" });
    assert.equal(
      res.headers.get("access-control-allow-origin"),
      "http://localhost:3000"
    );
  });

  it("does not allow an unlisted origin via CORS", async () => {
    const res = await get("/api/health", { Origin: "https://evil.example.com" });
    assert.equal(res.headers.get("access-control-allow-origin"), null);
  });

  it("enforces rate limiting and returns the standard 429 envelope", async () => {
    // The app lifts its limits under NODE_ENV=test so the rest of the suite
    // stays deterministic; this mounts a real limiter on a throwaway app.
    const app = express();
    app.use(
      buildLimiter({
        name: "test",
        windowMs: 60_000,
        limit: 2,
        message: "Too many requests. Please wait and try again.",
        skip: () => false,
      })
    );
    app.get("/ping", (_req, res) => {
      res.json({ ok: true });
    });

    const limited = await new Promise<Server>((resolve) => {
      const started = app.listen(0, () => resolve(started));
    });
    const port = (limited.address() as { port: number }).port;
    const url = "http://127.0.0.1:" + port + "/ping";

    try {
      assert.equal((await fetch(url)).status, 200);
      assert.equal((await fetch(url)).status, 200);

      const blocked = await fetch(url);
      assert.equal(blocked.status, 429, "third request was not rate limited");
      assert.ok(blocked.headers.get("ratelimit-policy"), "no rate limit headers");

      const payload = (await blocked.json()) as never;
      assert.equal(payload.success, false);
      assert.equal(payload.error.code, "RATE_LIMITED");
    } finally {
      await new Promise<void>((resolve) => limited.close(() => resolve()));
    }
  });

  it("does not count rejected requests toward the inquiry limit", async () => {
    const app = express();
    app.use(
      buildLimiter({
        name: "test-success-only",
        windowMs: 60_000,
        limit: 1,
        message: "Too many requests.",
        skip: () => false,
        countOnlySuccess: true,
      })
    );
    let ok = false;
    app.get("/submit", (_req, res) => {
      res.status(ok ? 201 : 400).json({});
    });

    const srv = await new Promise<Server>((resolve) => {
      const started = app.listen(0, () => resolve(started));
    });
    const url = "http://127.0.0.1:" + (srv.address() as { port: number }).port + "/submit";

    try {
      // Three validation failures in a row must not lock the customer out.
      for (let i = 0; i < 3; i += 1) assert.equal((await fetch(url)).status, 400);
      ok = true;
      assert.equal((await fetch(url)).status, 201, "customer was locked out after errors");
      assert.equal((await fetch(url)).status, 429, "successful submissions should still be limited");
    } finally {
      await new Promise<void>((resolve) => srv.close(() => resolve()));
    }
  });

  it("never returns a stack trace", async () => {
    const res = await post("/api/inquiries/flight", { ...validFlight, email: "x" });
    const serialised = JSON.stringify(res.body);
    assert.ok(!/\bat \w+.*\(/.test(serialised), "response contained a stack trace");
  });
});

/* -------------------------------------------------------------------------- */

describe("Inquiry references", () => {
  it("issues a unique reference for every inquiry", async () => {
    const responses = await Promise.all(
      Array.from({ length: 12 }, () => post("/api/inquiries/cab", validCab))
    );
    const ids = responses.map((r) => r.body.data.inquiryId as string);
    assert.equal(new Set(ids).size, ids.length, "duplicate reference issued");
  });
});
