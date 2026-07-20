import { getRecentRejectedBooking } from "@/lib/controllers/employee";

export async function GET() {
    return await getRecentRejectedBooking();
}