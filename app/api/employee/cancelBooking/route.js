import { cancelBooking } from "@/lib/controllers/employee";

export async function DELETE(req) {
    return await cancelBooking(req);
}