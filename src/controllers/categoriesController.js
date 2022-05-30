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
    const {name} = req.body;
    console.log(name, 'nome');

    try {
        await db.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar categoria');
    }
}