import { assignVehicle } from "@/lib/controllers/transportAdmin";

export async function POST(req) {
    return await assignVehicle(req);
}
