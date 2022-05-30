import { Router } from 'express';

import { getGames, postGames } from '../controllers/gamesController.js';
//import { validateCategories } from '../middlewares/categoriesMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', postGames);

export default gamesRouter;