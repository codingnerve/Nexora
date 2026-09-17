# Nexora Destination

A travel assistance and booking-inquiry platform. Customers describe the trip
they need — flights, hotels, cabs or airport transfers — and a Nexora
Destination travel specialist contacts them to arrange it.

> **This is not an online travel agency.** There is no checkout, no payment
> gateway, no card collection, no ticket issuance and no live availability.
> The website collects travel requirements and hands them to a human agent.
> Every booking is completed manually, off-site, by that agent.

---

## Contents

- [Architecture](#architecture)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [MongoDB setup](#mongodb-setup)
- [Brevo setup](#brevo-setup)
- [API endpoints](#api-endpoints)
- [Inquiry lifecycle](#inquiry-lifecycle)
- [Design system](#design-system)
- [Photography](#photography)
- [Production build](#production-build)
- [Deployment architecture](#deployment-architecture)
- [Build phases](#build-phases)

---

## Architecture

Two independent applications. They share no code and no runtime, and
communicate only over HTTP/JSON.

```
nexora-destination/
├── frontend/     Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
├── backend/      Express 5 + TypeScript + MongoDB (Mongoose) + Zod + Brevo
├── README.md
└── .gitignore
```

```
Browser
   │  HTTPS / JSON
   ▼
Next.js frontend ──────────►  Express API
 (UI, validation, SEO)         │
                               ├─► Zod validation
                               ├─► MongoDB (inquiry stored, ID generated)
                               └─► Brevo ─┬─► agent notification email
                                          └─► customer acknowledgement email
```

**The frontend never holds a secret.** It has no database credentials, no
Brevo API key and no agent contact details beyond the public toll-free number.
Every value it reads is `NEXT_PUBLIC_`-prefixed and therefore safe to expose.
Brevo is called only from the backend.

---

## Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | ≥ 20 (developed on 22.13) | |
| npm | ≥ 10 | |
| MongoDB | ≥ 6 | Local server or MongoDB Atlas |
| Brevo account | — | Optional for local development |

---

## Quick start

Run the two applications in **separate terminals**.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit .env
npm run dev                 # http://localhost:5050
```

Verify it is healthy:

```bash
curl http://localhost:5050/api/health
```

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected",
    "email": "not configured",
    "environment": "development"
  }
}
```

`"email": "not configured"` is expected until Brevo credentials are added. The
API still accepts and stores inquiries in that state — it logs a warning rather
than reporting a false success.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # then edit .env.local
npm run dev                 # http://localhost:3000
```

> **Port note:** the API defaults to **5050**, not 5000, because port 5000 is
> commonly occupied on Windows (and by other local services). Change `PORT` in
> `backend/.env` and `NEXT_PUBLIC_API_URL` in `frontend/.env.local` together if
> you need a different port.

---

## Environment variables

Both apps ship a committed `.env.example` containing placeholders only. Real
`.env` / `.env.local` files are gitignored and must never be committed.

### `frontend/.env.local`

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | yes | Backend base URL, no trailing slash |
| `NEXT_PUBLIC_SITE_URL` | yes | Public origin for canonical URLs, OG tags, sitemap |
| `NEXT_PUBLIC_TOLL_FREE_NUMBER` | no | Display format, e.g. `1800 123 4567` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | no | With country code, e.g. `+971 50 123 4567`. Shows the floating WhatsApp button on phones |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | Public enquiries mailbox |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | no | Registered office, single line |
| `NEXT_PUBLIC_SUPPORT_HOURS` | no | Shown beside the phone number |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | no | ISO code preselected in the phone field, e.g. `IN` |
| `NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM` | no | `true` exposes `/design-system` in production builds. Leave unset |

All `NEXT_PUBLIC_*` values are inlined at **build** time and visible to anyone.
Never put a secret in one.

The optional values are **deliberately blank**. No phone number, email or
address is hardcoded anywhere in the codebase. Until you supply real details the
UI hides or disables the corresponding call-to-action rather than displaying an
invented one — see `frontend/lib/constants.ts`.

### `backend/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | no | `development` \| `production` \| `test` |
| `PORT` | no | Defaults to `5050` |
| `MONGODB_URI` | **yes** | Server refuses to start without it |
| `CLIENT_URL` | yes | Comma-separated allowed CORS origins, no trailing slash |
| `BREVO_API_KEY` | no* | Brevo transactional API key |
| `BREVO_SENDER_EMAIL` | no* | Must be a verified sender in Brevo |
| `BREVO_SENDER_NAME` | no | Defaults to `Nexora Destination` |
| `AGENT_EMAIL` | no* | Mailbox that receives every new inquiry |
| `AGENT_PHONE_NUMBER` | no | Included in customer acknowledgement emails |
| `EMAIL_ENABLED` | no | Set `false` to disable sending without removing keys |

\* Email is only sent when `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` and
`AGENT_EMAIL` are **all** present.

The environment is validated with Zod at startup (`backend/src/config/env.ts`).
An invalid environment aborts the process with a readable list of problems
instead of failing later at request time. A variable that is present but blank
is treated as absent.

---

## MongoDB setup

### Local

```bash
# Default connection string
MONGODB_URI=mongodb://127.0.0.1:27017/nexora_destination
```

The database and collection are created on the first inquiry; no migration step
is required.

### Atlas

1. Create a free cluster at <https://cloud.mongodb.com>.
2. **Database Access** → add a user with `readWrite` on `nexora_destination`.
3. **Network Access** → allow your IP, or your host's egress range.
4. Copy the connection string and set the database name:

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nexora_destination?retryWrites=true&w=majority
```

URL-encode any special characters in the password.

---

## Brevo setup

1. Create an account at <https://www.brevo.com>.
2. **Senders, Domains & Dedicated IPs** → add and verify your sending domain or
   sender address. Unverified senders are rejected.
3. **SMTP & API** → **API Keys** → generate a key.
4. Fill in `backend/.env`:

```bash
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Nexora Destination
AGENT_EMAIL=travel@yourdomain.com
```

Restart the API. In development, `GET /api/health` should then report
`"email": "configured"`, and the startup log shows `Brevo configured`. (Production
health responses omit this detail — check the log instead.)

---

## API endpoints

Base path: `/api`. All request and response bodies are JSON.

| Method | Endpoint | Purpose | Success |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Liveness plus database and email status | `200` |
| `POST` | `/api/inquiries/flight` | Flight assistance request | `201` |
| `POST` | `/api/inquiries/hotel` | Hotel assistance request | `201` |
| `POST` | `/api/inquiries/cab` | Cab / airport transfer request | `201` |
| `POST` | `/api/inquiries/general` | Contact form / general enquiry | `201` |

### Response envelope

Every response uses one of two shapes, so a client only branches on `success`.

```jsonc
// success
{
  "success": true,
  "message": "Flight inquiry received successfully.",
  "data": { "inquiryId": "NEX-FLT-8A42K1", "type": "FLIGHT", "status": "NEW", "createdAt": "2027-01-04T09:12:44.001Z" }
}

// failure
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check your submitted details.",
    "details": { "customer.email": "Enter a valid email address, for example name@example.com" }
  }
}
```

`error.details` is populated only for `VALIDATION_ERROR`, and maps a field path
to a message a form can display next to the input.

### Error codes

| Code | HTTP | Meaning |
| --- | --- | --- |
| `VALIDATION_ERROR` | `400` | One or more fields failed validation — see `details` |
| `BAD_REQUEST` | `400` | Malformed body, or the honeypot was filled |
| `NOT_FOUND` | `404` | Unknown route |
| `CONFLICT` | `409` | Reference collision that could not be resolved |
| `PAYLOAD_TOO_LARGE` | `413` | Body exceeded the 32&nbsp;kb limit |
| `RATE_LIMITED` | `429` | Too many requests from this IP |
| `INTERNAL_ERROR` | `500` | Unexpected failure — logged server-side, never detailed to the client |

---

### `GET /api/health`

Liveness check. Exposes no version numbers, hostnames, URIs or credentials.

```bash
curl http://localhost:5050/api/health
```

```json
{
  "success": true,
  "message": "Service is healthy.",
  "data": {
    "status": "ok",
    "database": "connected",
    "email": "not configured",
    "environment": "development",
    "uptimeSeconds": 42
  }
}
```

The example above is the development response. **In production only `status` is returned** (`{"status":"ok"}`), so the endpoint reveals nothing about configuration. Returns `503` with `"status": "degraded"` when the database is unreachable.

---

### `POST /api/inquiries/flight`

| Field | Required | Notes |
| --- | --- | --- |
| `tripType` | yes | `ROUND_TRIP` \| `ONE_WAY` \| `MULTI_CITY` |
| `from`, `to` | yes | 2–120 characters |
| `departureDate` | yes | `YYYY-MM-DD`, must be a real calendar date |
| `returnDate` | round trips only | Must not precede `departureDate` |
| `adults` | no (default 1) | 1–20 |
| `children` | no (default 0) | 0–20 |
| `infants` | no (default 0) | 0–9, and no more than `adults` |
| `cabinClass` | yes | `ECONOMY` \| `PREMIUM_ECONOMY` \| `BUSINESS` \| `FIRST` |
| `preferredAirline` | no | Free text, max 120 |
| `name`, `email`, `phone` | yes | May also be sent nested as `customer: { … }` |
| `message` | no | Max 2000 |
| `companyWebsite` | — | Honeypot. Must be absent or empty |

```bash
curl -X POST http://localhost:5050/api/inquiries/flight \
  -H 'Content-Type: application/json' \
  -d '{"tripType":"ROUND_TRIP","from":"London","to":"Dubai","departureDate":"2027-04-24","returnDate":"2027-04-30","adults":2,"children":1,"infants":0,"cabinClass":"ECONOMY","name":"Ada Lovelace","email":"ada@example.com","phone":"+971 501234567"}'
```

```json
{ "success": true, "message": "Flight inquiry received successfully.", "data": { "inquiryId": "NEX-FLT-WJ3WPC", "type": "FLIGHT", "status": "NEW", "createdAt": "…" } }
```

---

### `POST /api/inquiries/hotel`

| Field | Required | Notes |
| --- | --- | --- |
| `destination` | yes | 2–120 characters |
| `checkIn`, `checkOut` | yes | `YYYY-MM-DD`; `checkOut` must be **after** `checkIn` |
| `rooms` | no (default 1) | 1–20 |
| `adults` | no (default 1) | 1–30 |
| `children` | no (default 0) | 0–20 |
| `hotelCategory` | yes | `ANY` \| `BUDGET` \| `THREE_STAR` \| `FOUR_STAR` \| `FIVE_STAR` \| `RESORT` \| `APARTMENT` |
| `preferredArea` | no | Max 160 |
| `breakfast` | no | `ANY` \| `INCLUDED` \| `NOT_REQUIRED` |
| `name`, `email`, `phone` | yes | |
| `message` | no | Max 2000 |

---

### `POST /api/inquiries/cab`

| Field | Required | Notes |
| --- | --- | --- |
| `pickupLocation`, `dropoffLocation` | yes | 2–200 characters |
| `date` | yes | `YYYY-MM-DD` |
| `time` | yes | `HH:MM`, 24-hour |
| `vehicleType` | yes | `HATCHBACK` \| `SEDAN` \| `SUV` \| `VAN` \| `LUXURY` |
| `passengers` | no (default 1) | 1–30 |
| `luggage` | no (default 0) | 0–30 |
| `name`, `email`, `phone` | yes | |
| `message` | no | Max 2000 |

---

### `POST /api/inquiries/general`

Stored with `type: "GENERAL"`.

| Field | Required | Notes |
| --- | --- | --- |
| `message` | yes | 10–2000 characters |
| `service` | no | `FLIGHT` \| `HOTEL` \| `CAB` \| `OTHER` |
| `subject` | no | Max 160 |
| `name`, `email`, `phone` | yes | |

---

### Validation behaviour

- The backend is authoritative. Frontend validation exists only to save a round trip.
- `email` is normalised to lower case before storage.
- `phone` must contain 6–15 digits once separators are stripped; no national format is assumed.
- Dates must be real calendar dates — `2027-02-31` is rejected — and travel dates cannot be in the past (a one-day allowance covers visitors in other timezones).
- Unknown fields are stripped; the Mongoose schema is `strict`.
- Every request passes through the honeypot check; a filled `companyWebsite` returns a generic `400` that reveals nothing.

### Security

- **Helmet** with a strict `default-src 'none'` CSP (the API serves JSON only)
- **CORS** restricted to `CLIENT_URL`; unlisted browser origins receive no `Access-Control-Allow-Origin`
- **Rate limiting** — 300 requests / 15 min per IP overall, 8 / 15 min on inquiry endpoints
- **Body limit** of 32&nbsp;kb
- **Zod validation** on every request body
- `trust proxy` set to one hop in production so `req.ip` cannot be spoofed
- No stack traces, URIs, or credentials in any response; the MongoDB URI is never logged
- No payment information is collected anywhere

## Inquiry lifecycle

```
Visitor completes a form
        ▼
Frontend validates, POSTs to the API
        ▼
Zod validation  ──✗──►  422 with per-field messages
        ▼
Inquiry saved to MongoDB with a generated reference
        ▼
Brevo sends: agent notification + customer acknowledgement
        ▼
Customer lands on /thank-you showing the reference
        ▼
Agent contacts the customer and completes the booking manually
```

### Inquiry reference

Format `NEX-<SERVICE>-<RANDOM>`, e.g. `NEX-FLT-7A92K1`, `NEX-HOT-4P81M2`,
`NEX-CAB-9X73LQ`.

Generated with `crypto.randomInt` — not `Math.random` — so references cannot be
guessed or enumerated. The alphabet omits `0`, `1`, `I`, `L`, `O` and `U` so a
reference can be read aloud over the phone without ambiguity. A unique index on
`inquiryId` is the final guarantee against collision.

The reference is stored in MongoDB, included in both emails, and shown on the
thank-you page.

### Statuses

`NEW` → `CONTACTED` → `IN_PROGRESS` → `COMPLETED`, or `CANCELLED`.

---

## Design system

All design tokens live in **one place**: `frontend/app/globals.css`.

Raw values are declared as CSS custom properties on `:root`, then mapped into
Tailwind utilities via `@theme inline`. To re-skin the brand, edit the `:root`
values only.

| Role | Token family | Intent |
| --- | --- | --- |
| Primary | `ink-*` | Deep midnight navy — headings, dark sections |
| Background | `canvas-*` | Warm ivory |
| Accent | `clay-*` | Warm terracotta, used sparingly |
| Secondary accent | `amber-*` | Warm highlight |
| Neutral | `sand-*`, `stone-*` | Dividers, secondary text |

Semantic aliases (`bg-background`, `text-foreground-muted`, `border-line`,
`text-accent`) are preferred in components over raw scale steps.

**Typography** — `DM Serif Display` for editorial headings (single weight; not a
variable font), `Manrope` for all UI text. Both are self-hosted through
`next/font`, so no request reaches Google at runtime.

There is no dark mode: this is an intentionally warm, light editorial palette.

---

## Photography

Editorial photography is currently sourced from **Unsplash** as documented
placeholders. Every URL in the codebase was verified to resolve, and
`images.unsplash.com` is the only host allowed in `next.config.ts`
(`images.remotePatterns`).

**Before going live**, replace these with licensed brand photography:

1. Drop files into `frontend/public/images/`.
2. Update the image references.
3. Remove the Unsplash entry from `remotePatterns`.

Unsplash images are free to use under the
[Unsplash License](https://unsplash.com/license), but a production travel brand
should own its imagery.

---

## Production build

### Backend

```bash
cd backend
npm run typecheck     # tsc --noEmit
npm test              # integration tests against a throwaway *_test database
npm run build         # tsc  ->  dist/
npm start             # node dist/server.js
```

### Frontend

```bash
cd frontend
npm run build         # next build (Turbopack, type-checked)
npm start             # next start
```

---

## Deployment architecture

```
Internet ─▶ DNS ─▶ Nginx (HTTPS, reverse proxy)
                     ├─ YOUR_DOMAIN      ─▶ 127.0.0.1:3000  Next.js   (PM2: nexora-web)
                     └─ api.YOUR_DOMAIN  ─▶ 127.0.0.1:5050  Express   (PM2: nexora-api)
                                                               │
                                                               ├─▶ MongoDB (Atlas or local)
                                                               └─▶ Brevo transactional API
```

The frontend and API are separate processes and separate origins. Secrets live
only in `backend/.env` on the server. Templates for the reverse proxy and the
process manager are in [`deploy/`](deploy/) — they are **starting points to
review**, not files to copy over an existing server blindly.

### 1. DNS

Point `YOUR_DOMAIN`, `www.YOUR_DOMAIN` and `api.YOUR_DOMAIN` (A / AAAA records)
at the server's IP.

### 2. Backend

```bash
cd backend
npm ci
cp .env.example .env          # fill in real values — see below
npm run build
```

Production `backend/.env`:

```bash
NODE_ENV=production
PORT=5050
MONGODB_URI=mongodb+srv://…            # never commit
CLIENT_URL=https://YOUR_DOMAIN,https://www.YOUR_DOMAIN
BREVO_API_KEY=…                         # never commit
BREVO_SENDER_EMAIL=noreply@YOUR_DOMAIN  # verified sender in Brevo
BREVO_SENDER_NAME=Nexora Destination
AGENT_EMAIL=…
AGENT_PHONE_NUMBER=…
```

`CLIENT_URL` must list the exact public origins with no trailing slash, or CORS
rejects the browser. In production the API trusts exactly one proxy hop, so it
must sit behind Nginx (see the template) for rate limiting to see real client IPs.

### 3. Frontend

`NEXT_PUBLIC_*` values are **inlined at build time**, so set them before
building. Create `frontend/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://api.YOUR_DOMAIN
NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN
NEXT_PUBLIC_TOLL_FREE_NUMBER=…
NEXT_PUBLIC_CONTACT_EMAIL=…
NEXT_PUBLIC_COMPANY_ADDRESS=…
NEXT_PUBLIC_SUPPORT_HOURS=…
```

```bash
cd frontend
npm ci
npm run build    # prints a ⚠ warning if the site or API URL is still localhost
```

### 4. Processes (PM2)

```bash
pm2 ls                                                # check nothing with these names already runs
pm2 start deploy/ecosystem.config.cjs --env production
pm2 save && pm2 startup                               # survive reboots
pm2 logs nexora-api                                   # inquiry ids and email outcomes; no customer data
```

Adjust the `cwd` paths in `deploy/ecosystem.config.cjs` to the checkout location.
The API shuts down gracefully on SIGINT/SIGTERM (drains connections, closes
MongoDB); `kill_timeout` gives it time to do so.

### 5. Nginx + HTTPS

```bash
ls /etc/nginx/sites-enabled/ && nginx -T     # inspect first; do not touch other sites
# copy deploy/nginx/*.conf.example to sites-available, replace YOUR_DOMAIN, enable
nginx -t && systemctl reload nginx
certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN -d api.YOUR_DOMAIN
```

Once HTTPS is confirmed, enable the HSTS line noted in the web template. The API
already sends HSTS via Helmet.

### 6. Verify

```bash
curl https://api.YOUR_DOMAIN/api/health
# {"success":true,"message":"Service is healthy.","data":{"status":"ok"}}
```

In production the health response reveals only `status`; database and email
configuration details are shown in development only. Then send one real
inquiry of each type and confirm the MongoDB record, the agent email and the
customer acknowledgement. The full list is in
[`docs/GO_LIVE_CHECKLIST.md`](docs/GO_LIVE_CHECKLIST.md).

---

## Build phases

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation — structure, TypeScript, Tailwind, design tokens, env, README | **Complete** |
| 2 | Design system — tokens, buttons, inputs, cards, header, footer, motion | **Complete** |
| 3 | Homepage — hero, inquiry panel, all sections | **Complete** |
| 4 | Service pages + destinations + dynamic destination pages | **Complete** |
| 5 | Backend MVC — models, controllers, validators, inquiry API, tests | **Complete** |
| 6 | Frontend to backend integration + Brevo email | **Complete** |
| 7 | Full QA, security, SEO and production preparation — see [docs/GO_LIVE_CHECKLIST.md](docs/GO_LIVE_CHECKLIST.md) | **Complete** |

### Phase 1 verification

| Check | Result |
| --- | --- |
| `frontend` — `next build` | Passes, TypeScript clean |
| `backend` — `tsc --noEmit` | Passes |
| `backend` — `npm run build && npm start` | Serves from `dist/` |
| `GET /api/health` | `200`, database connected |
| Unknown route | `404` in the standard envelope |
| Malformed JSON body | `400`, no stack trace leaked |
| Body over 32 kb | `413` |
| CORS from an unlisted origin | Blocked (no `ACAO` header) |
| Invalid environment | Startup aborts with a readable report |
| Inquiry ID generator | Correct format, 0 collisions in 50,000 |
