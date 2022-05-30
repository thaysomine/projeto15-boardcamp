import joi from 'joi';
import db from '../db.js';

export async function validateCustomers(req, res, next) {
    const { name, phone, cpf, birthday } = req.body;
    const schema = joi.object({
        name: joi.string().required(),
        phone: joi.string().required().min(10).max(11),
        cpf: joi.string().required().length(11),
        birthday: joi.date().required()
    });
    const validation = schema.validate({name, phone, cpf, birthday});
    if (validation.error) {
        res.sendStatus(400);
        return;
    }
    const checkCpf = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
    if (checkCpf.rows.length > 0) {
        res.sendStatus(409);
    }
    next();
}
