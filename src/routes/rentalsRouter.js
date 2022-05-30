import { Router } from 'express';

import { postRentals } from '../controllers/rentalsController.js';
//import { validateCustomers } from '../middlewares/customersMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.post('/rentals', postRentals);

export default rentalsRouter;