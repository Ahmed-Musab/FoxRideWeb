import { uploadPhoto } from "@/lib/controllers/admin";

export async function POST(req) {
    return await uploadPhoto(req);
}