import { getEmployees } from "@/lib/controllers/employee";

export async function GET() {
    return await getEmployees();
}