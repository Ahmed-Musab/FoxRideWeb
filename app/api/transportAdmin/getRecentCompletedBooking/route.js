import { getRecentCompletedBooking } from "@/lib/controllers/transportAdmin";

export async function GET() {
    return await getRecentCompletedBooking();
}