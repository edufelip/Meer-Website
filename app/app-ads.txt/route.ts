import { NextResponse } from "next/server";

const APP_ADS_TXT = "google.com, pub-6916049927005583, DIRECT, f08c47fec0942fa0";

export function GET() {
  return new NextResponse(APP_ADS_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300"
    }
  });
}
