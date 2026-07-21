import { getCompletedBookingsByDriver } from "@/lib/controllers/driver";

export async function GET() {
    return await getCompletedBookingsByDriver();
}