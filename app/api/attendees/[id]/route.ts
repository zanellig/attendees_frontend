import { NextRequest, NextResponse } from "next/server";
import db, { transformQuery } from "@/lib/db/database.service";
import { Attendee } from "@/lib/types";
import { isValidPhoneNumber } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const sql = transformQuery("SELECT * FROM attendees WHERE id = ?");
    const [rows] = await db.query(sql, [id]);

    if (!rows || (Array.isArray(rows) && rows.length === 0)) {
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(Array.isArray(rows) ? rows[0] : rows);
  } catch (error) {
    console.error("Error fetching attendee:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendee" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const data: Attendee = await request.json();

    if (
      !data.name ||
      !data.phone_number ||
      !data.email ||
      !data.job_title ||
      !data.company ||
      !data.group_size
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const phoneNumberDigits = data.phone_number.replace(/\D/g, "");
    if (phoneNumberDigits.length < 12) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const sql = transformQuery(
      `UPDATE attendees SET 
       name = ?, 
       phone_number = ?, 
       email = ?, 
       job_title = ?, 
       company = ?, 
       group_size = ?, 
       dietary_preferences = ?, 
       additional_comments = ? 
       WHERE id = ?`
    );

    const [result] = await db.query(sql, [
      data.name,
      data.phone_number,
      data.email,
      data.job_title,
      data.company,
      data.group_size,
      data.dietary_preferences || null,
      data.additional_comments || null,
      id,
    ]);

    let affectedRows = 0;
    if (result && typeof result === "object" && "affectedRows" in result) {
      affectedRows = (result as any).affectedRows;
    } else if (result && typeof result === "object" && "rowCount" in result) {
      affectedRows = (result as any).rowCount;
    }

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: parseInt(id), ...data });
  } catch (error) {
    console.error("Error updating attendee:", error);
    return NextResponse.json(
      { error: "Failed to update attendee" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const sql = transformQuery("DELETE FROM attendees WHERE id = ?");
    const [result] = await db.query(sql, [id]);

    let affectedRows = 0;
    if (result && typeof result === "object" && "affectedRows" in result) {
      affectedRows = (result as any).affectedRows;
    } else if (result && typeof result === "object" && "rowCount" in result) {
      affectedRows = (result as any).rowCount;
    }

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting attendee:", error);
    return NextResponse.json(
      { error: "Failed to delete attendee" },
      { status: 500 }
    );
  }
}
