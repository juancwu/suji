import postgres from 'postgres';

const sql = postgres(process.env.DB_URL as string);

export default sql;
