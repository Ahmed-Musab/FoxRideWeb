import { login } from "@/lib/controllers/auth";

export async function POST(req) {
    return await login(req);
}