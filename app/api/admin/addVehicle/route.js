import { addVehicle } from "@/lib/controllers/admin";

export async function POST(req) {
    return await addVehicle(req);
}