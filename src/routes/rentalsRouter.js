import { Router } from 'express';

import { postRentals } from '../controllers/rentalsController.js';
import { validateRentals } from '../middlewares/rentalsMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.post('/rentals', validateRentals, postRentals);

export default rentalsRouter;