import { approveBooking } from "@/lib/controllers/manager";

export async function POST(req) {
    return await approveBooking(req);
}