import 'reflect-metadata';

import dotenv from 'dotenv';
import express, { Application } from 'express';
dotenv.config();

import { DBURL, LOG_COLOR_FG_BLUE, PORT } from './config/consts';
import connect from './config/database';
import { errorHandler } from './helpers/error-helper';
import { passportHandler } from './helpers/passport';

const app: Application = express();
const port = PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(passportHandler.initialize());
app.use('/', errorHandler);

app.listen(port, () => {
  console.log(LOG_COLOR_FG_BLUE, `[Server]: Server is running at port ${port}`);
});

connect({ url: DBURL });
