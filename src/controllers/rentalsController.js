import db from '../db.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getRentals(req, res) {

}

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

export async function finishRentals(req, res) {
    const { id } = req.params;
    const dateNow = dayjs().format("YYYY-MM-DD");
    console.log(dateNow);
    
    try {
        await db.query(`
            UPDATE rentals SET
                "returnDate" = $1,
                "delayFee" = GREATEST(
                    (($1 - (SELECT "rentDate" FROM rentals WHERE id = $2)) * games."pricePerDay") - rentals."originalPrice", 0)
                FROM games WHERE rentals.id = $2 AND rentals."gameId" = games.id
        `, [dateNow, id]);
        res.sendStatus(200);
    } catch (error) {
        console.log('Erro ao finalizar aluguer', error);
        res.sendStatus(500);
    }
}

export async function deleteRentals(req, res) {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM rentals WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.log('Erro ao deletar aluguel', error);
        res.sendStatus(500);
    }
}