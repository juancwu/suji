import dotenv from 'dotenv';
import postgres from 'postgres';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const MIGRATIONS_DIR = './migrations';
const MIGRATIONS_TABLE = 'suji_migrations';

const sql = postgres(process.env.DB_URL, { max: 1 });

async function getExecutedMigrations() {
    const migrations = await sql`SELECT name FROM ${sql(MIGRATIONS_TABLE)}`;
    return migrations.map((m) => m.name);
}

async function runMigration(filepath) {
    const file = await fs.readFile(filepath, 'utf8');
    await sql.unsafe(file);
}

async function undoMigration(name) {
    await sql`DELETE FROM ${sql(MIGRATIONS_TABLE)} WHERE name = ${name}`;
}

async function recordMigration(name) {
    await sql`INSERT INTO ${sql(MIGRATIONS_TABLE)} (name) VALUES (${name})`;
}

function extractSqlName(name) {
    return name.replace('.up.sql', '').replace('.down.sql', '');
}

async function migrate(direction = 'up') {
    try {
        await sql`CREATE TABLE IF NOT EXISTS ${sql(MIGRATIONS_TABLE)} (id SERIAL PRIMARY KEY, name TEXT NOT NULL, executed_at TIMESTAMPTZ DEFAULT NOW())`.catch();
        const executedMigrations = await getExecutedMigrations();
        const files = (await fs.readdir(MIGRATIONS_DIR)).filter((file) =>
            file.endsWith(`.${direction}.sql`)
        );
        files.sort();
        if (direction === 'down') {
            files.reverse();
        }
        for (const file of files) {
            const sqlName = extractSqlName(file);
            if (direction === 'up' && !executedMigrations.includes(sqlName)) {
                await runMigration(path.join(MIGRATIONS_DIR, file));
                await recordMigration(sqlName);
                console.log(`Executed migration: ${file}`);
            } else if (
                direction === 'down' &&
                executedMigrations.includes(sqlName)
            ) {
                await runMigration(path.join(MIGRATIONS_DIR, file));
                await undoMigration(sqlName);
                console.log(`Rolled back migration: ${file}`);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        await sql.end();
    }
}

const direction = process.argv[2] || 'up';
migrate(direction);
