const http = require('http');

const host = "109.248.128.176";
const port = "1050";
const username = "zEEjwp";
const password = "TmppRCSIF1";

const options = {
  hostname: host,
  port: Number(port),
  path: 'http://msk-sait.ru',
  method: 'GET',
  headers: {
    'Proxy-Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  }
};

const req = http.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', (error) => {
  console.log(error);
});

req.end();