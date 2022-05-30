import { Router } from 'express';

import { postRentals, finishRentals } from '../controllers/rentalsController.js';
import { validateRentals, validateRentalsUpdate } from '../middlewares/rentalsMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.post('/rentals', validateRentals, postRentals);
rentalsRouter.post('/rentals/:id/return', validateRentalsUpdate, finishRentals);

export default rentalsRouter;