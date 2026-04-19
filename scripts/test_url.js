const h = require('https');
const url = process.argv[2] || 'https://execution-e320l6x1v-baighamdfayyaz-3862s-projects.vercel.app';
h.get(url, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => console.log('URL:', url, 'Status:', r.statusCode));
}).on('error', e => console.log('Error:', e.message));