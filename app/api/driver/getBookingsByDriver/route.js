import { getBookingsByDriver } from "@/lib/controllers/driver";

export async function GET(req) {
    return await getBookingsByDriver(req);
}
