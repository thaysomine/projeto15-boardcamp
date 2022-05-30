import { Router } from 'express';

import { getRentals, postRentals, finishRentals, deleteRentals } from '../controllers/rentalsController.js';
import { validateRentals, validateRentalsUpdate } from '../middlewares/rentalsMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validateRentals, postRentals);
rentalsRouter.post('/rentals/:id/return', validateRentalsUpdate, finishRentals);
rentalsRouter.delete('/rentals/:id', validateRentalsUpdate, deleteRentals);

export default rentalsRouter;