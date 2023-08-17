import { NextRequest, NextResponse } from "next/server";
import { FHIR_SERVERS } from "@/lib/fhir";

export async function GET(request: NextRequest) {
  return NextResponse.json({ settings: { fhirServers: FHIR_SERVERS } });
}
