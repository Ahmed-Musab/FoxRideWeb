import { getRecentPendingBooking } from "@/lib/controllers/transportAdmin";

export async function GET() {
    return await getRecentPendingBooking();
}