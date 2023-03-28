/* eslint-disable no-sync */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'node:path';
import fs  from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREATE_USERS_TABLE_SCRIPT_FILE_PATH = resolve(__dirname, 'create_users_table.sql');

const pool = new pg.Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

const createUsersTableScript = fs.readFileSync(CREATE_USERS_TABLE_SCRIPT_FILE_PATH, 'utf8');

pool.query(createUsersTableScript, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('create_users_table.sql script executed successfully');
    }
    pool.end();
});
