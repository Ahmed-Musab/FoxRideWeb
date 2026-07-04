import { deleteVehicle } from "@/lib/controllers/admin";

export async function DELETE(req) {
    return await deleteVehicle(req);
}
