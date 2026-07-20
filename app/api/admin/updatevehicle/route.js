import { updateVehicle } from "@/lib/controllers/admin";

export async function PUT(req) {
    return await updateVehicle(req);
}