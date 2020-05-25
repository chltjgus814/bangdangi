const express = require('express');
const next = require('next');
var compression = require('compression');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const port = process.env.PORT ? process.env.PORT : 3000;

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(compression());

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, err => {
      if (err) throw err;
      console.log(
        `> Ready on http://localhost:${port} NODE_ENV: ${process.env.NODE_ENV}`
      );
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
  