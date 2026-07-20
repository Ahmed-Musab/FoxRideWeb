import { getRecentApprovedBooking } from "@/lib/controllers/employee";

export async function GET() {
    return await getRecentApprovedBooking();
}