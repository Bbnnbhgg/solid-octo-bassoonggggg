
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')

  if (!targetUrl) {
    return new Response('URL parameter is required', { status: 400 })
  }

  // Set up the CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',  // Default content type for JSON
  }

  // Handle pre-flight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  try {
    // Fetch data from the target URL
    const response = await fetch(targetUrl)
    const responseBody = await response.text()

    // Clone the response and set the CORS headers
    return new Response(responseBody, {
      headers: {
        ...headers,
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      }
    })
  } catch (error) {
    return new Response('Failed to fetch the target URL', { status: 500 })
  }
}
