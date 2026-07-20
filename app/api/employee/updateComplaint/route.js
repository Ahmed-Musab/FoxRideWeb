import { updateComplaint } from "@/lib/controllers/employee";

export async function PUT(req) {
    return await updateComplaint(req);
}