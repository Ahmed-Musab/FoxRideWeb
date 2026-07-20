import { getComplaintsByEmail } from "@/lib/controllers/employee";

export async function GET(req) {
    return await getComplaintsByEmail();
}
