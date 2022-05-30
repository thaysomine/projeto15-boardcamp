import db from '../db.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const dateNow = dayjs().format("YYYY-MM-DD");
    console.log(dateNow);

    try {
        await db.query(`
            INSERT INTO rentals (
                "customerId", 
                "gameId", 
                "rentDate", 
                "daysRented", 
                "returnDate", 
                "originalPrice", 
                "delayFee"
            )
            VALUES (
                $1, 
                $2, 
                $3, 
                $4,
                $5, 
                $4 * (SELECT "pricePerDay" FROM games WHERE id = $2),
                $6
            )
        `, [customerId, gameId, dateNow, daysRented, null, null]);
        res.sendStatus(201);
    } catch (error) {
        console.log('Erro ao adicionar locação', error);
        res.sendStatus(500);
    }
}