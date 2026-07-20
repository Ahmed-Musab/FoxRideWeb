import { getComplaints } from "@/lib/controllers/admin";

export async function GET() {
    return await getComplaints();
}