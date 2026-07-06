import express from 'express';
import { createServer } from 'http';
import { config } from './config';
import { app } from './app';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = createServer(app);

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
