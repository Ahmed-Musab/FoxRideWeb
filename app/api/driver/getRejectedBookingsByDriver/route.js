import { getRejectedBookingsByDriver } from "@/lib/controllers/driver";

export async function GET() {
    return await getRejectedBookingsByDriver();
}   