import { register } from "@/lib/controllers/auth";

export async function POST(req) {
    return await register(req);
}