/**
 * Shared email shell.
 *
 * Table-based, inline styles, no external CSS and no web fonts — the only
 * approach that survives Outlook, Gmail's HTML stripping and mobile clients
 * alike. The brand palette is repeated here as literals because an email
 * cannot read the site's CSS custom properties.
 */

export const BRAND = {
  ink: "#0d1a29",
  inkDeep: "#080f18",
  canvas: "#faf7f1",
  canvasAlt: "#f4efe5",
  sand: "#ddd1bd",
  clay: "#ac5129",
  stone: "#5d5850",
  stoneLight: "#706a5f",
  white: "#ffffff",
} as const;

/** Escapes user-supplied text so a submitted value can never inject markup. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface DetailRow {
  label: string;
  value: string | number | undefined | null;
}

/** Renders a label/value table, skipping rows with no value. */
export function detailRows(rows: readonly DetailRow[]): string {
  return rows
    .filter((row) => row.value !== undefined && row.value !== null && row.value !== "")
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BRAND.sand};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.stone};width:45%;vertical-align:top;">${escapeHtml(
            row.label
          )}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${BRAND.sand};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.ink};font-weight:bold;text-align:right;vertical-align:top;">${escapeHtml(
            row.value
          )}</td>
        </tr>`
    )
    .join("");
}

/** Plain-text equivalent of `detailRows`, for the text alternative. */
export function detailLines(rows: readonly DetailRow[]): string {
  return rows
    .filter((row) => row.value !== undefined && row.value !== null && row.value !== "")
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");
}

export function sectionHeading(text: string): string {
  return `
    <tr>
      <td style="padding:28px 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.clay};font-weight:bold;">
        ${escapeHtml(text)}
      </td>
    </tr>`;
}

/**
 * Wraps content in the branded shell.
 *
 * `footerNote` carries the transparency line — every email this system sends
 * must state that nothing has been booked or paid for.
 */
export function emailLayout({
  preheader,
  title,
  bodyRows,
  footerNote,
  tollFree,
}: {
  /** Hidden summary line shown in the inbox preview. */
  preheader: string;
  title: string;
  /** Pre-rendered `<tr>` rows. */
  bodyRows: string;
  footerNote: string;
  tollFree?: string | undefined;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.canvasAlt};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(
    preheader
  )}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.canvasAlt};">
    <tr>
      <td align="center" style="padding:28px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:${BRAND.canvas};border:1px solid ${BRAND.sand};">

          <!-- Masthead -->
          <tr>
            <td style="padding:26px 28px;background-color:${BRAND.ink};">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${BRAND.canvas};line-height:1;">Nexora</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:${BRAND.sand};padding-top:6px;">Destination</div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:30px 28px 0;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.25;color:${BRAND.ink};font-weight:normal;">${escapeHtml(
                title
              )}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${bodyRows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 28px 28px;border-top:1px solid ${BRAND.sand};">
              <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${BRAND.stoneLight};">
                ${escapeHtml(footerNote)}
              </p>
              ${
                tollFree
                  ? `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND.ink};">
                       Toll-free: <a href="tel:${escapeHtml(
                         tollFree.replace(/[^\d+]/g, "")
                       )}" style="color:${BRAND.clay};text-decoration:none;font-weight:bold;">${escapeHtml(
                         tollFree
                       )}</a>
                     </p>`
                  : ""
              }
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${BRAND.stoneLight};">
                Nexora Destination &middot; Travel assistance
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
