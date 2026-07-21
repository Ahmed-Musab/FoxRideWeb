import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  // Check database if needed

  const gatePassUrl = `${req.nextUrl.origin}/gatepasses/gatepass-${id}.pdf`;

  return NextResponse.json({
    success: true,
    gatePassUrl,
  });
}