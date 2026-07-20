import { getRejectedBookingsByEmail } from "@/lib/controllers/employee";

export async function GET() {
    return await getRejectedBookingsByEmail();
}