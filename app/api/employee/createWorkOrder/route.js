import { createWorkOrder } from "@/lib/controllers/employee";

export async function POST(req) {
    return await createWorkOrder(req);
}
