import joi from 'joi';

import db from '../db.js';

export async function getGames(req, res) {
    const { name } = req.query;
    console.log(name, 'name');

    try {
        const result = await db.query(`
        SELECT games.*, categories.name as "categoryName" 
        FROM games 
        JOIN categories 
        ON games."categoryId"=categories.id
        `);
        const gamesList = result.rows;
        console.log(gamesList, 'games');
        res.send(gamesList);
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar jogos');
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    
    try {
        await db.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch (error) {
        console.log('Erro ao adicionar jogo', error);
        res.status(500).send('Erro ao adicionar jogo');
    }
}