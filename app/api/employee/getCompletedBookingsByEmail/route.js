import { getCompletedBookingsByEmail } from "@/lib/controllers/employee";

export async function GET() {
    return await getCompletedBookingsByEmail();
}