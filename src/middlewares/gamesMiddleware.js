import joi from 'joi';
import db from '../db.js';

export async function validateGames(req, res, next) {
    const { name, stockTotal, categoryId, pricePerDay } = req.body;
    const schema = joi.object({
        name: joi.string().required(),
        stockTotal: joi.number().greater(0).required(),
        pricePerDay: joi.number().greater(0).required()
    });
    const validation = schema.validate({ name, stockTotal, pricePerDay});
    const checkCategory = await db.query('SELECT * FROM categories WHERE id = $1', [categoryId]);

    if (validation.error || checkCategory.rows.length === 0) {
        console.log('Erro ao cadastrar jogo');
        res.sendStatus(400);
        return;
    }

    const checkName = await db.query('SELECT * FROM games WHERE name = $1', [name]);
    console.log(checkName, 'checkName');
    if(checkName.rows.length > 0){
        console.log('Jogo já existe');
        res.status(409).send('Game already exists');
        return;
    }

    next();
}