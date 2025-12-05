const BLOG_ID = '1865195035349515836';
const API_KEY = 'AIzaSyAApvL_sMcBqTanljIjSYWmVX-KHFGgEoI';
const API_BASE = 'https://www.googleapis.com/blogger/v3';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle API routes for blog
    if (url.pathname.startsWith('/api/blog')) {
      return handleBlogAPI(request, url);
    }

    // Default: serve static assets
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response("Not found", { status: 404 });
    }
  }
};

async function handleBlogAPI(request, url) {
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  let response = await cache.match(cacheKey);

  if (!response) {
    let apiUrl = '';
    let data = {};

    if (url.pathname === '/api/blog/posts') {
      apiUrl = `${API_BASE}/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=10`;
    } else if (url.pathname === '/api/blog/search') {
      const query = url.searchParams.get('q');
      if (query) {
        apiUrl = `${API_BASE}/blogs/${BLOG_ID}/posts/search?q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=10`;
      }
    } else if (url.pathname.startsWith('/api/blog/post/')) {
      const postId = url.pathname.split('/').pop();
      apiUrl = `${API_BASE}/blogs/${BLOG_ID}/posts/${postId}?key=${API_KEY}`;
    }

    if (apiUrl) {
      try {
        const apiResponse = await fetch(apiUrl);
        data = await apiResponse.json();
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch from Blogger API' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

    // Cache the response
    await cache.put(cacheKey, response.clone());
  }

  return response;
}
