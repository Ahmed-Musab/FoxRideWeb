import { deleteUser } from "@/lib/controllers/auth";

export async function DELETE(req) {
    return await deleteUser(req);
}