import { deleteAlert } from "@/lib/controllers/admin";

export async function DELETE(req) {
    return await deleteAlert(req);
}