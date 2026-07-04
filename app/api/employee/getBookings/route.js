import { getBookings } from "@/lib/controllers/admin";

export async function GET() {
    return await getBookings();
}