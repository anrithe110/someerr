import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let headers = { "accept-language": "en,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
let locales = ["en", "ge"];
let defaultLocale = "ge";

const selectedLocale = match(languages, locales, defaultLocale);

function getLocale(request) {
  const acceptLanguageHeader = request.headers.get("Accept-Language");
  const detectedLanguages = new Negotiator({
    headers: { "accept-language": acceptLanguageHeader },
  }).languages();
  const userLocale = detectedLanguages.find((lang) =>
    locales.includes(lang.toLowerCase())
  );
  return userLocale || defaultLocale;
}

export function middleware(request, response) {
  const { pathname } = request.nextUrl;


  if (pathname.startsWith("/images")) {
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale.toLowerCase()}/`) ||
      pathname === `/${locale.toLowerCase()}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
  }

  if (!pathnameHasLocale) {
    const locale = defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return Response.redirect(request.nextUrl);
  }
}

export const config = {
  matcher: ["/((?!_next).*)"],
};