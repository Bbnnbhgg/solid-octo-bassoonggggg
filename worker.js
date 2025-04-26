
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'GET') {
    // Serve the HTML page when the user accesses the worker URL (GET request)
    return new Response(htmlPage(), {
      headers: { 'Content-Type': 'text/html' }
    })
  } else if (request.method === 'POST') {
    // Handle POST request for encoding Lua script
    try {
      const { script } = await request.json()

      // Encode the Lua script: converting each character into ASCII byte values
      const encoded = script.split('')
        .map(char => '\\' + char.charCodeAt(0))
        .join('')

      // Wrap the encoded string in loadstring() and return it as a response
      const wrappedScript = `loadstring("${encoded}")()`

      return new Response(wrappedScript, {
        headers: { 'Content-Type': 'text/plain' }
      })
    } catch (error) {
      return new Response('Invalid JSON or missing "script" field', { status: 400 })
    }
  } else {
    return new Response('Method Not Allowed', { status: 405 })
  }
}

// HTML page content
function htmlPage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lua Script Encoder</title>
    </head>
    <body>
        <h1>Encode Lua Script</h1>
        <textarea id="luaScript" rows="4" cols="50">
print("Put script your here")
        </textarea>
        <br><br>
        <button onclick="encodeLuaScript()">Encode Lua Script</button>
        <br><br>
        <h3>Encoded Lua Script:</h3>
        <textarea id="encodedScript" rows="10" cols="50" readonly></textarea>
    
        <script>
            // Function to encode the Lua script by making a POST request to the Cloudflare Worker
            function encodeLuaScript() {
                // Get the Lua script from the textarea
                const luaScript = document.getElementById('luaScript').value;

                // Construct the request body
                const requestBody = JSON.stringify({ script: luaScript });

                // Send a POST request to the Cloudflare Worker
                fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: requestBody
                })
                .then(response => response.text())
                .then(data => {
                    // Display the encoded Lua script in the output textarea
                    document.getElementById('encodedScript').value = data;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        </script>
    
    </body>
    </html>
  `
}
