import { getBookingByEmail } from "@/lib/controllers/employee";

export async function GET(req) {
    return await getBookingByEmail(req);
}