import { getAllCompletedBookings } from "@/lib/controllers/transportAdmin";

export async function GET() {
    return await getAllCompletedBookings();
}