import { NextResponse } from "next/server";
import { google } from "googleapis";
import serviceAccount from "../../../../service-account.json";




export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error("Missing GOOGLE_SHEET_ID");

    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key.replace(/\\n/g, "\n"), // fix lỗi xuống dòng
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    await auth.authorize();
    const sheets = google.sheets({ version: "v4", auth });

    // lấy metadata
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetList = spreadsheet.data.sheets ?? [];

    const results: { sheetName: string; firstRow: string[] }[] = [];

    for (const s of sheetList) {
      const title = s.properties?.title;
      if (!title) continue;

      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${title}!1:1`,
      });

      const firstRow = resp.data.values?.[0] ?? [];
      results.push({ sheetName: title, firstRow });
    }

    return NextResponse.json({ success: true, tabs: results });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
