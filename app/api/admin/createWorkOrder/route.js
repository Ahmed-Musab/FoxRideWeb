import { createWorkOrder } from "@/lib/controllers/admin";

export async function POST(req) {
    return await createWorkOrder(req);
}
