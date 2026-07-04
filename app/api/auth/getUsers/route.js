import { getUsers } from "@/lib/controllers/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await getUsers();
        if (result && result.status === 500) {
            return NextResponse.json({ message: result.message }, { status: 500 });
        }
        return NextResponse.json({ users: result });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
    }
}