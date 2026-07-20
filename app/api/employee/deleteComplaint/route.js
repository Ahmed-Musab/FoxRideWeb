import { deleteComplaint } from "@/lib/controllers/employee";

export async function DELETE(req) {
    return await deleteComplaint(req);
}