import { getPendingBookingsByDriver } from "@/lib/controllers/driver";

export async function GET() {
    return await getPendingBookingsByDriver();
}