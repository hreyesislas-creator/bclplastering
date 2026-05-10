import { site } from "@/lib/site";

interface LeadEmailInput {
  leadId: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  serviceLabel: string;
  message: string | null;
  photoCount: number;
  photoUrls: string[];
  dashboardUrl: string;
}

function escape(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Branded plain-HTML email — designed to render acceptably in
 * Gmail, Apple Mail and Outlook. No JS, no remote CSS.
 */
export function renderLeadEmail(input: LeadEmailInput): string {
  const previewPhotos = input.photoUrls.slice(0, 4);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>New lead — ${escape(input.fullName)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0e0d0c;color:#f3efe6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0e0d0c;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:linear-gradient(180deg,#1d1c1a,#15141200);border:1px solid #2c2a26;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid #2c2a26;">
              <table role="presentation" width="100%"><tr>
                <td style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#f3efe6;letter-spacing:-0.01em;">
                  ${escape(site.shortName)}
                </td>
                <td align="right" style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#c1a26a;">
                  New lead
                </td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 12px;">
              <p style="margin:0 0 8px;font-size:13px;color:#a8a190;">${escape(
                input.serviceLabel
              )}${input.city ? " · " + escape(input.city) : ""}</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;line-height:1.2;color:#f3efe6;letter-spacing:-0.02em;">
                ${escape(input.fullName)}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 4px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #2c2a26;">
                    <table role="presentation" width="100%"><tr>
                      <td style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a8a190;width:120px;">Phone</td>
                      <td>
                        <a href="tel:${escape(input.phone)}" style="color:#e6c98a;text-decoration:none;font-weight:500;">${escape(
                          input.phone
                        )}</a>
                      </td>
                    </tr></table>
                  </td>
                </tr>
                ${
                  input.email
                    ? `<tr>
                  <td style="padding:8px 0;border-bottom:1px solid #2c2a26;">
                    <table role="presentation" width="100%"><tr>
                      <td style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a8a190;width:120px;">Email</td>
                      <td><a href="mailto:${escape(
                        input.email
                      )}" style="color:#e6c98a;text-decoration:none;">${escape(
                        input.email
                      )}</a></td>
                    </tr></table>
                  </td>
                </tr>`
                    : ""
                }
                ${
                  input.city
                    ? `<tr>
                  <td style="padding:8px 0;border-bottom:1px solid #2c2a26;">
                    <table role="presentation" width="100%"><tr>
                      <td style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a8a190;width:120px;">City</td>
                      <td style="color:#f3efe6;">${escape(input.city)}</td>
                    </tr></table>
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:8px 0;${input.message ? "border-bottom:1px solid #2c2a26;" : ""}">
                    <table role="presentation" width="100%"><tr>
                      <td style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a8a190;width:120px;">Service</td>
                      <td style="color:#f3efe6;">${escape(input.serviceLabel)}</td>
                    </tr></table>
                  </td>
                </tr>
                ${
                  input.message
                    ? `<tr>
                  <td style="padding:16px 0;">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a8a190;">Project notes</p>
                    <p style="margin:0;color:#f3efe6;line-height:1.55;font-size:15px;white-space:pre-wrap;">${escape(
                      input.message
                    )}</p>
                  </td>
                </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          ${
            input.photoCount > 0
              ? `<tr>
            <td style="padding:8px 32px 24px;">
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a8a190;">${input.photoCount} photo${
                input.photoCount === 1 ? "" : "s"
              } attached</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  ${previewPhotos
                    .map(
                      (url) =>
                        `<td style="padding:0 6px 6px 0;width:25%;"><img src="${escape(
                          url
                        )}" alt="" width="120" style="display:block;width:100%;height:auto;border-radius:6px;border:1px solid #2c2a26;" /></td>`
                    )
                    .join("")}
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }

          <tr>
            <td style="padding:8px 32px 32px;">
              <a href="${escape(input.dashboardUrl)}"
                 style="display:inline-block;background-color:#c1a26a;color:#1a1815;text-decoration:none;font-weight:600;padding:14px 24px;border-radius:10px;font-size:15px;">
                Open lead in dashboard →
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background-color:#15141200;border-top:1px solid #2c2a26;font-size:12px;color:#a8a190;">
              Sent by the BCL lead engine · Lead ID
              <span style="font-family:ui-monospace,Menlo,monospace;color:#c1a26a;">${escape(
                input.leadId.slice(0, 8)
              )}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
