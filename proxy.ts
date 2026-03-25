// Route protection is handled client-side in app/(app)/layout.tsx.
// This file is intentionally left with an empty matcher so Next.js never
// invokes it — keeping it here avoids a build warning about the missing file.
export const config = { matcher: [] };
