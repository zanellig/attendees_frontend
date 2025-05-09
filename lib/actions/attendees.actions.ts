"use server";
import { prepareIdParam } from "@/lib/server-utils";
import db, { transformQuery } from "@/lib/db/database.service";

export const updateAttendeesAssisted = async ({
  userId,
}: {
  userId: string;
}) => {
  const idParam = prepareIdParam(userId);
  try {
    const checkAssistedQuery = transformQuery(
      "SELECT assisted from attendees WHERE id = ?"
    );
    const [assistedRows] = await db.query(checkAssistedQuery, [idParam]);
    const assistedResult: boolean = assistedRows[0]?.assisted;
    const updateAssistedQuery = transformQuery(
      "UPDATE attendees SET assisted = ? WHERE id = ?"
    );
    const [attendeeRows] = await db.query(updateAssistedQuery, [
      !assistedResult,
      idParam,
    ]);
    return { success: true, assisted: attendeeRows[0]?.assisted };
  } catch (error) {
    console.error("Error confirming attendance:", error);
    return { success: false };
  }
};
export const updateAttendeesGiffed = async ({ userId }: { userId: string }) => {
  const idParam = prepareIdParam(userId);
  const updateGiftedQuery = transformQuery(
    "UPDATE attendees SET gift_received = ? WHERE id = ?"
  );
  try {
    await db.query(updateGiftedQuery, [true, idParam]);
    return { success: true };
  } catch (error) {
    console.error("Error confirming gift:", error);
    return { success: false };
  }
};
