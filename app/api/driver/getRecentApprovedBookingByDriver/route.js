import { getRecentApprovedBookingByDriver } from "@/lib/controllers/driver";

export async function GET() {
    return await getRecentApprovedBookingByDriver();
}