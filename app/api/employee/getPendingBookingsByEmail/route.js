import { getPendingBookingsByEmail } from "@/lib/controllers/employee";

export async function GET() {
    return await getPendingBookingsByEmail();
}