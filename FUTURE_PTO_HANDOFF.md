# 🦉 Welcome Future Old Orchard PTO Leaders!
### How to Update the PTO Website (`oopto661.com`) — Zero Coding Required

Our website is connected directly to our **Old Orchard PTO Google Sheet**. You never need to log into GitHub or touch a single line of code to update events, meeting dates, board member names, or volunteer links!

---

## ✨ How to Update the Website in 3 Simple Steps

* **1. Open the "Old Orchard PTO Website Master Sheet" in Google Drive:** Log into the official PTO Google Drive account and open the spreadsheet that controls the website.
* **2. Edit Any Row (Just Like a Normal Spreadsheet):** Change an event date under `EVENT`, update a monthly meeting under `MEETING`, type in the new PTO Board Member names and emails under `BOARD`, or update your Zoom link (`Zoom_Meeting_URL`), Committee form link (`Committee_Form_URL`), Volunteer form link (`Volunteer_Form_URL`), Instagram profile (`Instagram_URL`), or Yearbook photo upload link (`Yearbook_Upload_URL`) and questions email (`Yearbook_Email`) under `LINK`. *(Just keep the column headers in Row 1 and the labels in Column A—`EVENT`, `MEETING`, `COMMITTEE`, `BOARD`, `LINK`—unchanged!)*
* **3. Refresh `oopto661.com` to See Your Changes Live:** Google Sheets saves and publishes your edits automatically! Within 1–2 minutes, open `oopto661.com` and refresh your browser to see the updated schedule, board roster, and links live on the website.

---

## 🛠️ One-Time Initial Setup (Only Needed Once)

If you are setting up the Google Sheet connection or Contact Form for the very first time:

1. **Upload the Template to Google Sheets:**
   - Open Google Drive -> click **New** -> **File upload** -> choose `pto-website-template.csv` from this folder, then right-click it and select **Open with -> Google Sheets**.
2. **Publish the Sheet as a CSV Link:**
   - Inside Google Sheets, click **File** -> **Share** -> **Publish to web**.
   - Change the first dropdown from *"Entire Document"* to your sheet tab, and change *"Web page"* to **Comma-separated values (.csv)**, then click **Publish**.
   - Copy that link and paste it inside the quotes for `GOOGLE_SHEET_CSV_URL` at the top of `sheet-sync.js`.
3. **Activate the Contact Us Form & EIN:**
   - In `index.html`, replace `YOUR_PTO_EMAIL_HERE` (around the `#contact` form) with your official PTO email address (e.g., `info@oopto661.com`). The very first time someone submits the form, FormSubmit will email you a 1-click "Activate Form" confirmation button—click it once and it works forever!
   - In the footer of `index.html`, replace `XX-XXXXXXX` with the PTO's official 9-digit IRS EIN for Google Workspace for Nonprofits / Goodstack verification.

---

## 🌐 Dual Language Immersion (DLI) — Spanish Translation

Because Old Orchard Elementary is a proud **Dual Language Immersion (DLI)** school, the site features a built-in 1-click translation toggle:
* Located in the **dark blue announcement strip** at the top (`Traducir al Español` / `Switch to English`) and in the **mobile menu**.
* **Zero extra work for PTO leaders:** When you update events, dates, or committees in Google Sheets or HTML, the site translates them into Spanish automatically for Spanish-speaking families on demand!
