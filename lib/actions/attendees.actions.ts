"use server";
import { prepareIdParam } from "@/lib/server-utils";
import db, { transformQuery } from "@/lib/db/database.service";

export const updateAttendeesAssisted = async ({
  userId,
}: {
  userId: string;
}) => {
  console.log("USER ID :_______", userId);
  const idParam = prepareIdParam(userId);
  try {
    const checkAssistedQuery = transformQuery("SELECT assisted from attendees WHERE id = ?");
    const [assistedRows] = await db.query(checkAssistedQuery, [idParam]);
    const assistedResult: boolean = assistedRows[0]?.assisted;
    console.log("Assisted Result:", assistedResult);
    const updateAssistedQuery = transformQuery(
      `UPDATE attendees SET assisted = ${!assistedResult} WHERE id = ?`
    );
    console.log("Prepared query asissted:", updateAssistedQuery);
    
    const [attendeeRows] = await db.query(updateAssistedQuery, [idParam]);
    console.log("Assisted Result:", attendeeRows[0]);

  } catch (error) {
    console.error("Error confirming attendance:", error);
  }
};
