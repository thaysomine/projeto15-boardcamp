import db from '../db.js';
import joi from 'joi';

export async function getCustomers(req, res) {
    const { cpf } = req.query;

    try {
        const result = !cpf
        ? await db.query('SELECT * FROM customers')
        : await db.query('SELECT * FROM customers WHERE customers.cpf LIKE $1', [`${cpf}%`]);
        const customersList = result.rows;
        console.log(customersList, 'customers');
        res.send(customersList);
    } catch (error) {
        console.log('Erro ao buscar clientes', error);
        res.sendStatus(500);
    }
}

export async function getCustomer(req, res) {
    const { id } = req.params;
    console.log(id,'id');

    try {
        const result = await db.query('SELECT * FROM customers WHERE id = $1',[id]);
        if (result.rows.length === 0) {
            console.log('Cliente não encontrado');
            res.sendStatus(404);
            return;
        }
        const customer = result.rows[0];
        res.send(customer);
    } catch (error) {
        console.log('Erro ao buscar cliente', error);
        res.sendStatus(500);
    }
}

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await db.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (error) {
        console.log('Erro ao adicionar cliente', error);
        res.sendStatus(500);
    }
}

export async function updateCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        await db.query(`
            UPDATE customers SET 
                name = $1,
                phone = $2,
                cpf = $3,
                birthday = $4
            WHERE id = $5
        `, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch (error) {
        console.log('Erro ao atualizar cliente', error);
        res.sendStatus(500);
    }
}