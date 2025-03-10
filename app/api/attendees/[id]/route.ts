import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { Attendee } from "@/lib/types";
import { isValidPhoneNumber, transformPhoneNumber } from "@/lib/utils";

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

    const [rows] = await pool.query("SELECT * FROM attendees WHERE id = ?", [
      id,
    ]);

    // @ts-ignore
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    // @ts-ignore
    return NextResponse.json(rows[0]);
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
      `UPDATE attendees SET 
       name = ?, 
       phone_number = ?, 
       email = ?, 
       job_title = ?, 
       company = ?, 
       group_size = ?, 
       dietary_preferences = ?, 
       additional_comments = ? 
       WHERE id = ?`,
      [
        data.name,
        data.phone_number, // Already transformed by the frontend
        data.email,
        data.job_title,
        data.company,
        data.group_size,
        data.dietary_preferences || null,
        data.additional_comments || null,
        id,
      ]
    );

    // @ts-ignore
    if (result.affectedRows === 0) {
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

    const [result] = await pool.query("DELETE FROM attendees WHERE id = ?", [
      id,
    ]);

    // @ts-ignore
    if (result.affectedRows === 0) {
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
