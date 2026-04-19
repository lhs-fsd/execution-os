const https = require('https');

const hookUrl = 'https://api.vercel.com/v1/integrations/deploy/prj_xEHreuvWyBlQGUCW9bI0hwKjT5Wa/uVF3hUeRwN';

const req = https.request(hookUrl, {
  method: 'POST'
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.end();