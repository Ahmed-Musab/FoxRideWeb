import { completeBooking } from "@/lib/controllers/driver";

export async function PUT(req) {
    return await completeBooking(req);
}
