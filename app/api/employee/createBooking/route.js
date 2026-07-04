import { createBooking } from "@/lib/controllers/employee";

export async function POST(req) {
    return await createBooking(req);
}