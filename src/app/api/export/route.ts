import { NextResponse } from "next/server";
import { google } from "googleapis";
import serviceAccount from "../../../../service-account.json"; // ✅ đường dẫn chỉnh theo vị trí thực tế

export async function POST(req: Request) {
  console.log("📌 API /api/export called");

  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID");
    }

    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    await auth.authorize();
    console.log("✅ Google Auth success");

    const body = await req.json();
    // console.log("📌 Request body:", body);

    const { rows, queryName, mode, eventCount, forceReplace } = body;
    const sheets = google.sheets({ version: "v4", auth });

    // 🔍 Lấy danh sách sheet hiện có
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === queryName
    );

    // Nếu sheet đã tồn tại mà chưa có cờ forceReplace
    if (existingSheet && !forceReplace) {
      return NextResponse.json({
        success: false,
        needConfirm: true,
        message: `Sheet "${queryName}" đã tồn tại. Xác nhận replace?`,
      });
    }

    // Nếu chưa có thì tạo mới sheet
    if (!existingSheet) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: queryName },
              },
            },
          ],
        },
      });
      console.log(`✅ Created new sheet "${queryName}"`);
    }

    // Chuẩn bị dữ liệu
    let values: any[][] = [];
    if (mode === "qa") {
      values = rows.map((r: any) => [r.video_id, r.frame_id, r.qa_text ?? ""]);
    } else if (mode === "trake") {
      values = rows.map((r: any) => {
        const vals = [r.video_id];
        for (let i = 1; i <= eventCount; i++) {
          vals.push(r[`frame_id_${i}`] ?? "");
        }
        return vals;
      });
    } else {
      values = rows.map((r: any) => [r.video_id, r.frame_id]);
    }

    console.log(`📌 Writing ${values.length} rows to sheet "${queryName}"`);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${queryName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    return NextResponse.json({
      success: true,
      replaced: !!existingSheet,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`,
    });
  } catch (err: any) {
    console.error("❌ Export error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
