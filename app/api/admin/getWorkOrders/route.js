import { getWorkOrders } from "@/lib/controllers/admin";

export async function GET(req) {
    return await getWorkOrders(req);
}
