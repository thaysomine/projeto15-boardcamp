import joi from 'joi';

import db from '../db.js';

export async function validateCategories(req, res, next) {
    const {name} = req.body;
    console.log(name, 'nome');

    const schema = joi.object({
        name: joi.string().required()
    });
    const validation = schema.validate({name});
    if(validation.error){
        console.log('Erro ao adicionar categoria', validation.error);
        res.status(400).send('Erro ao adicionar categoria');
        return;
    }

    const checkName = await db.query('SELECT * FROM categories WHERE name = $1', [name]);
    console.log(checkName, 'checkName');
    if(checkName.rows.length > 0){
        console.log('Categoria já existe');
        res.status(409).send('Category already exists');
        return;
    }
    next();
}