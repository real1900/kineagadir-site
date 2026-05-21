/**
 * kineagadir.com edge worker.
 *
 *   1. 301-redirect the bare apex (kineagadir.com) → canonical www host.
 *   2. 301-redirect legacy URLs (the discontinued chiropractic service
 *      page) → their replacement.
 *
 * Everything else is handed to the static-assets binding, which also
 * applies the _headers caching/security rules.
 */

// Legacy path → replacement path. Host is always forced to www.
const LEGACY_REDIRECTS = {
  "/services/chiropractic-therpay/": "/services/laser-therapie/",
  "/ar/services/chiropractic-therpay/": "/ar/services/laser-therapie/",
  "/en/services/chiropractic-therpay/": "/en/services/laser-therapie/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Apex → www
    if (url.hostname === "kineagadir.com") {
      url.hostname = "www.kineagadir.com";
      return Response.redirect(url.toString(), 301);
    }

    // 2. Legacy URL redirects — normalize a missing trailing slash first.
    const path = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
    const dest = LEGACY_REDIRECTS[path];
    if (dest) {
      return Response.redirect("https://www.kineagadir.com" + dest, 301);
    }

    // 3. Everything else: static assets.
    return env.ASSETS.fetch(request);
  },
};
