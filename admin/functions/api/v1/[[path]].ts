const backend = 'https://canvas-india-backend.kasettynani.workers.dev';

export async function onRequest({ request }: { request: Request }) {
  const { pathname, search } = new URL(request.url);
  const target = new URL(backend);
  target.pathname = pathname;
  target.search = search;

  const headers = new Headers();
  for (const name of ['authorization', 'content-type', 'accept']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
      signal: AbortSignal.timeout(25000),
    });
    const response = new Response(upstream.body, upstream);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  } catch {
    return Response.json(
      { message: 'The server did not confirm the request. Please try again shortly.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
}
