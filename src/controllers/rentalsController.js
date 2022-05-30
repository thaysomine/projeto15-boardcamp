import db from '../db.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    const { customerId } = req.query;
    const { gameId } = req.query;

    try {
        let result;
        if (!customerId && !gameId) {
            result = await db.query(`
                SELECT rentals.*, games.name, games.image, games."categoryId", customers.name as "customerName", categories.name as "categoryName"
                FROM rentals 
                JOIN customers 
                    ON rentals."customerId"  = customers.id 
                JOIN games 
                    ON rentals."gameId" = games.id
                JOIN categories
                ON categories.id = games."categoryId";
                `);    
        } else if (customerId && !gameId) {
            result = await db.query(`
                SELECT rentals.*, games.name, games.image, games."categoryId", customers.name as "customerName", categories.name as "categoryName"
                FROM rentals 
                JOIN customers 
                    ON rentals."customerId"  = customers.id 
                JOIN games 
                    ON rentals."gameId" = games.id
                JOIN categories
                    ON categories.id = games."categoryId"
                WHERE rentals."customerId" = $1;
                `, [customerId]);  
        } else if (!customerId && gameId) {
            result = await db.query(`
                SELECT rentals.*, games.name, games.image, games."categoryId", customers.name as "customerName", categories.name as "categoryName"
                FROM rentals 
                JOIN customers 
                    ON rentals."customerId"  = customers.id 
                JOIN games 
                    ON rentals."gameId" = games.id
                JOIN categories
                    ON categories.id = games."categoryId"
                WHERE rentals."gameId" = $1;
            `, [gameId]);
        }
    
        const rentals = result.rows.map((rental) => {
            return {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental.customerId,
                    name: rental.customerName,
                },
                game: {
                    id: rental.gameId,
                    name: rental.name,
                    categoryId: rental.gameId,
                    categoryName: rental.categoryName,
                }
            };
        });
    
        return res.send(rentals);
        } catch (e) {
            return res.sendStatus(500);
        }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const dateNow = dayjs().format("YYYY-MM-DD");

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
        res.sendStatus(500);
    }
}

export async function finishRentals(req, res) {
    const { id } = req.params;
    const dateNow = dayjs().format("YYYY-MM-DD");

        const gameId = await db.query(`
            SELECT "gameId" FROM rentals
            WHERE id = $1
        `, [id]);
        const checkGame = await db.query(`
            SELECT * FROM games
            WHERE id = $1
        `, [gameId.rows[0].gameId]);

    console.log(checkGame.rows, gameId.rows);
    try {
        await db.query(`
            UPDATE rentals SET
                "returnDate" = $1,
                "delayFee" = GREATEST(
                    (($1 - (SELECT "rentDate" FROM rentals WHERE id = $2)) * games."pricePerDay") - rentals."originalPrice", 0)
                FROM games WHERE rentals.id = $2 AND rentals."gameId" = games.id
        `, [dateNow, id]);
        await db.query('UPDATE games SET "stockTotal" = $1 WHERE id = $2', [(checkGame.rows[0].stockTotal+1), gameId.rows[0].gameId]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
}

export async function deleteRentals(req, res) {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM rentals WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}