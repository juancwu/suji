import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MIGRATIONS_DIR = './migrations';

const files = fs.readdirSync(MIGRATIONS_DIR);
const n = parseInt(files.length / 2) + 1;
const filename = `${n.toString().padStart(4, '0')}_${process.argv[2]}`;

fs.writeFileSync(
    path.join(MIGRATIONS_DIR, `${filename}.up.sql`),
    '-- up migrations'
);
fs.writeFileSync(
    path.join(MIGRATIONS_DIR, `${filename}.down.sql`),
    '-- down migrations'
);
