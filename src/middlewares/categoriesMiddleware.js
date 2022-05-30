import joi from 'joi';

import db from '../db.js';

export async function validateCategories(req, res, next) {
    const {name} = req.body;

    const schema = joi.object({
        name: joi.string().required()
    });
    const validation = schema.validate({name});
    if(validation.error){
        res.status(400).send('Erro ao adicionar categoria');
        return;
    }

    const checkName = await db.query('SELECT * FROM categories WHERE name = $1', [name]);
    if(checkName.rows.length > 0){
        res.status(409).send('Category already exists');
        return;
    }
    next();
}