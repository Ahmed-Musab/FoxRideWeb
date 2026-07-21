import { getRecentApprovedBooking } from "@/lib/controllers/transportAdmin";

export async function GET() {
    return await getRecentApprovedBooking();
}