import { completeComplaint } from "@/lib/controllers/admin";

export async function PUT(req) {
    return await completeComplaint(req);
}