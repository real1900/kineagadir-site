/**
 * kineagadir.com edge worker.
 *
 * Sole job beyond static-asset serving: 301-redirect the bare apex
 * (kineagadir.com) to the canonical www host. Every other request is
 * handed straight to the static-assets binding, which also applies
 * the _headers caching/security rules.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "kineagadir.com") {
      url.hostname = "www.kineagadir.com";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
