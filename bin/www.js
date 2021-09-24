import http from 'http';
import EntryPoint from '../app.js';

const entry = new EntryPoint();

const port = process.env.PORT || '8000';
entry.app.set('port', port);

const server = http.createServer(entry.app);

server.listen(port, () => process.stdout.write(`SERVER HTTP RUNNING IN PORT: ${port}\n\nhttp://localhost:${port}`));