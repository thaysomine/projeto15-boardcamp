import joi from 'joi';
import db from '../db.js';

export async function validateRentals(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const checkCustomer = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    const checkGame = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const checkAvaliable = await db.query('SELECT * FROM games WHERE id = $1 AND "stockTotal" = $2', [gameId, 0]);

    const schema = joi.object({
        customerId: joi.required(),
        gameId: joi.required(),
        daysRented: joi.required()
    });
    const validation = schema.validate({customerId, gameId, daysRented});

    if(validation.error || checkCustomer.rows.length === 0 || checkGame.rows.length === 0 || checkAvaliable.rows.length > 0) {
        console.log('Erro ao adicionar locação', validation.error);
        res.sendStauts(400);
        return;
    }
    console.log(checkGame);
    await db.query('UPDATE games SET "stockTotal" = $1 WHERE id = $2', [(checkGame.rows[0].stockTotal-1), gameId]);
    console.log(checkGame);
    next();
}