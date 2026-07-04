import { rejectBooking } from "@/lib/controllers/manager";

export async function POST(req) {
    return await rejectBooking(req);
}