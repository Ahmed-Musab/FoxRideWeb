import { getRecentPendingBookingByDriver } from "@/lib/controllers/driver";

export async function GET() {
    return await getRecentPendingBookingByDriver();
}