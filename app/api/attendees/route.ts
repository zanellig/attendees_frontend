import { NextRequest, NextResponse } from "next/server";
import db, { transformQuery } from "@/lib/db/database.service";
import { Attendee } from "@/lib/types";

export async function GET() {
  try {
    const sql = transformQuery(
      "SELECT * FROM attendees ORDER BY confirmation_date DESC"
    );
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: Attendee = await request.json();

    // Validate required fields
    if (
      !data.name ||
      !data.phone_number ||
      !data.email ||
      !data.company ||
      !data.group_size
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone number format
    // The phone number should already be in the format "XXYXXXXXXXXX" from the frontend
    // But we'll validate it here as well for extra security
    const phoneNumberDigits = data.phone_number.replace(/\D/g, "");
    if (phoneNumberDigits.length < 12) {
      // Country code (2) + 9 (1) + phone number (10) = 13 digits minimum
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const sql = transformQuery(
      `INSERT INTO attendees 
       (name, phone_number, email, job_title, company, group_size, dietary_preferences, additional_comments) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const [result] = await db.query(sql, [
      data.name,
      data.phone_number, // Already transformed by the frontend
      data.email,
      data.job_title,
      data.company,
      data.group_size,
      data.dietary_preferences || null,
      data.additional_comments || null,
    ]);

    // Get the inserted ID (handle both MySQL and PostgreSQL)
    let insertId;
    if (Array.isArray(result) && result.length > 0) {
      // PostgreSQL returns the inserted row
      insertId = result[0].id;
    } else if (result && typeof result === "object" && "insertId" in result) {
      // MySQL returns an object with insertId
      insertId = (result as any).insertId;
    } else {
      insertId = 0; // Fallback
    }

    return NextResponse.json({ id: insertId, ...data }, { status: 201 });
  } catch (error) {
    console.error("Error creating attendee:", error);
    return NextResponse.json(
      { error: "Failed to create attendee" },
      { status: 500 }
    );
  }
}
