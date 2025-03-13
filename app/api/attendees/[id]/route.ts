import { NextRequest, NextResponse } from "next/server";
import db, { transformQuery } from "@/lib/db/database.service";
import { Attendee } from "@/lib/types";
import { CONSTRAINT_ERRORS } from "@/lib/constants";

// Get database type from environment variables
const dbType = process.env.DATABASE_TYPE || "mysql";

// Function to prepare ID parameter based on database type
const prepareIdParam = (id: string) => {
  // For PostgreSQL, ensure the ID is treated as an integer
  if (dbType === "postgres") {
    return parseInt(id);
  }
  // For MySQL, return as is
  return id;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("GET - ID:", id, "Type:", typeof id);

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const idParam = prepareIdParam(id);
    console.log("GET - Prepared ID:", idParam, "Type:", typeof idParam);

    const sql = transformQuery("SELECT * FROM attendees WHERE id = ?");
    console.log("GET - SQL:", sql);

    const [rows, result] = await db.query(sql, [idParam]);
    console.log("GET - Query result:", rows);
    console.log("GET - Query metadata:", result);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("PUT - ID:", id, "Type:", typeof id);

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const idParam = prepareIdParam(id);
    console.log("PUT - Prepared ID:", idParam, "Type:", typeof idParam);

    const data: Attendee = await request.json();
    console.log("PUT - Data:", data);

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

    let sql;
    if (dbType === "postgres") {
      // For PostgreSQL, use RETURNING to get the updated row
      sql = transformQuery(
        `UPDATE attendees SET 
         name = ?, 
         phone_number = ?, 
         email = ?, 
         job_title = ?, 
         company = ?, 
         group_size = ?, 
         dietary_preferences = ?, 
         additional_comments = ? 
         WHERE id = ? RETURNING *`
      );
    } else {
      // For MySQL, use the standard UPDATE
      sql = transformQuery(
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
    }
    console.log("PUT - SQL:", sql);

    const params_array = [
      data.name,
      data.phone_number,
      data.email,
      data.job_title,
      data.company,
      data.group_size,
      data.dietary_preferences || null,
      data.additional_comments || null,
      idParam,
    ];
    console.log("PUT - Params:", params_array);

    const [rows, result] = await db.query(sql, params_array);
    console.log("PUT - Query result:", rows);
    console.log("PUT - Query metadata:", result);

    let affectedRows = 0;
    if (result && typeof result === "object" && "affectedRows" in result) {
      affectedRows = (result as any).affectedRows;
      console.log("PUT - MySQL affectedRows:", affectedRows);
    } else if (result && typeof result === "object" && "rowCount" in result) {
      affectedRows = (result as any).rowCount;
      console.log("PUT - PostgreSQL rowCount:", affectedRows);
    } else if (Array.isArray(rows) && rows.length > 0) {
      affectedRows = rows.length;
      console.log("PUT - PostgreSQL returned rows:", affectedRows);
    } else {
      console.log("PUT - Result structure:", result);
      console.log("PUT - Rows structure:", rows);
    }

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: parseInt(id), ...data });
  } catch (error: any) {
    console.error("Error updating attendee:", error);

    // Check for constraint violations
    const constraint: string | undefined = error.constraint;

    if (constraint) {
      return NextResponse.json(
        {
          error: CONSTRAINT_ERRORS[
            constraint as keyof typeof CONSTRAINT_ERRORS
          ] as string,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update attendee" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("DELETE - ID:", id, "Type:", typeof id);

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const idParam = prepareIdParam(id);
    console.log("DELETE - Prepared ID:", idParam, "Type:", typeof idParam);

    let sql;
    if (dbType === "postgres") {
      // For PostgreSQL, use RETURNING to get the deleted row
      sql = transformQuery("DELETE FROM attendees WHERE id = ? RETURNING *");
    } else {
      // For MySQL, use the standard DELETE
      sql = transformQuery("DELETE FROM attendees WHERE id = ?");
    }
    console.log("DELETE - SQL:", sql);

    const [rows, result] = await db.query(sql, [idParam]);
    console.log("DELETE - Query result:", rows);
    console.log("DELETE - Query metadata:", result);

    let affectedRows = 0;
    if (result && typeof result === "object" && "affectedRows" in result) {
      affectedRows = (result as any).affectedRows;
      console.log("DELETE - MySQL affectedRows:", affectedRows);
    } else if (result && typeof result === "object" && "rowCount" in result) {
      affectedRows = (result as any).rowCount;
      console.log("DELETE - PostgreSQL rowCount:", affectedRows);
    } else if (Array.isArray(rows) && rows.length > 0) {
      affectedRows = rows.length;
      console.log("DELETE - PostgreSQL returned rows:", affectedRows);
    } else {
      console.log("DELETE - Result structure:", result);
      console.log("DELETE - Rows structure:", rows);
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
