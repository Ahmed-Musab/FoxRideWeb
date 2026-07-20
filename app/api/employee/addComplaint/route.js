import { addComplaint } from "@/lib/controllers/employee";

export async function POST(req) {
    return await addComplaint(req);
}
