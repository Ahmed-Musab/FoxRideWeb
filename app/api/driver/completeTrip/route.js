import { completeTrip } from "@/lib/controllers/driver";

export async function POST(req) {
    return await completeTrip(req);
}