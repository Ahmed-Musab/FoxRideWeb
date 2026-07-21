import { getAllApprovedBookings } from "@/lib/controllers/transportAdmin";

export async function GET() {
    return await getAllApprovedBookings();
}