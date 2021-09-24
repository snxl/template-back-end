import express from 'express';
import path, { resolve } from 'path';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'
import fs from 'fs';
import SwaggerUI from 'swagger-ui-express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class EntryPoint {
  constructor() {
    this.app = express();
    this.checkSecure();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(
      '/files',
      express.static(resolve(__dirname, 'public', 'uploads')),
    );
  }

  routes() {
    this.app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'))));
  }

  checkSecure() {
    this.app.use((req, res, next) => {
      if (!req.secure) {
        res.redirect(`https://localhost:${process.env.PORT_TLS || 3100}${req.url}`);
      }

      next();
    });
  }
}
