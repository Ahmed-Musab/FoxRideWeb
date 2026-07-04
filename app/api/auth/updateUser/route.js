import { updateUser } from "@/lib/controllers/auth";

export async function PUT(req) {
    return await updateUser(req);
}