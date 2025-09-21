const express = require('express');
const Unblocker = require('unblocker');
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or restrict to your Neocities domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(Unblocker({
  prefix: '/proxy/',
  requestMiddleware: [
    function(req, res, next) {
      console.log('Incoming cookies:', req.headers.cookie);
      next();
    }
  ],
  responseMiddleware: [
    function(req, res, next) {
      const setCookie = res.getHeader('Set-Cookie');
      if (setCookie) {
        console.log('Set-Cookie from target:', setCookie);
      }
      next();
    }
  ]
}));

app.get('/', (req, res) => {
  res.send(`
    <h1>Proxy Unblocker</h1>
    <form method="GET" action="/proxy/">
      <input name="url" placeholder="https://example.com" style="width:300px;">
      <button type="submit">Go</button>
    </form>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
