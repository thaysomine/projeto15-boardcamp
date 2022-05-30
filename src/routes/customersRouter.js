import { Router } from 'express';

import { getCustomers, getCustomer, postCustomers } from '../controllers/customersController.js';
import { validateCustomers } from '../middlewares/customersMiddleware.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', validateCustomers, postCustomers);

export default customersRouter;