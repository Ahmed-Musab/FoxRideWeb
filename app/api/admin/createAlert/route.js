import { createAlert } from "@/lib/controllers/admin";

export async function POST(req) {
    return await createAlert(req);
}