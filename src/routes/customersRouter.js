import { Router } from 'express';

import { getCustomers, getCustomer, postCustomers, updateCustomers } from '../controllers/customersController.js';
import { validateCustomers } from '../middlewares/customersMiddleware.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', validateCustomers, postCustomers);
customersRouter.put('/customers/:id', validateCustomers, updateCustomers);

export default customersRouter;