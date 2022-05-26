import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.listen(process.env.PORT || 4000, () => console.log('Server started'));
