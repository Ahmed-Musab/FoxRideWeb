import { getAlerts } from "@/lib/controllers/admin";

export async function GET() {
    return await getAlerts();
}