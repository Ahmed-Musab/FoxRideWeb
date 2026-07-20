import { getWorkOrders } from "@/lib/controllers/employee";

export async function GET(req) {
    return await getWorkOrders(req);
}
