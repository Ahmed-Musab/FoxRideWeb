import { getDrivers } from "@/lib/controllers/driver";

export async function GET() {
    return await getDrivers();
}
