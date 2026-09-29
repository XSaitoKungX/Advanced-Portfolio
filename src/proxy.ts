import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // The app registers no Server Actions; requests carrying this header are
  // bogus probes and would otherwise throw "Failed to find Server Action".
  if (request.headers.has("next-action")) {
    return new NextResponse(null, { status: 404 });
  }
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)).*)",
  ],
};
