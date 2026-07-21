import { getRecentRejectedBookingByDriver } from "@/lib/controllers/driver";

export async function GET() {
    return await getRecentRejectedBookingByDriver();
}