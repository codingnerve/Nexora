# Nexora Destination — Go-Live Checklist

Status legend:

- `[x]` **Verified in Phase 7** on a local machine (production build of the
  frontend, compiled backend, local MongoDB). Evidence noted alongside.
- `[ ]` **Not yet verifiable** — needs production infrastructure, real
  credentials or business input. Must be checked on the live server.

Verification date: 16 Sep 2026.

---

## Frontend

- [x] Build passes — `next build`, 26 routes, TypeScript and ESLint clean
- [x] Routes work — 22 public routes return 200; `/design-system` and unknown slugs return 404 in production
- [x] Mobile responsive — 14 routes × 8 widths (320–1920px): no horizontal overflow, one H1 per page
- [x] Forms work — flight, hotel, cab and contact submitted through the UI; each reached `/thank-you` with its reference
- [x] Navigation works — header, footer and mobile menu (keyboard open, focus trap, Escape returns focus)
- [x] Images work — every image has alt text; only the visually verified Unsplash set is used
- [x] No horizontal overflow — see mobile check above
- [ ] Replace Unsplash placeholder photography with licensed brand images

## Backend

- [x] Build passes — `tsc`, 0 errors
- [x] Health endpoint works — 200; production response is `{"status":"ok"}` only
- [x] Validation works — 32 integration tests; manual abuse tests (wrong types, arrays, missing body, oversize fields, past dates)
- [x] Rate limiting works — 9th successful inquiry from one client returns 429 with a friendly message; rejected submissions do not count
- [x] CORS works — configured origin allowed; localhost and foreign origins refused in production mode
- [x] Error handling works — 400/404/413/429/500 all return the standard envelope, no stack traces
- [ ] Health endpoint reachable at `https://api.YOUR_DOMAIN/api/health`

## Database

- [x] MongoDB connection works (local)
- [x] Inquiry persistence works — records verified for all four types
- [x] Inquiry IDs generated correctly — `NEX-FLT/HOT/CAB/GEN-XXXXXX`
- [x] Status defaults to NEW — schema enum `NEW, CONTACTED, IN_PROGRESS, COMPLETED, CANCELLED`
- [x] Mass-assignment blocked — client-supplied `status`, `inquiryId`, `$where` and extra fields are not stored
- [x] Unreachable database — API refuses to start, logs no credentials
- [ ] Production MongoDB (Atlas or server) connection, with network access restricted to the API host
- [ ] Remove local QA test records before real use (names such as "Phase Seven QA", "P7 …")

## Email

- [x] Email failure does not lose inquiry — with an invalid Brevo key the API returned 201, the record was stored, and both failures were logged by reference only
- [x] Templates reviewed — agent and customer HTML rendered and inspected; no "confirmed / booked / issued" wording; user input escaped
- [ ] Brevo configured — needs a real `BREVO_API_KEY` and a verified sender domain
- [ ] Agent email received in a real inbox
- [ ] Customer acknowledgement received in a real inbox
- [ ] Rendering checked in Gmail, Outlook and Apple Mail (not possible without delivery)
- [ ] Sender domain SPF / DKIM set up in DNS

## SEO

- [x] Metadata — unique title and description on every public page; `og:title` includes the brand
- [x] Canonicals — generated from `NEXT_PUBLIC_SITE_URL` (verified switching to a production URL with no localhost left)
- [x] Sitemap — 19 URLs; excludes `/thank-you`, `/design-system` and APIs
- [x] Robots — allows `/`, disallows `/thank-you` and `/design-system`, references the sitemap
- [x] Structured data — `TravelAgency` + `WebSite` (home), `BreadcrumbList` (destinations), `FAQPage` (FAQ); JSON parses; no ratings, reviews, offers or prices
- [x] Open Graph — present on all pages
- [ ] Build with the real `NEXT_PUBLIC_SITE_URL` (the build prints a ⚠ warning if it is still localhost)
- [ ] Submit the sitemap in Google Search Console after launch

## Security

- [x] Secrets protected — `.env`, `.env.local`, `.env.production`, `.env.bak` all git-ignored; git history contains no secrets
- [x] `.env` ignored
- [x] No API keys in frontend — built client bundle scanned: no Brevo key, MongoDB URI or agent email
- [x] Security headers — API: strict CSP, HSTS, nosniff; site: `X-Frame-Options: DENY`, `frame-ancestors 'none'`, nosniff, referrer policy
- [x] Rate limiting
- [x] Input validation — Zod on every endpoint; NoSQL operator keys stripped
- [x] Safe production errors — no stack traces, paths or internal messages
- [x] Logs contain no customer name, email, phone, message, API key or database URI
- [x] `npm audit` — 0 vulnerabilities (frontend and backend)
- [x] No SSRF surface — the only outbound request is to Brevo's fixed endpoint
- [ ] Have the privacy policy, terms and cancellation policy reviewed, and add the legal entity name and jurisdiction

## Production

- [ ] Production API URL — `NEXT_PUBLIC_API_URL=https://api.YOUR_DOMAIN`
- [ ] Production site URL — `NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN`
- [ ] Toll-free number, contact email, address and support hours set (`NEXT_PUBLIC_*`)
- [ ] CORS production origin — `CLIENT_URL=https://YOUR_DOMAIN,https://www.YOUR_DOMAIN`
- [ ] DNS — A/AAAA records for the site, `www` and `api`
- [ ] HTTPS — certbot certificates issued; HSTS enabled on the site once confirmed
- [ ] Nginx — `deploy/nginx/*.conf.example` adapted and enabled without touching other sites
- [ ] PM2 — `deploy/ecosystem.config.cjs` paths adjusted; `pm2 save` and `pm2 startup` run
- [ ] Health check — `curl https://api.YOUR_DOMAIN/api/health`
- [ ] One real inquiry of each type end to end on the live site
