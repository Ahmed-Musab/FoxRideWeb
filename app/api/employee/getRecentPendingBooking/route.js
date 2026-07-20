import { getRecentPendingBooking } from "@/lib/controllers/employee";

export async function GET() {
    return await getRecentPendingBooking();
}