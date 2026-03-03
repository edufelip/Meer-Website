import { NextRequest, NextResponse } from "next/server";
import { androidStoreUrl, iosStoreUrl } from "../../../src/urls";

export function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const isAppleDevice = /(iphone|ipad|ipod|macintosh)/.test(userAgent);
  const redirectUrl = isAppleDevice ? iosStoreUrl : androidStoreUrl;

  return NextResponse.redirect(redirectUrl, { status: 302 });
}
