import { startTrip } from "@/lib/controllers/driver";

export async function POST(req) {
    return await startTrip(req);
}