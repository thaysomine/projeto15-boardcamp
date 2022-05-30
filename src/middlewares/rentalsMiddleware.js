import joi from 'joi';
import db from '../db.js';

export async function validateRentals(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const checkCustomer = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    const checkGame = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const checkAvaliable = await db.query('SELECT * FROM games WHERE id = $1 AND "stockTotal" = $2', [gameId, 0]);

    if(daysRented <= 0 || checkCustomer.rows.length === 0 || checkGame.rows.length === 0 || checkAvaliable.rows.length > 0) {
        res.sendStatus(400);
        return;
    }
    await db.query('UPDATE games SET "stockTotal" = $1 WHERE id = $2', [(checkGame.rows[0].stockTotal-1), gameId]);
    next();
}

export async function validateRentalsUpdate(req, res, next) {
    const { id } = req.params;

    const checkId = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (checkId.rows.length === 0) {
        res.sendStatus(404);
        return;
    }
    const checkFinish = await db.query('SELECT * FROM rentals WHERE id = $1 AND "returnDate" IS NOT NULL', [id]);
    if (checkFinish.rows.length > 0) {
        res.sendStatus(400);
        return;
    }

    next();
}