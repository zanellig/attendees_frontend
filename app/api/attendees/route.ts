import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { Attendee } from "@/lib/types";
import { isValidPhoneNumber, transformPhoneNumber } from "@/lib/utils";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM attendees ORDER BY confirmation_date DESC"
    );
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
      !data.job_title ||
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

    const [result] = await pool.query(
      `INSERT INTO attendees 
       (name, phone_number, email, job_title, company, group_size, dietary_preferences, additional_comments) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.phone_number, // Already transformed by the frontend
        data.email,
        data.job_title,
        data.company,
        data.group_size,
        data.dietary_preferences || null,
        data.additional_comments || null,
      ]
    );

    // @ts-ignore
    const insertId = result.insertId;

    return NextResponse.json({ id: insertId, ...data }, { status: 201 });
  } catch (error) {
    console.error("Error creating attendee:", error);
    return NextResponse.json(
      { error: "Failed to create attendee" },
      { status: 500 }
    );
  }
}
