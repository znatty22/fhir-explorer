import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FHIR_SERVERS } from "@/lib/fhir";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // User must be logged in to use this API route
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", details: "Access Denied", status: 401 },
      { status: 401 }
    );
  }
  return NextResponse.json({ settings: { fhirServers: FHIR_SERVERS } });
}
