import { getVehicles } from "@/lib/controllers/admin";

export async function GET() {
    return await getVehicles();
}