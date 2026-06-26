/**
 * ============================================================
 *  WEBHOOK.GS — Google Apps Script Web App
 *  Receives POST from Local Business Profile promotion form
 *  and writes the lead data to a Google Sheet.
 *
 *  SETUP STEPS:
 *  1. Go to script.google.com → New Project
 *  2. Paste this entire file
 *  3. Set SHEET_ID below (from your Google Sheet URL)
 *  4. Set SHEET_TAB_NAME to your sheet tab name
 *  5. Click Deploy → New Deployment → Web App
 *     - Execute as: Me
 *     - Who has access: Anyone (even anonymous)
 *  6. Copy the Web App URL → paste into config.js → promotion.webhookUrl
 *
 *  OPTIONAL: Set NOTIFY_EMAIL to receive an email on each new lead.
 * ============================================================
 */

// ── Configuration ────────────────────────────────────────────
const SHEET_ID       = "YOUR_GOOGLE_SHEET_ID";   // From sheet URL: /d/THIS_PART/edit
const SHEET_TAB_NAME = "Leads";                   // Tab name inside the sheet
const NOTIFY_EMAIL   = "";                        // e.g. "adlan@dezeek.com" or "" to disable
// ─────────────────────────────────────────────────────────────


/**
 * doPost — handles the incoming POST request from the web page.
 */
function doPost(e) {
  try {
    // Parse JSON body
    const raw  = e.postData?.contents || "{}";
    const data = JSON.parse(raw);

    // Write to sheet
    const sheet = getOrCreateSheet();
    appendLead(sheet, data);

    // Optional: send email notification
    if (NOTIFY_EMAIL) sendEmailNotification(data);

    // Return success (note: no-cors mode means the client won't read this)
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("doPost error:", err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * doGet — health check (useful for testing the deployment URL in browser).
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status:  "ok",
      message: "Local Biz Webhook is live.",
      time:    new Date().toISOString(),
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * getOrCreateSheet — returns the sheet tab, creating it with headers if new.
 */
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_TAB_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TAB_NAME);
    // Write header row
    const headers = [
      "Timestamp",
      "Business",
      "Promotion",
      "Name",
      "Phone",
      "Email",
      "Source URL",
    ];
    sheet.appendRow(headers);

    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1E1E1E");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 180);  // Timestamp
    sheet.setColumnWidth(2, 160);  // Business
    sheet.setColumnWidth(3, 200);  // Promotion
    sheet.setColumnWidth(4, 160);  // Name
    sheet.setColumnWidth(5, 130);  // Phone
    sheet.setColumnWidth(6, 200);  // Email
    sheet.setColumnWidth(7, 280);  // Source URL
  }

  return sheet;
}


/**
 * appendLead — writes one row of lead data to the sheet.
 */
function appendLead(sheet, data) {
  const row = [
    data.timestamp  || new Date().toISOString(),
    data.business   || "",
    data.promotion  || "",
    data.name       || "",
    data.phone      || "",
    data.email      || "",
    data.source     || "",
  ];
  sheet.appendRow(row);

  // Auto-resize rows for readability
  const lastRow = sheet.getLastRow();
  sheet.setRowHeight(lastRow, 28);
}


/**
 * sendEmailNotification — sends a formatted email for each new lead.
 */
function sendEmailNotification(data) {
  if (!NOTIFY_EMAIL) return;

  const subject = `[New Lead] ${data.name || "New Prospect"} — ${data.business || "Local Biz"}`;

  const body = `
New promotion lead received!

Business:   ${data.business   || "—"}
Promotion:  ${data.promotion  || "—"}

Name:       ${data.name       || "—"}
Phone:      ${data.phone      || "—"}
Email:      ${data.email      || "—"}

Submitted:  ${data.timestamp  || new Date().toISOString()}
Source:     ${data.source     || "—"}

---
Sent automatically by Local Business Profile Webhook.
  `.trim();

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:500px;">
      <h2 style="color:#E31837;margin-bottom:4px;">New Lead Received</h2>
      <p style="color:#666;margin-top:0;">${data.business || "Local Business"} — ${data.promotion || "Promotion"}</p>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;width:120px;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${data.name || "—"}</td></tr>
        <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${data.phone || "—"}</td></tr>
        <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${data.email || "—"}</td></tr>
        <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;">Submitted</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${data.timestamp || "—"}</td></tr>
        <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;">Source</td><td style="padding:8px 12px;">${data.source || "—"}</td></tr>
      </table>
      <p style="color:#999;font-size:12px;margin-top:16px;">Sent automatically by Local Business Profile Webhook.</p>
    </div>
  `;

  MailApp.sendEmail({
    to:       NOTIFY_EMAIL,
    subject:  subject,
    body:     body,
    htmlBody: htmlBody,
  });
}


/**
 * ──────────────────────────────────────────────────────────────
 *  TEST FUNCTION — run this manually inside Apps Script editor
 *  to verify your sheet setup works before deploying.
 * ──────────────────────────────────────────────────────────────
 */
function testWebhook() {
  const mockData = {
    timestamp:  new Date().toISOString(),
    business:   "Caltex Sungai Besi",
    promotion:  "Tuntut Promosi Anda",
    name:       "Ahmad Test",
    phone:      "+60123456789",
    email:      "test@example.com",
    source:     "https://example.com/caltex",
  };

  const sheet = getOrCreateSheet();
  appendLead(sheet, mockData);
  Logger.log("Test lead written to sheet: " + SHEET_TAB_NAME);
}
