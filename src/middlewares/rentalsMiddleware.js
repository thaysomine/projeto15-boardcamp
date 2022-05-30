import joi from 'joi';
import db from '../db.js';

export async function validateRentals(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const checkCustomer = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    const checkGame = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
    //const checkAvaliable = await db.query('SELECT * FROM ')
    const schema = joi.object({
        customerId: joi.required(),
        gameId: joi.required(),
        daysRented: joi.required().min(1)
    });
    const validation = schema.validate({customerId, gameId, daysRented});

    if(validation.error || checkCustomer.rows.length === 0 || checkGame.rows.length === 0) {
        console.log('Erro ao adicionar locação', validation.error);
        res.sendStauts(400);
        return;
    }
}