import { updateWorkOrder } from "@/lib/controllers/transportAdmin";

export async function PUT(req) {
    return await updateWorkOrder(req);
}
