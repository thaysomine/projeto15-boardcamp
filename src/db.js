import pg from 'pg';

const {Pool} = pg;
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

console.log('Conectado ao postgres');

export default db;