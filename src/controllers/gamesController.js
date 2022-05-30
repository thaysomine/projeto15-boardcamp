import joi from 'joi';

import db from '../db.js';

export async function getGames(req, res) {
    const { name } = req.query;

    try {
        const result = !name 
        ? await db.query(`
        SELECT games.*, categories.name as "categoryName" 
        FROM games 
        JOIN categories 
        ON games."categoryId"=categories.id;
        `) : await db.query(`
        SELECT games.*, categories.name as "categoryName" 
        FROM games 
        JOIN categories 
        ON games."categoryId"=categories.id
        WHERE LOWER(games.name) LIKE '${name.toLowerCase()}%';
        `)
        const gamesList = result.rows;
        res.send(gamesList);
    } catch (error) {
        res.status(500).send('Erro ao buscar jogos');
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    
    try {
        await db.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send('Erro ao adicionar jogo');
    }
}