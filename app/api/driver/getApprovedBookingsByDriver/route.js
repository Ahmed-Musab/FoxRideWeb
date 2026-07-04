import { getApprovedBookingsByDriver } from "@/lib/controllers/driver";

export async function GET(req) {
    return await getApprovedBookingsByDriver(req);
}
