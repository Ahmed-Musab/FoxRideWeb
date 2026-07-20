import { getApprovedBookingsByEmail } from "@/lib/controllers/employee";

export async function GET() {
    return await getApprovedBookingsByEmail();
}