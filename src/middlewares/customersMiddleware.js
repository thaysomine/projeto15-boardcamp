import joi from 'joi';
import db from '../db.js';

export async function validateCustomers(req, res, next) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    const schema = joi.object({
        name: joi.string().required(),
        phone: joi.string().required().min(10).max(11),
        cpf: joi.string().required().length(11),
        birthday: joi.date().required()
    });
    const validation = schema.validate({name, phone, cpf, birthday});
    const checkId = await db.query('SELECT * FROM customers WHERE id = $1', [id])
    if (validation.error || checkId.rows.length > 0) {
        console.log(validation.error);
        console.log(checkId.rows.length);
        res.sendStatus(400);
        return;
    }
    const checkCpf = await db.query('SELECT * FROM customers WHERE cpf = $1 AND NOT id = $2', [cpf, id]);
    if (checkCpf.rows.length > 0) {
        res.sendStatus(409);
        return;
    }

    next();
}
