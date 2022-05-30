import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './db.js';
import categoriesRouter from './routes/categoriesRouter.js';

console.log(db);

dotenv.config();
const app = express();

app.use(categoriesRouter);

app.listen(process.env.PORT || 4000, () => console.log('Server started'));
