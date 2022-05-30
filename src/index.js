import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './db.js';
import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(categoriesRouter);
app.use(gamesRouter);

app.listen(process.env.PORT || 4000, () => console.log('Server started'));
