import { addUser } from "@/lib/controllers/admin";

export async function POST(req) {
    return await addUser(req);
}