import { updateBooking } from "@/lib/controllers/transportAdmin";

export async function PUT(req) {
    return await updateBooking(req);
}
