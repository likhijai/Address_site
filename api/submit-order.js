const http = require('http');

function generateOrderId() {
  return 'order_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
function respondError(res, message) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: message }));
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/submit-order') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { name, phone, address, items } = data;
        if (typeof name !== 'string' || !name.trim()) {
          return respondError(res, 'Missing or invalid name');
        }
        if (typeof phone !== 'string' && typeof phone !== 'number') {
          return respondError(res, 'Missing or invalid phone');
        }
        if (typeof address !== 'string' || !address.trim()) {
          return respondError(res, 'Missing or invalid address');
        }
        if (!Array.isArray(items) || items.some(it => typeof it.item !== 'string' || typeof it.qty !== 'number')) {
          return respondError(res, 'Missing or invalid items');
        }
        console.log('Received order:', data);
        const orderId = generateOrderId();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', orderId }));
      } catch (err) {
        respondError(res, 'Invalid JSON');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = server;
