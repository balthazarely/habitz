import { NextRequest, NextResponse } from "next/server";

// Route protection is handled client-side in app/(app)/layout.tsx.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: [] };
