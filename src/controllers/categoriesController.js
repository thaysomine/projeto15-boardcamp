import joi from 'joi';

import db from '../db.js';

export async function getCategories(req, res){
    try {
        const response = await db.query('SELECT * FROM categories');
        const categories = response.rows;
        console.log(response, 'resposta do banco', categories, 'categorias');
        res.send(categories);
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar categorias');
    }
}

export async function postCategories(req, res){
    const { name } = req.body;

    // validação
    const schema = joi.object({
        name: joi.string().required()
    })
    const validation = schema.validate(name);
    if(validation.error){
        console.log('Erro ao adicionar categoria', validation.error);
        res.status(400).send('Erro ao adicionar categoria');
    }

    const checkName = await db.query('SELECT * FROM categories WHERE name = $1', [name]);
    if(checkName.rows.length === 0){
        console.log('Categoria já existe');
        res.status(409).send('Category already exists');
    }

    try {
        await db.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar categoria');
    }
}